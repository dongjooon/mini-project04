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

export const BookDetail = ({ book, onNavigate, onDelete, onCoverUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    onDelete(book.id);
  };

  return (
    <Box sx={{ width: '100%', animation: 'fadeIn 0.5s ease' }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => onNavigate('list')}
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
          {/* Left Column: Cover & Quick Actions */}
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

            {/* Quick Actions (AI Gen, Edit, Delete) */}
            <Box sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                onClick={() => setModalOpen(true)}
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => onNavigate('form', book.id)}
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
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteConfirmOpen(true)}
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

          {/* Right Column: Book Metadata & Content */}
          <Grid item xs={12} md={7.5} display="flex" flexDirection="column">
            {/* Header info */}
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

            {/* Timestamps */}
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

            {/* Book Body Content */}
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
                  whiteSpace: 'pre-wrap',
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

      {/* AI Cover Gen Modal */}
      <AICoverModal
        open={modalOpen}
        book={book}
        onClose={() => setModalOpen(false)}
        onCoverGenerated={(newUrl) => onCoverUpdated(book.id, newUrl)}
      />

      {/* Delete Confirmation Alert Dialog */}
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
