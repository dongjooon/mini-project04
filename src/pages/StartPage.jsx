import Header from "../components/Header";

function StartPage({ onMoveToList }) {
  return (
    <main className="start-page">
    <Header />
      <h2>걷기 서재에 오신 것을 환영합니다!</h2>
      <p>누구나 자유롭게 책을 등록하고 공유할 수 있는 창작 플랫폼입니다.</p>

      <button onClick={onMoveToList}>도서목록 바로가기</button>
    </main>
  );
}

export default StartPage;