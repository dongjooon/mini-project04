import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BookList } from './components/BookList';
import { BookDetail } from './components/BookDetail';
import { BookForm } from './components/BookForm';
import { Box, CircularProgress, Typography, Alert, ThemeProvider, createTheme } from '@mui/material';

// Premium typography and palette theme configuration
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
  const [view, setView] = useState('list');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all books from mock local json-server
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/books');
      if (!response.ok) {
        throw new Error('데이터베이스 서버로부터 도서 정보를 불러오지 못했습니다. json-server가 켜져 있는지 확인해주세요.');
      }
      const data = await response.json();
      // Sort books by created date descending so new books show up first
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBooks(sorted);
    } catch (err) {
      console.error(err);
      setError(err.message || '데이터 연동 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleNavigation = (nextView, id = null) => {
    setView(nextView);
    setSelectedBookId(id);
    if (nextView === 'list') {
      fetchBooks(); // Refresh book list on returning to list view
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/bookDelete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('서버에서 도서를 삭제하는 데 실패했습니다.');
      }
      // Update local state instantly
      setBooks(prev => prev.filter(b => b.id !== id));
      // If we are deleting from detail view, go back to list
      if (view === 'detail' && selectedBookId === id) {
        setView('list');
        setSelectedBookId(null);
      }
    } catch (err) {
      alert(err.message || '도서 삭제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSaveSuccess = (savedBook) => {
    // If it was an edit, update in place; if new, add it
    setBooks(prev => {
      const exists = prev.some(b => b.id === savedBook.id);
      if (exists) {
        return prev.map(b => b.id === savedBook.id ? savedBook : b);
      } else {
        return [savedBook, ...prev];
      }
    });
    // Redirect to detail page of the saved book
    setView('detail');
    setSelectedBookId(savedBook.id);
  };

  const handleCoverUpdated = (bookId, newCoverUrl) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, coverImageUrl: newCoverUrl } : b));
  };

  const getSelectedBook = () => {
    return books.find(b => b.id === selectedBookId) || null;
  };

  const renderContent = () => {
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

  return (
    <ThemeProvider theme={theme}>
      <Layout onNavigate={handleNavigation}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
