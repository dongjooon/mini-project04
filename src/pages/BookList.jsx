import Header from "../components/Header";
import BookCard from "../components/BookCard";

function BookList({
  books,
  search,
  onSearch,
  onMoveToStart,
  onMoveToList,
  onMoveToDetail,
  onMoveToCreate,
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
            <h2>도서 목록</h2>

            <div className="list-actions">
              <div className="search-box">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="도서명, 저자, 내용 검색"
                />
              </div>

              <button
                type="button"
                className="create-button"
                onClick={onMoveToCreate}
              >
                새 도서 등록
              </button>
            </div>
          </div>

          {books.length > 0 ? (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onMoveToDetail(book)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">검색 결과에 맞는 도서가 없습니다.</div>
          )}
        </section>
      </main>
    </>
  );
}

export default BookList;
