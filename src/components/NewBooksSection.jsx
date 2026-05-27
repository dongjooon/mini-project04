import BookCard from "./BookCard";

function NewBooksSection({ newBooks, onMoveToDetail }) {
  return (
    <div className="new-books-section">
      <div className="section-title">
        <h3>신작 도서</h3>
      </div>
      {newBooks.length > 0 ? (
        <div className="book-grid">
          {newBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onMoveToDetail(book)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">신작 도서가 없습니다.</div>
      )}
    </div>
  );
}

export default NewBooksSection;
