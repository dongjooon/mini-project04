import { useState } from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";

function BookCreate({ onAddBook, onMoveToStart, onMoveToList }) {

  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
      />

      <main className="form-page">
        <section className="section-card form-card">
          <h2>새 도서 등록</h2>

          <BookForm
            onSubmit={onAddBook}
            onCancel={onMoveToList}
            submitText="수정하기"
          />
        </section>
      </main>
    </>
  );
}

export default BookCreate;
