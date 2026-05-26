import Header from "../components/Header";
import BookUpdate from "./BookUpdate";

function BookDetail({ book, onMoveToStart, onMoveToList, onMoveToUpdate, onMoveToCoverUpdate, onBookDelete, onBookUpdate }) {

  const handleDelete = (id) => {
    if (!window.confirm(`${book.title}을(를) 정말 삭제하시겠습니까?`)) {
      return;
    }

    onBookDelete(id)          // 삭제 실행
      .then(() => {
        alert('도서가 성공적으로 삭제되었습니다.');
        onMoveToList();            // 목록 페이지로 이동
      })
      .catch((error) => {
        console.error(error);
        alert('삭제에 실패했습니다.');
      });
  };

  if (!book) {
    return (
      <>
        <Header
          onMoveToStart={onMoveToStart}
        />
        <main className="detail-page">
          <p>선택된 도서가 없습니다.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
      />

      <main className="detail-page">
        <section className="detail-container">
          <button
            type="button"
            className="list-return-button detail-return-button"
            onClick={onMoveToList}
            aria-label="도서 목록으로 이동"
          >
            <svg aria-hidden="true" viewBox="0 0 28 24" width="28" height="22">
              <path d="M4 6h20" />
              <path d="M4 12h20" />
              <path d="M4 18h20" />
            </svg>
            <span>목록으로</span>
          </button>

          <div className="detail-cover">
            {book.coverImageUrl ? (
              <img src={book.coverImageUrl} alt={`${book.title} 표지`} />
            ) : (
              <>
                <span>BOOK</span>
                <strong>{book.title}</strong>
                <em>{book.author}</em>
              </>
            )}
          </div>

          <div className="detail-info">
            <span className="tag">상세 조회</span>
            <h2>{book.title}</h2>
            <p>저자: {book.author}</p>
            {book.publisher && <p>출판사: {book.publisher}</p>}

            <div className="content-box">
              <strong>도서 소개</strong>
              <p>{book.content}</p>
            </div>

            <p className="date-text">
              등록일: {book.createdAt} / 수정일: {book.updatedAt}
            </p>

            <div className="detail-buttons">
              <button onClick={() => onMoveToCoverUpdate(book)}>표지 시안 생성</button>
              <button onClick={() => onMoveToUpdate(book)}>수정하기</button>
              <button onClick={() => handleDelete(book.id)}>삭제</button>
              <button onClick={onMoveToList}>목록으로</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default BookDetail;
