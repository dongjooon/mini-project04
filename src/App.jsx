/**
 * [교안 Chapter 3, 4, 5 & 미션 2, 3, 4. 메인 어플리케이션 관리자]
 * - 도서관리시스템의 전체 State(books, view, selectedBookId, loading, error)를 중앙 집중형으로 관리합니다.
 * - 'list'(목록), 'detail'(상세), 'form'(등록/수정) 등의 화면 상태를 'view' state로 다루는 단일 페이지 애플리케이션(SPA) 구조를 갖춥니다.
 * - fetch API를 이용해 로컬 json-server와 연동하여 C/R/U/D 통신 처리를 담당합니다.
 */
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BookList } from './components/BookList';
import { BookDetail } from './components/BookDetail';
import { BookForm } from './components/BookForm';
import { Box, CircularProgress, Typography, Alert, ThemeProvider, createTheme } from '@mui/material';

// [교안 Chapter 1 & 부록 - MUI 테마 커스터마이징]
// - Google Fonts에서 가져온 Outfit, Inter, Noto Sans KR 폰트를 지정하여 디자인의 일관성을 높입니다.
// - 주조색(primary)과 보조색(secondary), 그리고 배경색(background)을 정교하게 세팅합니다.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3c72',
      dark: '#2a5298',
    },
    secondary: {
      main: '#ffc107',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Noto Sans KR", sans-serif',
  },
});

