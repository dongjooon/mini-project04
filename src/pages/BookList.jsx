import Header from "../components/Header";
import NewBooksSection from "../components/NewBooksSection";
import PopularBooksSection from "../components/PopularBooksSection";

function BookList({
  books = [],
  newBooks = [],
  popularBooks = [],
  search,
  onSearch,
  onMoveToStart,
  onMoveToList,
  onMoveToDetail,
  onMoveToCreate,
  onMoveToAllBooks,
}) {

  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
        onMoveToList={onMoveToList}
      />

      <main className="book-list-page">
        <section className="list-hero" aria-label="걷기가 서재 소개">
          <div>
            <strong>걷기가 서재</strong>
            <p>글과 AI 표지 시안을 함께 관리하는 창작 서재</p>
          </div>
        </section>

        <section className="section-card">
          <div className="page-title-row">
            <h2>메인 화면</h2>

            <div className="list-actions">
              {/* 검색창 대신 도서 목록 버튼 추가 (검색 코드는 보존하고 UI만 교체) */}
              <button
                type="button"
                className="all-books-button"
                onClick={onMoveToAllBooks}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  backgroundColor: "#111",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "background-color 0.2s"
                }}
              >
                도서 목록
              </button>

              <button
                type="button"
                className="create-button"
                onClick={onMoveToCreate}
              >
                새 도서 등록
              </button>
            </div>
          </div>

          {/* 메인 화면에 인기 도서 3개와 신작 도서 3개를 동시에 노출 */}
          <div className="main-sections-container" style={{ display: "flex", flexDirection: "column", gap: "48px", marginTop: "32px" }}>
            <PopularBooksSection
              popularBooks={popularBooks}
              onMoveToDetail={onMoveToDetail}
            />

            <hr style={{ border: "0", height: "1px", backgroundColor: "#eaeaea", margin: "0" }} />

            <NewBooksSection
              newBooks={newBooks}
              onMoveToDetail={onMoveToDetail}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default BookList;
