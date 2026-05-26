import { useMemo } from "react";
import Header from "../components/Header";
import BookCard from "../components/BookCard";

const BOOKS_PER_PAGE = 12;

function BookList({
  books,
  search,
  onSearch,
  currentPage,
  onPageChange,
  onMoveToStart,
  onMoveToList,
  onMoveToDetail,
  onMoveToCreate,
}) {
  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedBooks = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * BOOKS_PER_PAGE;

    return books.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [books, safeCurrentPage]);

  const handleSearchChange = (value) => {
    onPageChange(1);
    onSearch(value);
  };

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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="도서를 검색해주세요"
                />
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                  <path d="m21 21-4.35-4.35" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>

              <button
                type="button"
                className="create-button"
                onClick={onMoveToCreate}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <span>새 도서 등록</span>
              </button>
            </div>
          </div>

          {books.length > 0 ? (
            <>
              <div className="book-grid">
                {pagedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => onMoveToDetail(book)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="도서 목록 페이지">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={pageNumber === safeCurrentPage ? "is-active" : ""}
                        onClick={() => onPageChange(pageNumber)}
                        aria-current={pageNumber === safeCurrentPage ? "page" : undefined}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </nav>
              )}
            </>
          ) : (
            <div className="empty-state">검색 결과에 맞는 도서가 없습니다.</div>
          )}
        </section>
      </main>
    </>
  );
}

export default BookList;
