import { useState } from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";

function BookUpdate({ book, onMoveToDetail, onMoveToList }) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    publisher: book?.publisher || "",
    content: book?.content || "",
  });

  if (!book) {
    return (
      <div>
        <Header />

        <main className="form-page">
          <p>수정할 도서 정보가 없습니다.</p>
          <button onClick={onMoveToList}>목록으로 돌아가기</button>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBook = {
      ...book,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    alert("도서 수정 UI 확인용입니다. API 연결은 이후 진행합니다.");
    console.log("수정된 도서 정보:", updatedBook);

    onMoveToDetail(updatedBook);
  };

  return (
    <div>
      <Header />

      <main className="form-page">
        <h2>등록된 도서 수정</h2>

        <BookForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => onMoveToDetail(book)}
          submitText="수정하기"
        />
      </main>
    </div>
  );
}

export default BookUpdate;