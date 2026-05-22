/**
 * [교안 미션 3. 조회 기능 연동 (Read)]
 * - 특정 도서 카드를 선택하면 해당 도서의 고유 ID를 전달받아 상세 페이지를 구성합니다.
 * - 제목, 작가, 출판사, 등록/수정일, 본문 내용과 함께 AI 이미지 생성 기능을 수행할 수 있는 인터페이스를 제공합니다.
 * - 도서 상세 조회의 경우 팀 API 가이드에 맞추어 GET /bookInfo/:id (실제로는 routes.json을 통해 GET /books/:id로 매핑됨) 형식으로 통신합니다.
 */
import React, { useState } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Divider, Chip, 
  Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { AICoverModal } from './AICoverModal';

/**
 * [React 핵심 개념: 컴포넌트와 데이터 흐름]
 * - BookDetail 컴포넌트는 단일 도서 객체인 'book'과 네비게이션 함수, 삭제 및 표지 업데이트 함수를 
 *   부모(App.jsx)로부터 전달받아 화면을 렌더링합니다.
 */
export const BookDetail = ({ book, onNavigate, onDelete, onCoverUpdated }) => {
  /**
   * [React 핵심 개념: UI 모달 상태 제어]
   * - modalOpen: AI 표지 생성 모달 다이얼로그(AICoverModal)를 열고 닫는 스위치 상태
   * - deleteConfirmOpen: 도서를 삭제할 때 오작동을 방지하기 위해 사용자에게 한 번 더 묻는 '삭제 확인 팝업' 상태
   */
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /**
   * [JavaScript 내장 Date 객체 활용]
   * - toLocaleString을 사용하여 원본 타임스탬프 문자열을 보기 편한 한글 형식(예: 2026년 5월 22일 오후 3시 34분)으로 가공합니다.
   */
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // [교안 미션 4. 삭제 연동 (Delete)]
  // - 사용자가 다이얼로그 창에서 최종적으로 '삭제하기' 버튼을 누르면 이 함수가 실행됩니다.
  // - 우선 다이얼로그 창을 닫고(state 변경), 부모 컴포넌트의 onDelete 콜백 함수를 호출하여 API 요청을 보내도록 처리합니다.
  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    onDelete(book.id);
  };

  return (
    <Box sx={{ width: '100%', animation: 'fadeIn 0.5s ease' }}>
      {/* 뒤로가기 버튼 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => onNavigate('list')} // 리스트 화면으로 이동하는 콜백 실행
        sx={{
          mb: 3,
          color: '#1e3c72',
          fontWeight: 700,
          '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.05)' }
        }}
      >
        도서 목록으로 돌아가기
      </Button>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          bgcolor: '#fff',
          p: { xs: 3, md: 5 }
        }}
      >
        <Grid container spacing={5}>
          {/* Left Column: 책 표지 이미지 영역 및 기능 동작 버튼들 */}
          <Grid item xs={12} md={4.5} display="flex" flexDirection="column" alignItems="center">
            <Box
              sx={{
                width: '100%',
                maxWidth: '320px',
                height: '460px',
                borderRadius: '16px',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                mb: 4
              }}
            >
              {/* [React 핵심 개념: 조건부 렌더링]
                  - book.coverImageUrl이 존재하면 실제 책 표지 이미지를 보여주고,
                    없다면 기본 책 모양의 세련된 템플릿 표지를 생성해 보여줍니다. */}
              {book.coverImageUrl ? (
                <Box
                  component="img"
                  src={book.coverImageUrl}
                  alt={book.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <Box
                    sx={{
                      width: '85%',
                      height: '85%',
                      bgcolor: 'rgba(255,255,255,0.85)',
                      borderRadius: '4px 16px 16px 4px',
                      boxShadow: 'inset 4px 0 6px rgba(0,0,0,0.05), 4px 4px 10px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3
                    }}
                  >
                    <MenuBookIcon sx={{ fontSize: '4.5rem', color: '#1e3c72', opacity: 0.1, mb: 3 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e3c72', mb: 1, lineHeight: 1.3 }}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5c6bc0', fontWeight: 600, mb: book.publisher ? 1 : 3 }}>
                      {book.author}
                    </Typography>
                    {book.publisher && (
                      <Typography variant="caption" sx={{ color: '#78909c', fontWeight: 500, mb: 3 }}>
                        {book.publisher}
                      </Typography>
                    )}
                    <Chip 
                      label="표지 없음" 
                      color="secondary" 
                      size="small" 
                      sx={{ bgcolor: '#e0e0e0', color: '#757575', fontWeight: 600 }} 
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {/* 도서 상세 기능 버튼 목록 */}
            <Box sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* OpenAI DALL-E 기반 이미지 생성 모달 호출 버튼 */}
              <Button
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                onClick={() => setModalOpen(true)} // 클릭 시 modalOpen 상태를 true로 설정하여 모달 노출
                sx={{
                  py: 1.5,
                  bgcolor: '#ffc107',
                  color: '#1e3c72',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(255, 193, 7, 0.3)',
                  '&:hover': {
                    bgcolor: '#ffb300',
                    boxShadow: '0 6px 20px rgba(255, 193, 7, 0.4)',
                  }
                }}
              >
                AI 표지 이미지 생성
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* 도서 수정 버튼 */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => onNavigate('form', book.id)} // 폼 화면으로 가면서 도서 ID 전달
                  sx={{
                    py: 1.25,
                    color: '#1e3c72',
                    borderColor: '#1e3c72',
                    fontWeight: 700,
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#2a5298',
                      bgcolor: 'rgba(30, 60, 114, 0.04)',
                    }
                  }}
                >
                  수정
                </Button>
                {/* 도서 삭제 버튼 */}
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteConfirmOpen(true)} // 안전한 UX: 바로 삭제 요청을 보내기 전 확인 다이얼로그 열기
                  sx={{
                    py: 1.25,
                    fontWeight: 700,
                    borderRadius: '12px',
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                    }
                  }}
                >
                  삭제
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: 책 텍스트 정보 메타데이터 및 소개 내용 */}
          <Grid item xs={12} md={7.5} display="flex" flexDirection="column">
            {/* 책 제목 */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 900,
                color: '#1e2d4a',
                lineHeight: 1.25,
                mb: 1.5,
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontFamily: '"Outfit", "Inter", sans-serif'
              }}
            >
              {book.title}
            </Typography>

            {/* 작가 및 출판사 정보 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 4 }, mb: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#7f8c8d' }} />
                <Typography variant="h6" sx={{ color: '#555', fontWeight: 600 }}>
                  작가 <span style={{ color: '#1e3c72', fontWeight: 800 }}>{book.author}</span>
                </Typography>
              </Box>
              {book.publisher && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ color: '#7f8c8d' }} />
                  <Typography variant="h6" sx={{ color: '#555', fontWeight: 600 }}>
                    출판사 <span style={{ color: '#1e3c72', fontWeight: 800 }}>{book.publisher}</span>
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 생성일/수정일 정보 섹션 */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: { xs: 2, sm: 4 }, 
                mb: 4, 
                bgcolor: '#f8fafc',
                p: 2,
                borderRadius: '12px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  최초 등록일: <span style={{ color: '#334155', fontWeight: 700 }}>{formatDate(book.createdAt)}</span>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UpdateIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  마지막 수정일: <span style={{ color: '#334155', fontWeight: 700 }}>{formatDate(book.updatedAt)}</span>
                </Typography>
              </Box>
            </Box>

            {/* 도서 설명 본문 내용 */}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e2d4a', mb: 1.5 }}>
              작품 소개 및 본문 내용
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#fcfdfe',
                border: '1px solid #eef2f6',
                borderRadius: '16px',
                p: 3,
                flexGrow: 1,
                minHeight: '200px',
                mb: 2
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#334155', 
                  lineHeight: 1.8, 
                  whiteSpace: 'pre-wrap', // 줄바꿈(\n) 문자열을 HTML 화면상에도 줄바꿈으로 표현해주는 CSS 속성
                  fontWeight: 500,
                  fontSize: '1.05rem'
                }}
              >
                {book.content}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* AI Cover Gen Modal (AI 표지 생성 모달 컴포넌트) */}
      {/* 
        [React 핵심 개념: 컴포넌트 통신 & 콜백 Props]
        - open: 자식 모달의 오픈 여부 상태를 props로 주입합니다.
        - book: 표지 생성 시 타이틀과 키워드를 분석하기 위해 책 정보 객체를 전달합니다.
        - onClose: 자식 모달 내부에서 '닫기'를 누르면 부모(BookDetail)의 state를 변경시켜 모달을 닫아줍니다.
        - onCoverGenerated: AI 표지 이미지가 정상 생성되었을 때 실행할 부모의 이미지 업데이트 비즈니스 로직입니다.
      */}
      <AICoverModal
        open={modalOpen}
        book={book}
        onClose={() => setModalOpen(false)}
        onCoverGenerated={(newUrl) => onCoverUpdated(book.id, newUrl)}
      />

      {/* Delete Confirmation Alert Dialog (삭제 확인 대화 상자) */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#d32f2f' }}>
          도서 삭제 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', fontWeight: 500 }}>
            정말로 <strong>"{book.title}"</strong> 도서를 삭제하시겠습니까? 삭제된 정보는 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: '#555', fontWeight: 600 }}>
            취소
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ fontWeight: 700, borderRadius: '8px' }}
            autoFocus
          >
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

