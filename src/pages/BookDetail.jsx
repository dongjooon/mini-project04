import { useState } from "react";
import Header from "../components/Header";
import CoverImageModal from "../components/CoverImageModal";

function BookDetail({
  book,
  onMoveToStart,
  onMoveToList,
  onMoveBackToList,
  onMoveToUpdate,
  onMoveToCoverUpdate,
  onDelete,
}) {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const hasCoverImage = Boolean(book?.coverImageUrl);

  if (!book) {
    return (
      <>
        <Header onMoveToStart={onMoveToStart} />
        <main className="detail-page">
          <p>선택된 도서가 없습니다.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header onMoveToStart={onMoveToStart} />

      <main className="detail-page">
        <section className="detail-container">
          <div className="detail-nav-buttons">
            <button
              type="button"
              className="icon-return-button"
              onClick={onMoveBackToList}
              aria-label="이전 목록 페이지로 돌아가기"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              className="list-return-button"
              onClick={onMoveToList}
              aria-label="도서 목록 첫 페이지로 이동"
            >
              <svg aria-hidden="true" viewBox="0 0 28 24" width="28" height="22">
                <path d="M4 6h20" />
                <path d="M4 12h20" />
                <path d="M4 18h20" />
              </svg>
              <span>목록으로</span>
            </button>
          </div>

          <div
            className={`detail-cover ${hasCoverImage ? "has-image" : ""}`}
            onClick={() => {
              if (hasCoverImage) {
                setIsCoverOpen(true);
              }
            }}
            style={{ cursor: hasCoverImage ? "pointer" : "default" }}
          >
            {hasCoverImage ? (
              <>
                <img
                  className="cover-blur-bg"
                  src={book.coverImageUrl}
                  alt=""
                  aria-hidden="true"
                />
                <img
                  className="cover-main-image"
                  src={book.coverImageUrl}
                  alt={`${book.title} 표지`}
                />
              </>
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
              <button type="button" onClick={() => onMoveToCoverUpdate(book)}>
                표지 시안 생성
              </button>
              <button type="button" onClick={() => onMoveToUpdate(book)}>
                수정하기
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => onDelete(book)}
              >
                삭제
              </button>
            </div>
          </div>
        </section>

        {isCoverOpen && book.coverImageUrl && (
          <CoverImageModal
            imageUrl={book.coverImageUrl}
            title={book.title}
            onClose={() => setIsCoverOpen(false)}
          />
        )}
      </main>
    </>
  );
}

export default BookDetail;
