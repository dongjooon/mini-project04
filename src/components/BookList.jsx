import React, { useState } from 'react';
import { 
  Grid, Card, CardContent, CardMedia, Typography, Button, 
  Box, TextField, InputAdornment, IconButton, Tooltip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClearIcon from '@mui/icons-material/Clear';

export const BookList = ({ books, onNavigate, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.publisher && book.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
    book.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          placeholder="도서 제목, 작가 또는 본문 내용 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: '600px',
            bgcolor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&.Mui-focused fieldset': {
                borderColor: '#1e3c72',
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#1e3c72' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Grid List */}
      {filteredBooks.length === 0 ? (
        <Box 
          sx={{ 
            py: 8, 
            textAlign: 'center', 
            bgcolor: '#fff', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
          }}
        >
          <MenuBookIcon sx={{ fontSize: '4.5rem', color: '#b0bec5', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#78909c', fontWeight: 600 }}>
            {searchQuery ? '검색 결과에 맞는 도서가 없습니다.' : '등록된 도서가 없습니다.'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cfd8dc', mt: 1 }}>
            {searchQuery ? '다른 키워드로 검색해 보세요!' : '오른쪽 상단 "새 도서 등록" 버튼을 눌러 도서를 작성해보세요!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3.5}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(149, 157, 165, 0.12)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 30px rgba(149, 157, 165, 0.2)',
                  }
                }}
              >
                {/* Delete Button Overlay */}
                <Tooltip title="도서 삭제" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(book.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#d32f2f',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: '#d32f2f',
                        color: '#fff',
                      },
                      zIndex: 2
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Cover Image Area */}
                {book.coverImageUrl ? (
                  <CardMedia
                    component="img"
                    height="320"
                    image={book.coverImageUrl}
                    alt={book.title}
                    onClick={() => onNavigate('detail', book.id)}
                    sx={{ cursor: 'pointer', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    onClick={() => onNavigate('detail', book.id)}
                    sx={{
                      height: '320px',
                      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      p: 3,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative book pages background effect */}
                    <Box 
                      sx={{ 
                        width: '75%', 
                        height: '80%', 
                        bgcolor: 'rgba(255,255,255,0.75)', 
                        borderRadius: '4px 12px 12px 4px', 
                        boxShadow: 'inset 4px 0 6px rgba(0,0,0,0.05), 4px 4px 10px rgba(0,0,0,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                      }}
                    >
                      <MenuBookIcon sx={{ fontSize: '3rem', color: '#1e3c72', opacity: 0.15, mb: 1.5 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e3c72', lineHeight: 1.3, mb: 0.5 }}>
                        {book.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 600, mb: book.publisher ? 0.5 : 0 }}>
                        {book.author}
                      </Typography>
                      {book.publisher && (
                        <Typography variant="caption" sx={{ color: '#78909c', fontSize: '0.75rem', fontWeight: 500 }}>
                          {book.publisher}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Content Area */}
                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    onClick={() => onNavigate('detail', book.id)}
                    sx={{ 
                      fontWeight: 800, 
                      color: '#2c3e50', 
                      mb: 1,
                      cursor: 'pointer',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      '&:hover': { color: '#1e3c72' }
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>
                    작가 {book.author} {book.publisher ? `| ${book.publisher}` : ''}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#555', 
                      mb: 3,
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      flexGrow: 1
                    }}
                  >
                    {book.content}
                  </Typography>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: '1px solid #f0f0f0',
                      pt: 2,
                      mt: 'auto'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#95a5a6', fontWeight: 500 }}>
                      등록일: {formatDate(book.createdAt)}
                    </Typography>

                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => onNavigate('detail', book.id)}
                      sx={{ 
                        color: '#1e3c72', 
                        fontWeight: 700,
                        '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.05)' }
                      }}
                    >
                      상세보기
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
