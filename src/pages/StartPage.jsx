import Header from "../components/Header";

function StartPage({ onMoveToStart, onMoveToList, onMoveToCreate }) {
  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
        onMoveToList={onMoveToList}
        onMoveToCreate={onMoveToCreate}
      />

      <main className="start-page">
        <section className="hero-box">
          <h2>걷기가 서재에 오신 것을 환영합니다!</h2>
          <p>
            누구나 자유롭게 작가가 되어 글을 집필하고, AI를 활용해 도서 표지
            시안을 만들어볼 수 있는 창작 플랫폼입니다.
          </p>

          <div className="button-row">
            <button type="button" className="primary-btn" onClick={onMoveToList}>
              도서 목록 바로가기
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={onMoveToCreate}
            >
              새 도서 등록
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default StartPage;
