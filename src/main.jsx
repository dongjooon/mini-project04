/**
 * [교안 Chapter 3. React 입문 & 미션 2. 환경설정]
 * - Vite를 이용해 생성된 React 프로젝트의 메인 진입점(Entry Point)입니다.
 * - index.html의 div#root 요소를 찾아 React DOM Root를 생성하고 App 컴포넌트를 마운트합니다.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // 전역 CSS 리셋 및 공통 애니메이션 스타일 로드
import App from './App'

/**
 * [React 핵심 개념: 가상 DOM 마운트 및 렌더링]
 * - document.getElementById('root'): public/index.html 파일에 생성되어 있는 빈 div#root 엘리먼트를 가져옵니다.
 * - createRoot(...).render(...): React 18 버전부터 지원하는 가상 DOM 렌더러 생성 API입니다.
 *   실제 DOM을 React 가상 DOM의 루트 노드로 지정하여 React 컴포넌트 트리(<App />)를 렌더링해 줍니다.
 * - <StrictMode>: React 개발용 디버깅 도구입니다. 컴포넌트 생명주기가 올바르게 작동하는지, 
 *   부적절한 부작용(Side Effect)이 존재하지 않는지 개발 모드에서 렌더링을 두 번 시도하여 진단합니다.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

