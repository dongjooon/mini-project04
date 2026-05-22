import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, FormControl, InputLabel, Select, MenuItem, 
  Box, Typography, CircularProgress, Alert, InputAdornment, IconButton 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';

export const AICoverModal = ({ open, book, onClose, onCoverGenerated }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [model, setModel] = useState('gpt-image-2');
  const [size, setSize] = useState('1024x1536');
  const [quality, setQuality] = useState('low');
  const [outputFormat, setOutputFormat] = useState('png');
  const [prompt, setPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize prompt template when modal opens
  useEffect(() => {
    if (open && book) {
      // Save previously used API key from local storage for convenience
      const savedKey = localStorage.getItem('openai_api_key');
      if (savedKey) setApiKey(savedKey);
      
      // Recommended template: title and content combined
      setPrompt(`A beautiful artistic book cover for a book titled "${book.title}", which is written by "${book.author}". The content is about: ${book.content}. Highly detailed, illustration style, no text on the cover.`);
      setError(null);
    }
  }, [open, book]);

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('OpenAI API Key를 입력해주세요.');
      return;
    }

    if (!prompt.trim()) {
      setError('이미지 생성 프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    // Save key in localStorage for convenience (masked in UI)
    localStorage.setItem('openai_api_key', apiKey);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          n: 1,
          size: size,
          quality: quality,
          response_format: 'b64_json' // Critical to get base64 data back!
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP 에러 ${response.status}`;
        
        if (response.status === 401) {
          throw new Error('API Key가 올바르지 않습니다. 키를 다시 확인해주세요.');
        } else if (response.status === 429) {
          throw new Error('요청 제한(Rate Limit)을 초과했거나 사용 가능한 크레딧이 부족합니다.');
        } else {
          throw new Error(`OpenAI 요청 실패: ${errMsg}`);
        }
      }

      const resData = await response.json();
      const b64Json = resData.data?.[0]?.b64_json;
      
      if (!b64Json) {
        throw new Error('응답데이터에서 이미지(b64_json)를 추출하지 못했습니다.');
      }

      // Convert to Data URL
      const dataUrl = `data:image/${outputFormat};base64,${b64Json}`;

      // Save to json-server via PATCH request
      const patchRes = await fetch(`http://localhost:3000/imageGen/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coverImageUrl: dataUrl,
          updatedAt: new Date().toISOString()
        })
      });

      if (!patchRes.ok) {
        throw new Error('이미지는 생성되었으나, 로컬 서버에 표지를 저장하는 데 실패했습니다.');
      }

      // Success
      onCoverGenerated(dataUrl);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || '알 수 없는 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#1e3c72', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>AI 도서 표지 자동 생성</span>
        {!loading && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ borderRadius: '8px' }}>
            OpenAI API를 직접 호출하므로 이미지 생성 시 비용이 발생할 수 있습니다. 입력한 API Key는 로컬 브라우저에만 저장되며 외부로 유출되지 않습니다.
          </Alert>

          {/* API Key */}
          <TextField
            label="OpenAI API Key"
            type={showApiKey ? 'text' : 'password'}
            fullWidth
            required
            disabled={loading}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle api key visibility"
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                    disabled={loading}
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Model / Size Parameters */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>생성 모델</InputLabel>
              <Select
                value={model}
                label="생성 모델"
                onChange={(e) => setModel(e.target.value)}
              >
                <MenuItem value="gpt-image-2">gpt-image-2 (교안 표준)</MenuItem>
                <MenuItem value="dall-e-3">dall-e-3 (DALL-E 최신)</MenuItem>
                <MenuItem value="dall-e-2">dall-e-2 (클래식)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={loading}>
              <InputLabel>이미지 크기</InputLabel>
              <Select
                value={size}
                label="이미지 크기"
                onChange={(e) => setSize(e.target.value)}
              >
                <MenuItem value="1024x1536">1024 x 1536 (권장 세로형)</MenuItem>
                <MenuItem value="1024x1024">1024 x 1024 (정사각형)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>품질</InputLabel>
              <Select
                value={quality}
                label="품질"
                onChange={(e) => setQuality(e.target.value)}
              >
                <MenuItem value="low">Low (빠름/비용 절감)</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="auto">Auto (자동)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={loading}>
              <InputLabel>출력 포맷</InputLabel>
              <Select
                value={outputFormat}
                label="출력 포맷"
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="webp">WEBP</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Prompt */}
          <TextField
            label="이미지 생성 프롬프트"
            multiline
            rows={4}
            fullWidth
            required
            disabled={loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            helperText="도서 제목과 내용을 기반으로 자동 생성된 템플릿입니다. 원하는 스타일에 맞게 직접 수정할 수 있습니다."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ color: '#555', fontWeight: 600 }}
        >
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
          sx={{
            bgcolor: '#1e3c72',
            fontWeight: 700,
            px: 3,
            '&:hover': { bgcolor: '#2a5298' }
          }}
        >
          {loading ? '표지 생성 및 저장 중...' : '표지 생성하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
