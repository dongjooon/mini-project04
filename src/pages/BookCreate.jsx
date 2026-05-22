import { useState } from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";

function BookCreate({ onMoveToList }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("도서 등록 UI 확인용입니다. API 연결은 이후 진행합니다.");
    console.log("등록할 도서 정보:", formData);

    onMoveToList();
  };

  return (
    <div>
      <Header />

      <main className="form-page">
        <h2>신규 도서 등록</h2>

        <BookForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={onMoveToList}
          submitText="등록하기"
        />
      </main>
    </div>
  );
}

export default BookCreate;