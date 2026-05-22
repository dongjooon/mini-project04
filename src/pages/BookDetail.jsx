import Header from "../components/Header";

function BookDetail({ book, onMoveToList, onMoveToUpdate, onMoveToCoverUpdate }) {
  
  const handleDelete = () => {
  const isConfirm = window.confirm("정말 이 도서를 삭제하시겠습니까?");

  if (!isConfirm) return;

  alert("도서 삭제 UI 확인용입니다. API 연결은 이후 진행합니다.");
  console.log("삭제할 도서:", book);

  onMoveToList();
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
              <button onClick={handleDelete}>삭제</button>
              <button onClick={onMoveToList}>목록으로</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookDetail;