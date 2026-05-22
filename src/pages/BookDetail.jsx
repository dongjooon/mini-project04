import Header from "../components/Header";

function BookDetail({ book, onMoveToList, onMoveToUpdate, onMoveToCoverUpdate, onBookDelete }) {

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
      <div>
        <Header />
        <main className="detail-page">
          <p>선택된 도서가 없습니다.</p>
          <button onClick={onMoveToList}>목록으로 돌아가기</button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <main className="detail-page">
        <h2>상세 조회</h2>

        <section className="detail-container">
          <div className="detail-cover">
            {book.coverImageUrl ? (
              <img src={book.coverImageUrl} alt={`${book.title} 표지`} />
            ) : (
              <span>표지 이미지</span>
            )}
          </div>

          <div className="detail-info">
            <h3>{book.title}</h3>
            <p>저자: {book.author}</p>
            <p>출판사: {book.publisher}</p>
            <p className="detail-content">{book.content}</p>

            <div className="detail-buttons">
              <button onClick={() => onMoveToCoverUpdate(book)}>표지 시안 생성</button>
              <button onClick={() => onMoveToUpdate(book)}>수정하기</button>              
              <button onClick={() => handleDelete(book.id)}>삭제</button>
              <button onClick={onMoveToList}>목록으로</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookDetail;