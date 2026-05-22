import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, Divider, 
  Grid, CircularProgress, Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CreateIcon from '@mui/icons-material/Create';

export const BookForm = ({ bookId, onNavigate, onSaveSuccess }) => {
  const isEdit = !!bookId;
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch book details if we are in Edit mode
  useEffect(() => {
    if (isEdit && bookId) {
      const fetchBook = async () => {
        setFetchLoading(true);
        setErrorMessage(null);
        try {
          const res = await fetch(`http://localhost:3000/bookInfo/${bookId}`);
          if (!res.ok) throw new Error('도서 정보를 가져오는 데 실패했습니다.');
          const data = await res.json();
          setTitle(data.title);
          setAuthor(data.author);
          setPublisher(data.publisher || '');
          setContent(data.content);
          setCoverImageUrl(data.coverImageUrl);
          setCreatedAt(data.createdAt);
        } catch (err) {
          setErrorMessage(err.message);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchBook();
    } else {
      // Clear fields if Add mode
      setTitle('');
      setAuthor('');
      setPublisher('');
      setContent('');
      setCoverImageUrl('');
      setCreatedAt('');
      setErrorMessage(null);
    }
    
    // Reset validation errors
    setTitleError(false);
    setAuthorError(false);
    setContentError(false);
  }, [bookId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setTitleError(false);
    setAuthorError(false);
    setContentError(false);
    setErrorMessage(null);

    let hasError = false;

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    }
    if (!author.trim()) {
      setAuthorError(true);
      hasError = true;
    }
    if (!content.trim()) {
      setContentError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const now = new Date().toISOString();

    try {
      let response;
      
      if (isEdit) {
        // Edit mode (PATCH)
        response = await fetch(`http://localhost:3000/update/${bookId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title.trim(),
            author: author.trim(),
            publisher: publisher.trim(),
            content: content.trim(),
            updatedAt: now
          })
        });
      } else {
        // Create mode (POST)
        response = await fetch('http://localhost:3000/newBook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title.trim(),
            author: author.trim(),
            publisher: publisher.trim(),
            content: content.trim(),
            coverImageUrl: '',
            createdAt: now,
            updatedAt: now
          })
        });
      }

      if (!response.ok) {
        throw new Error(isEdit ? '도서 정보를 수정하지 못했습니다.' : '신규 도서를 등록하지 못했습니다.');
      }

      const savedBook = await response.json();
      onSaveSuccess(savedBook);
    } catch (err) {
      setErrorMessage(err.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={45} sx={{ color: '#1e3c72', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#78909c', fontWeight: 600 }}>
          도서 정보를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', animation: 'fadeIn 0.5s ease' }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => isEdit ? onNavigate('detail', bookId) : onNavigate('list')}
        disabled={loading}
        sx={{
          mb: 3,
          color: '#1e3c72',
          fontWeight: 700,
          '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.05)' }
        }}
      >
        {isEdit ? '도서 상세 정보로 이동' : '목록으로 돌아가기'}
      </Button>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          p: { xs: 3, md: 5 },
          bgcolor: '#fff',
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 900,
            color: '#1e2d4a',
            mb: 1,
            fontFamily: '"Outfit", "Inter", sans-serif'
          }}
        >
          {isEdit ? '도서 정보 수정' : '새 도서 등록'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 3 }}>
          {isEdit ? '작품의 정보와 내용을 수정하여 업데이트하세요.' : '집필하고 계신 새로운 작품의 정보를 기입해주세요.'}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Title Input */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                disabled={loading}
                label="도서 제목"
                placeholder="도서의 제목을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={titleError}
                helperText={titleError ? '도서 제목은 필수 입력 항목입니다.' : ''}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            {/* Author Input */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                disabled={loading}
                label="작가명"
                placeholder="작가의 이름을 입력하세요."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                error={authorError}
                helperText={authorError ? '작가명은 필수 입력 항목입니다.' : ''}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            {/* Publisher Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled={loading}
                label="출판사"
                placeholder="출판사 이름을 입력하세요. (선택 사항)"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            {/* Content Input */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={10}
                disabled={loading}
                label="내용 및 작품 소개"
                placeholder="도서의 내용이나 상세한 작품 정보를 입력하세요. 이 내용은 인공지능이 도서 표지 이미지를 생성할 때 핵심 프롬프트의 기초 정보로 활용됩니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={contentError}
                helperText={contentError ? '도서 내용은 필수 입력 항목입니다.' : ''}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              onClick={() => isEdit ? onNavigate('detail', bookId) : onNavigate('list')}
              disabled={loading}
              sx={{ color: '#555', fontWeight: 600 }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isEdit ? <CreateIcon /> : <SaveIcon />)}
              sx={{
                bgcolor: '#1e3c72',
                fontWeight: 700,
                px: 3,
                py: 1.25,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#2a5298' }
              }}
            >
              {loading ? '저장 중...' : (isEdit ? '수정 완료' : '등록하기')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
