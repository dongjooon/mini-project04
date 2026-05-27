import BookCard from "./BookCard";

function PopularBooksSection({ popularBooks, onMoveToDetail }) {
  return (
    <div className="popular-books-section">
      <div className="section-title">
        <h3>인기 도서</h3>
      </div>
      {popularBooks.length > 0 ? (
        <div className="book-grid">
          {popularBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onMoveToDetail(book)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">인기 도서가 없습니다.</div>
      )}
    </div>
  );
}

export default PopularBooksSection;
