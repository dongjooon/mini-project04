/**
 * [교안 미션 5. OpenAI 표지 생성 연동 & 미션 6. 저장 및 UX 완성]
 * - OpenAI 이미지 생성 API(POST /v1/images/generations)를 호출하여 도서 제목과 내용을 기반으로 표지 이미지를 자동 생성합니다.
 * - API Key 입력란을 password 필드로 구현하고 로컬 스토리지와 연동하여 사용자 보안 및 편의성을 극대화했습니다.
 * - 생성된 이미지(b64_json)를 Data URL 포맷으로 변환한 뒤, local db.json 서버에 PATCH 요청으로 전송하여 저장합니다.
 */
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
  /**
   * [React 핵심 개념: 이미지 생성 파라미터 상태 관리]
   * - apiKey: 사용자가 입력한 OpenAI API 인증 키
   * - showApiKey: 패스워드 마스킹(***) 처리 토글 플래그
   * - model: 교안에서 사용하는 gpt-image-2 또는 dall-e-3 모델
   * - size: 이미지 크기 (1024x1536 세로형 권장)
   * - quality: 이미지 해상도/품질 수준
   * - outputFormat: 변환할 포맷 확장자
   * - prompt: AI 이미지 생성 시 넘겨줄 핵심 지시문(Prompt)
   */
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [model, setModel] = useState('gpt-image-2');
  const [size, setSize] = useState('1024x1536');
  const [quality, setQuality] = useState('low');
  const [outputFormat, setOutputFormat] = useState('png');
  const [prompt, setPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * [Browser API: localStorage & Prompt Engineering]
   * - localStorage.getItem('openai_api_key'): 매번 API Key를 입력해야 하는 불편함을 덜어주기 위해 
   *   브라우저의 로컬 저장소에 안전하게 키를 임시 보관해두고 로딩 시 채워줍니다.
   * - 프롬프트 템플릿 조립: 도서의 제목(book.title), 작가(book.author), 본문내용(book.content)을 조합하여
   *   OpenAI DALL-E 모델이 가장 이해하기 쉬운 상세한 영어 텍스트 템플릿(Backtick 활용)으로 조립하여 prompt state에 세팅합니다.
   */
  useEffect(() => {
    if (open && book) {
      // 로컬스토리지에서 기존 키 자동 복구
      const savedKey = localStorage.getItem('openai_api_key');
      if (savedKey) setApiKey(savedKey);
      
      // AI가 텍스트(문자)를 그리는 것을 피하기 위한 네거티브 키워드("no text on the cover")를 포함한 고품질 프롬프트 설계
      setPrompt(`A beautiful artistic book cover for a book titled "${book.title}", which is written by "${book.author}". The content is about: ${book.content}. Highly detailed, illustration style, no text on the cover.`);
      setError(null);
    }
  }, [open, book]);

  // [교안 미션 5 & 6 - OpenAI 이미지 생성 및 DB 저장 핵심 핸들러]
  const handleGenerate = async () => {
    // 1단계: 유효성 검증
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

    // API Key를 다음 사용 시 편리하도록 로컬 브라우저 저장소에 저장
    localStorage.setItem('openai_api_key', apiKey);

    try {
      /**
       * [OpenAI 이미지 생성 API 연동]
       * - endpoint: POST https://api.openai.com/v1/images/generations
       * - headers: Bearer <ApiKey>로 인증
       * - body: DALL-E가 요구하는 파라미터 규격(JSON 포맷)
       *         * response_format: 'b64_json' -> 생성된 이미지를 파일 URL이 아닌 Base64 인코딩 텍스트 원본으로 반환받아 
       *           우리의 local db.json에 직접 파일 통째로 저장(Data URL 패턴)할 수 있게 해줍니다.
       */
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
          response_format: 'b64_json' // base64로 가져오기 위한 핵심 속성
        })
      });

      // HTTP 응답 코드가 200번대가 아닐 경우 상황별 친절한 에러 핸들링
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

      /**
       * [Web Standard 기법: Data URL 포맷 변환]
       * - Base64 텍스트 데이터를 `data:image/png;base64,iVBORw0KGgo...` 포맷의 Data URL 문자열로 가공합니다.
       * - 이 포맷은 별도의 서버에 이미지를 업로드하지 않고도 브라우저 <img> 태그의 src 속성에 바로 넣어 렌더링이 가능합니다.
       */
      const dataUrl = `data:image/${outputFormat};base64,${b64Json}`;

      /**
       * [교안 미션 6. 생성된 이미지 저장 연동]
       * - 로컬 json-server에 PATCH 요청을 보냅니다.
       * - URL: http://localhost:3000/imageGen/:id (실제로는 routes.json 설정에 의해 PATCH /books/:id로 매핑됨)
       * - body: 새로 생성한 base64 Data URL 문자열을 coverImageUrl 컬럼에 주입합니다.
       */
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

      // 최종적으로 이미지가 데이터베이스에 기록 완료되면 콜백으로 부모 컴포넌트에 통보하여 
      // 화면의 이미지 뷰를 리프레시해줍니다.
      onCoverGenerated(dataUrl);
      onClose(); // 모달 닫기
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
      {/* 타이틀 및 닫기 버튼 */}
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

          {/* API Key 입력란 (Password 마스킹 기능 제공) */}
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
                  {/* API Key 보이기/숨기기 토글 아이콘 */}
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

          {/* Prompt 입력란 */}
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

      {/* 모달 하단 액션 영역 */}
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

