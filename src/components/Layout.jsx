/**
 * [교안 미션 2. 환경설정 - 공통 레이아웃 설계]
 * - Material UI (MUI)를 활용하여 상단 헤더(AppBar), 네비게이션, 그리고 푸터를 포함한 공통 레이아웃을 구성했습니다.
 * - Flexbox 레이아웃 모델을 사용해 화면 하단에 푸터가 고정되도록 디자인했습니다 (flexDirection: 'column', minHeight: '100vh').
 */
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddIcon from '@mui/icons-material/Add';

/**
 * [React 핵심 개념: Layout 컴포넌트와 children prop]
 * - children은 React가 제공하는 특별한 prop으로, 이 컴포넌트의 여는 태그와 닫는 태그 사이에 위치한 
 *   하위 자식 엘리먼트들이 통째로 주입되는 슬롯(slot) 역할을 합니다.
 * - 이를 통해 모든 페이지에서 헤더와 푸터 같은 공통 UI를 재사용할 수 있습니다.
 */
export const Layout = ({ children, onNavigate }) => {
  return (
    /**
     * [CSS Layout 패턴: Sticky Footer (하단 고정 푸터)]
     * - display: 'flex', flexDirection: 'column'을 활용해 컴포넌트들을 세로 방향으로 정렬합니다.
     * - minHeight: '100vh'로 전체 뷰포트 높이만큼의 최소 영역을 확보하고,
     *   메인 콘텐츠 영역(Container)에 `flexGrow: 1`을 부여하여 콘텐츠가 부족하더라도 
     *   남은 공간을 모두 차지해 푸터(mt: 'auto')가 항상 화면 최하단에 위치하도록 제어합니다.
     */
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f7f9fc' }}>
      
      {/* 상단 네비게이션 헤더 바 (sticky로 스크롤 시 상단 고정) */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // 그라데이션 스타일링
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            
            {/* 로고 & 타이틀 영역 */}
            <Box 
              onClick={() => onNavigate('list', null)} // 클릭 시 도서 목록 첫 화면으로 리다이렉트
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' } // 마우스 호버 시 미세하게 커지는 줌 이펙트
              }}
            >
              <AutoStoriesIcon sx={{ mr: 1.5, fontSize: '2rem', color: '#ffc107' }} />
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '.05rem',
                  color: '#fff',
                  fontFamily: '"Outfit", "Inter", sans-serif'
                }}
              >
                작가의 산책
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  ml: 1.5, 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  px: 1, 
                  py: 0.25, 
                  borderRadius: 1,
                  color: '#e0e0e0',
                  fontWeight: 600
                }}
              >
                AI 도서관리
              </Typography>
            </Box>

            {/* 신규 도서 등록 작성페이지로 이동하는 우측 버튼 */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => onNavigate('form', null)} // 클릭 시 BookForm 호출 (등록 모드)
              sx={{
                bgcolor: '#ffc107',
                color: '#1e3c72',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(255, 193, 7, 0.3)',
                '&:hover': {
                  bgcolor: '#ffb300',
                  boxShadow: '0 6px 15px rgba(255, 193, 7, 0.4)',
                },
                borderRadius: '8px',
                textTransform: 'none',
                px: 2.5
              }}
            >
              새 도서 등록
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 메인 콘텐츠 출력 영역 (children이 주입되어 화면에 렌더링됨) */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Container>

      {/* 공통 푸터(Footer) 영역 */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', // Flexbox 내부에서 수직 방향 정렬 시 아래 끝에 위치하게 함
          backgroundColor: '#1e2d4a',
          color: '#8fa0bc',
          borderTop: '1px solid #2d3f61'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
            {'© '}
            {new Date().getFullYear()} 작가의 산책 - AI 트랙 미니프로젝트 4차. All Rights Reserved.
          </Typography>
          <Typography variant="caption" align="center" display="block" sx={{ mt: 0.5, color: '#687b99' }}>
            Powered by React, Material UI, and OpenAI DALL-E
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

