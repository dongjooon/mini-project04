import { useState } from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";

function BookUpdate({ book, onMoveToStart, onBookUpdate, onMoveToDetail, onMoveToList }) {

  if (!book) {
    return (
      <>
        <Header
          onMoveToStart={onMoveToStart}
        />

        <main className="form-page">
          <p>수정할 도서 정보가 없습니다.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
      />

      <main className="form-page">
        <section className="section-card form-card">
          <h2>등록된 도서 수정</h2>

          <BookForm
            book={book}
            onSubmit={onBookUpdate}
            onCancel={() => onMoveToDetail(book)}
            submitText="수정하기"
          />
        </section>
      </main>
    </>
  );
}

export default BookUpdate;
