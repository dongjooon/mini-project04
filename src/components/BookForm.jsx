/**
 * [교안 미션 4. 등록·수정 연동 (Create / Update)]
 * - 새로운 도서를 등록하거나 기존 도서의 제목, 저자, 출판사, 본문 내용을 수정하는 폼 컴포넌트입니다.
 * - 신규 등록은 POST /newBook (실제 POST /books), 정보 수정은 PATCH /update/:id (실제 PATCH /books/:id) 엔드포인트를 호출합니다.
 * - React의 단방향 데이터 바인딩과 useState 훅을 이용해 입력 필드의 폼 상태(controlled component)를 관리합니다.
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, Divider, 
  Grid, CircularProgress, Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CreateIcon from '@mui/icons-material/Create';

export const BookForm = ({ bookId, onNavigate, onSaveSuccess }) => {
  /**
   * [React 실무 기법: 하나의 폼으로 등록/수정 동시 처리]
   * - bookId가 props로 전달되었는지 여부(!!bookId)를 Boolean 값으로 변환하여 수정(isEdit)인지 신규등록인지 판단합니다.
   */
  const isEdit = !!bookId;
  
  /**
   * [React 핵심 개념: Controlled Components (제어 컴포넌트)]
   * - 입력 폼의 상태 값을 저장할 React state를 정의합니다.
   * - HTML input의 value를 이 state에 지정하고, onChange 이벤트로 state를 바꾸어 폼 필드를 React가 완전히 제어합니다.
   */
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // 각 필드의 에러 여부를 추적하는 로컬 상태
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [contentError, setContentError] = useState(false);

  // 로딩 및 에러 처리 상태
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * [React 핵심 개념: useEffect Hook & 컴포넌트 라이프사이클]
   * - 컴포넌트가 렌더링될 때 특정 부수 효과(Side Effect - 여기서는 API 데이터 가져오기)를 수행합니다.
   * - 의존성 배열 [bookId, isEdit]에 지정된 값들이 바뀔 때에만 이 Effect 함수가 실행됩니다.
   * - 만약 수정 모드(isEdit)라면 API로부터 기존 도서 상세 데이터를 GET하여 form state에 미리 채워놓습니다.
   */
  useEffect(() => {
    if (isEdit && bookId) {
      const fetchBook = async () => {
        setFetchLoading(true);
        setErrorMessage(null);
        try {
          // 상세 조회를 위해 GET /bookInfo/:id 엔드포인트 호출
          const res = await fetch(`http://localhost:3000/bookInfo/${bookId}`);
          if (!res.ok) throw new Error('도서 정보를 가져오는 데 실패했습니다.');
          const data = await res.json();
          
          // 받아온 정보로 input state 일괄 업데이트 -> 화면에 기존 값들이 노출됨
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
      // 신규 등록 모드라면 폼 입력란들을 비워줍니다.
      setTitle('');
      setAuthor('');
      setPublisher('');
      setContent('');
      setCoverImageUrl('');
      setCreatedAt('');
      setErrorMessage(null);
    }
    
    // 유효성 에러 메시지 초기화
    setTitleError(false);
    setAuthorError(false);
    setContentError(false);
  }, [bookId, isEdit]);

  // [교안 Chapter 4 & 미션 4 심화 - 폼 유효성 검사 및 서버 전송]
  const handleSubmit = async (e) => {
    /**
     * [Web Standard 핵심 개념: e.preventDefault()]
     * - HTML form의 기본 submit 동작은 웹 페이지 전체를 새로고침(Reload)하게 만듭니다.
     * - Single Page Application(SPA)인 React의 상태 유지를 위해 페이지 새로고침을 방지하고, 
     *   대신 JavaScript 비동기 fetch를 통해 데이터를 백그라운드에서 전송합니다.
     */
    e.preventDefault();
    
    // 에러 상태 리셋
    setTitleError(false);
    setAuthorError(false);
    setContentError(false);
    setErrorMessage(null);

    let hasError = false;

    // [Modern JS 기법: String.prototype.trim()]
    // - 앞뒤 공백을 잘라낸 후 빈 문자열인지 확인하여 사용자가 띄어쓰기만 입력하여 통과하는 편법을 방지합니다.
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

    if (hasError) return; // 에러가 있으면 더 이상 비동기 요청을 진행하지 않고 함수를 조기 종료(Early Return)

    setLoading(true);

    const now = new Date().toISOString(); // ISO 8601 표준 포맷 날짜 생성

    try {
      let response;
      
      if (isEdit) {
        /**
         * [REST API 연동: PATCH 요청]
         * - 기존 리소스의 '부분 변경'을 수행하는 HTTP Method입니다.
         * - 수정된 값들만 바디에 직렬화(JSON.stringify)하여 전달하며, 헤더에 Content-Type을 명시합니다.
         */
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
        /**
         * [REST API 연동: POST 요청]
         * - 신규 리소스를 '생성'하는 HTTP Method입니다.
         * - db.json에 새롭게 등록될 도서 객체를 구성하여 요청 보냅니다.
         */
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
      onSaveSuccess(savedBook); // 부모 컴포넌트에 알림 콜백 실행
    } catch (err) {
      setErrorMessage(err.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 스피너 조건부 렌더링
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
      {/* 뒤로가기 버튼 */}
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

        {/* Form 시작 */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* 도서 제목 입력란 */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                disabled={loading}
                label="도서 제목"
                placeholder="도서의 제목을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)} // 사용자가 타이핑하면 state에 저장하여 화면에 업데이트
                error={titleError}
                helperText={titleError ? '도서 제목은 필수 입력 항목입니다.' : ''}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            {/* 작가명 입력란 */}
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

            {/* 출판사 입력란 (선택 사항) */}
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

            {/* 본문 소개 입력란 (장문형 - multiline) */}
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

          {/* 등록/취소 버튼 영역 */}
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