function App() {
  // [교안 Chapter 4 Unit 1 - useState: React의 기억 장치]
  // - 컴포넌트가 유지해야 하는 동적인 값들을 state로 관리합니다.
  // - state 값이 변경되면 React가 가상 DOM을 활용하여 화면을 자동으로 리렌더링합니다.
  const [view, setView] = useState('list');                  // 현재 화면 보기 상태 ('list' | 'detail' | 'form')
  const [selectedBookId, setSelectedBookId] = useState(null); // 선택된 도서의 고유 ID
  const [books, setBooks] = useState([]);                     // 전체 도서 목록 배열 데이터
  const [loading, setLoading] = useState(false);              // 서버 데이터 호출 중 로딩 스피너 표시 여부
  const [error, setError] = useState(null);                   // 에러 발생 시 에러 메시지 보관

  // [교안 Chapter 5 & 미션 3 - GET 요청 및 비동기(async/await) 통신]
  // - 로컬 db.json 서버로부터 GET /books 요청을 보내 도서 목록 데이터를 불러옵니다.
  // - 비동기 처리의 표준인 async/await와 에러 핸들링을 위한 try-catch 블록을 활용합니다.
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/books');
      
      // [교안 Chapter 5 Unit 2 - HTTP 응답 상태 코드 검증]
      // - response.ok는 HTTP 응답 코드가 200~299 범위일 때 true가 됩니다. false면 강제로 에러를 throw합니다.
      if (!response.ok) {
        throw new Error('데이터베이스 서버로부터 도서 정보를 불러오지 못했습니다. json-server가 켜져 있는지 확인해주세요.');
      }
      
      // [교안 Chapter 5 Unit 2 - JSON 응답 파싱]
      // - response.json() 또한 Promise를 반환하므로 await로 파싱 완료를 기다립니다.
      const data = await response.json();
      
      // [교안 Chapter 2 Unit 2 - Modern JavaScript 정렬 기능]
      // - 신규 도서가 위로 올라오도록 생성일자(createdAt) 기준 내림차순(descending) 정렬을 적용합니다.
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // fetch 완료 후 상태를 변경하여 화면을 갱신합니다.
      setBooks(sorted);
    } catch (err) {
      console.error(err);
      setError(err.message || '데이터 연동 에러가 발생했습니다.');
    } finally {
      // 성공/실패 여부와 무관하게 로딩 상태는 항상 해제(false)합니다.
      setLoading(false);
    }
  };

  // [교안 Chapter 5 & 미션 3 - useEffect 생명주기 관리]
  // - 의존성 배열이 빈 배열([])이므로 컴포넌트가 최초 화면에 마운트(렌더링)된 직후에만 실행됩니다.
  useEffect(() => {
    fetchBooks();
  }, []);

  // [교안 Chapter 4 Unit 2 - 이벤트 핸들러 및 네비게이션]
  // - 화면 전환(view state 변경)과 선택된 도서 ID 제어를 수행하는 전역 네비게이션 핸들러입니다.
  const handleNavigation = (nextView, id = null) => {
    setView(nextView);
    setSelectedBookId(id);
    if (nextView === 'list') {
      fetchBooks(); // 목록 화면으로 돌아올 때는 최신 데이터를 다시 서버에서 불러옵니다.
    }
  };

  // [교안 Chapter 5 & 미션 4 - DELETE 요청 및 비동기 통신]
  // - DELETE 메서드로 지정한 도서를 DB에서 삭제합니다.
  // - API 가이드라인대로 DELETE /bookDelete/:id (routes.json 연동)로 매핑되어 통신합니다.
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/bookDelete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('서버에서 도서를 삭제하는 데 실패했습니다.');
      }
      
      // [교안 Chapter 4 & 미션 4 - 삭제 상태 불변성 패턴 (filter)]
      // - Array.prototype.filter()를 사용하여 삭제 대상(id)을 제외한 신규 배열을 반환받아 상태값에 반영합니다.
      // - React는 객체나 배열의 참조값이 바뀌어야 변경으로 인지하므로 불변성 유지가 필수적입니다.
      setBooks(prev => prev.filter(b => b.id !== id));
      
      // 상세 화면에서 현재 보고 있는 도서가 삭제된 경우, 목록 화면으로 리다이렉션합니다.
      if (view === 'detail' && selectedBookId === id) {
        setView('list');
        setSelectedBookId(null);
      }
    } catch (err) {
      alert(err.message || '도서 삭제 처리 중 오류가 발생했습니다.');
    }
  };

  // [교안 Chapter 4 & 미션 4 - 저장(추가/수정) 성공 처리 및 불변성 패턴]
  // - 도서 등록 또는 수정 폼의 저장 작업이 성공적으로 완료되면 호출되는 핸들러입니다.
  const handleSaveSuccess = (savedBook) => {
    setBooks(prev => {
      // 기존에 존재하는 도서인지 확인 (수정인 경우 true)
      const exists = prev.some(b => b.id === savedBook.id);
      if (exists) {
        // [수정 상태 불변성 패턴 (map)]
        // - Array.prototype.map()을 사용하여 수정된 책 항목(savedBook.id)만 신규 객체로 교체합니다.
        return prev.map(b => b.id === savedBook.id ? savedBook : b);
      } else {
        // [추가 상태 불변성 패턴 (spread)]
        // - ES6 Spread 연산자([...prev])를 사용하여 기존 목록 앞에 신규 도서(savedBook)를 위치시킵니다.
        return [savedBook, ...prev];
      }
    });
    
    // 저장 완료 후 상세 조회 화면으로 화면을 전환합니다.
    setView('detail');
    setSelectedBookId(savedBook.id);
  };

  // AI 표지 이미지 생성 완료 시 coverImageUrl 상태를 업데이트하는 함수
  const handleCoverUpdated = (bookId, newCoverUrl) => {
    // [교안 Chapter 4 & 미션 6 - 불변성을 지키는 map 패턴 응용]
    // - 해당 ID의 도서 객체만 복사해 coverImageUrl 값을 새로운 URL로 교체합니다.
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, coverImageUrl: newCoverUrl } : b));
  };

  // [교안 Chapter 2 Unit 2 - Array.prototype.find() 활용]
  // - 현재 선택된 selectedBookId와 일치하는 도서 객체 하나를 배열에서 추출합니다.
  const getSelectedBook = () => {
    return books.find(b => b.id === selectedBookId) || null;
  };

  // [교안 Chapter 3 Unit 3 - 조건부 렌더링 (Conditional Rendering)]
  // - loading, error, view 상태에 따라 렌더링할 JSX 요소를 다르게 리턴합니다.
  const renderContent = () => {
    // 1. 전체 화면 로딩 상태일 때 표시할 스피너
    if (loading && books.length === 0) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, py: 12 }}>
          <CircularProgress size={55} sx={{ color: '#1e3c72', mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
            도서 목록을 로딩 중입니다...
          </Typography>
        </Box>
      );
    }

    // 2. 서버 연결 에러 발생 시 표시할 알림창
    if (error && books.length === 0) {
      return (
        <Box sx={{ py: 6 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              서버 연결 에러
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}>
              터미널에서 <code>npm run server</code> 명령어가 구동 중인지 확인해주세요. (3000번 포트)
            </Typography>
            <button 
              onClick={fetchBooks}
              style={{
                background: '#d32f2f',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              다시 연결 시도
            </button>
          </Alert>
        </Box>
      );
    }

    // 3. view 상태에 따른 페이지 컴포넌트 스위칭 (Router 역할)
    switch (view) {
      case 'detail':
        const selectedBook = getSelectedBook();
        return selectedBook ? (
          <BookDetail
            book={selectedBook}
            onNavigate={handleNavigation}
            onDelete={handleDeleteBook}
            onCoverUpdated={handleCoverUpdated}
          />
        ) : (
          <Alert severity="error">선택한 도서를 찾을 수 없습니다.</Alert>
        );
      case 'form':
        return (
          <BookForm
            bookId={selectedBookId}
            onNavigate={handleNavigation}
            onSaveSuccess={handleSaveSuccess}
          />
        );
      case 'list':
      default:
        return (
          <BookList
            books={books}
            onNavigate={(nextView, id) => handleNavigation(nextView, id)}
            onDelete={handleDeleteBook}
          />
        );
    }
  };

  // [교안 Chapter 3 Unit 3 - JSX 렌더링 및 ThemeProvider 설정]
  // - ThemeProvider를 사용해 하위 컴포넌트들에게 일치된 MUI 디자인 테마를 상속합니다.
  // - 공통 레이아웃 컴포넌트 <Layout> 사이에 컨텐츠를 자식 요소(children)로 넘깁니다.
  return (
    <ThemeProvider theme={theme}>
      <Layout onNavigate={handleNavigation}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
