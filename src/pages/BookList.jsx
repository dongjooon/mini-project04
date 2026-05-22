import Header from "../components/Header";
import BookCard from "../components/BookCard";
import { mockBooks } from "../data/mockBooks";

function BookList({ books, MoveToDetail, onMoveToCreate }) {
  return (
    <div>
      <Header />

      <main className="book-list-page">
        <div className="page-title-row">
          <h2>도서 목록</h2>

          <div className="list-actions">
            <div className="search-box">
              <input type="text" placeholder="제목을 입력해주세요." />
              <button>검색</button>
            </div>

            <button className="create-button" onClick={onMoveToCreate}>
              신규 도서 등록
            </button>
          </div>
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
    </div>
  );
}

export default BookList;