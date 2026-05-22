import { useState } from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";

function BookCreate({ onAddBook, onMoveToList }) {

  return (
    <div>
      <Header />

      <main className="form-page">
        <h2>신규 도서 등록</h2>

        <BookForm
          onAddBook={onAddBook}
          onCancel={onMoveToList}
        />
      </main>
    </div>
  );
}

export default BookCreate;