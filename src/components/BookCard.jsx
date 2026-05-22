function BookCard({ book, onClick }) {
  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={`${book.title} 표지`} />
        ) : (
          <span>책 표지</span>
        )}
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>저자: {book.author}</p>
        <p>출판사: {book.publisher}</p>
        <p>{book.content}</p>
      </div>
    </div>
  );
}

export default BookCard;