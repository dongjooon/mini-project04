import Header from "../components/Header";
import BookCard from "../components/BookCard";

function BookList({ books, onMoveToDetail, onMoveToCreate, onMoveToStart }) {
  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
        onMoveToList={onMoveToStart}
      />

      <main className="book-list-page">
        <div className="page-title-row">
          <h2>도서 목록</h2>

          <div className="list-actions">
            <div className="search-box">
              <input type="text" placeholder="제목을 입력해주세요." />
              <button>검색</button>
            </div>
          </div>

          <button className="create-button" onClick={onMoveToCreate}>
            신규 도서 등록
          </button>
        </div>

        <section className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onMoveToDetail(book)}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default BookList;
