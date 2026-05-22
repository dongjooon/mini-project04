/**
 * [교안 미션 3. 조회 기능 연동 (Read)]
 * - db.json 서버로부터 가져온 전체 도서 목록을 리스트 카드 그리드(MUI Card) 형태로 화면에 렌더링합니다.
 * - 사용자의 검색어에 맞춰 목록이 실시간으로 필터링되도록 배열의 filter 메소드를 적용했습니다.
 */
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

/**
 * [React 핵심 개념: 컴포넌트와 Props]
 * - BookList는 함수형 컴포넌트이며, 부모 컴포넌트(App.jsx)로부터 데이터를 받아와 화면을 구성합니다.
 * - { books, onNavigate, onDelete }: Modern JS 문법인 '객체 구조 분해 할당(Destructuring Assignment)'을 사용하여
 *   부모가 전달한 props 객체에서 필요한 속성들을 바로 변수로 추출하여 사용합니다.
 */
export const BookList = ({ books, onNavigate, onDelete }) => {
  /**
   * [React 핵심 개념: State(상태)]
   * - useState Hook을 사용하여 검색창의 입력값(searchQuery)을 컴포넌트 로컬 상태로 관리합니다.
   * - 사용자가 검색창에 글자를 입력할 때마다 setSearchQuery가 호출되어 searchQuery 값이 바뀌고, 
   *   React는 이 컴포넌트를 자동으로 '리렌더링(re-render)'하여 화면을 새로 그립니다.
   */
  const [searchQuery, setSearchQuery] = useState('');

  // [교안 Chapter 2 & 미션 3 심화 - 검색/필터 UI 구현]
  // - Modern JS 배열 메서드인 Array.prototype.filter()를 사용합니다.
  // - filter는 원본 배열(books)을 변경하지 않고(React의 '불변성' 원칙 준수), 조건에 맞는 항목들만 모아 '새로운 배열'을 반환합니다.
  // - includes() 메서드와 toLowerCase() 메서드를 연쇄적으로 호출(Method Chaining)하여 대소문자 구분 없이 
  //   제목(title), 저자(author), 출판사(publisher), 본문내용(content)에 검색어가 들어있는 도서만 걸러냅니다.
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.publisher && book.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
    book.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * [JavaScript 실무 패턴: 날짜 포맷 변환 함수]
   * - API 서버(json-server)에 저장된 ISO 8601 형식의 날짜 문자열(예: '2026-05-22T06:35:14Z')을
   *   한국인 사용자에게 친숙한 'YYYY. MM. DD.' 형식으로 변환해주는 헬퍼 함수입니다.
   */
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr; // 변환 중 에러 발생 시 원본 문자열을 그대로 반환하는 예외 처리
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 검색창(Search Input) 섹션 */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          placeholder="도서 제목, 작가 또는 본문 내용 검색..."
          value={searchQuery} // [양방향 바인딩/제어 컴포넌트]: input의 value를 React state에 연결
          onChange={(e) => setSearchQuery(e.target.value)} // 사용자가 타이핑할 때마다 state 업데이트
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
                {/* 검색어가 있을 때만 보여주는 '지우기(X)' 버튼 (단축 평가 / 논리곱 연산자 && 활용) */}
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* 도서 카드 리스트(Grid List) 섹션 */}
      {/* 삼항 연산자(Ternary Operator)를 사용한 조건부 렌더링: 검색 결과가 없을 때와 있을 때의 UI를 다르게 보여줍니다. */}
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
          {/* [React 핵심 개념: 리스트와 Key]
              - Modern JS 배열 메서드인 Array.prototype.map()을 사용하여 필터링된 도서 배열을 React 컴포넌트(Grid) 배열로 변환합니다.
              - React는 리스트 엘리먼트를 렌더링할 때 어떤 아이템이 추가, 수정, 삭제되었는지 빠르게 식별하기 위해 
                반드시 고유한 'key' props를 요구합니다. 여기서는 도서의 고유 ID(book.id)를 사용합니다. */}
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
                    transform: 'translateY(-6px)', // 마우스 호버 시 위로 살짝 뜨는 마이크로 인터랙션 효과
                    boxShadow: '0 12px 30px rgba(149, 157, 165, 0.2)',
                  }
                }}
              >
                {/* 도서 삭제 버튼 */}
                <Tooltip title="도서 삭제" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      /**
                       * [React 핵심 개념: 이벤트 버블링(전파) 방지]
                       * - e.stopPropagation()을 호출하지 않으면, 삭제 버튼 클릭 시 이벤트가 부모 엘리먼트로 전파(버블링)되어
                       *   도서 카드 클릭 이벤트인 '상세보기로 이동'까지 동시에 실행되는 버그가 발생합니다.
                       * - 이를 막기 위해 이벤트 전파를 중단시킵니다.
                       */
                      e.stopPropagation();
                      onDelete(book.id); // 부모로부터 받은 삭제 처리 함수 실행
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

                {/* 도서 커버 이미지 영역 */}
                {/* 조건부 렌더링: 커버 이미지가 있는 경우에는 CardMedia로 렌더링하고, 없는 경우에는 책 표지 템플릿(Box)을 렌더링합니다. */}
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
                    {/* 도서 표지가 없을 때 보여주는 세련된 가상 책 표지 레이아웃 (MUI Box 활용) */}
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

                {/* 도서 정보 텍스트 영역 */}
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

                  {/* 3줄을 넘어가면 생략(...) 처리를 하는 CSS 스타일링 적용 (WebkitLineClamp) */}
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

                  {/* 카드 하단 날짜 및 상세보기 버튼 영역 */}
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

