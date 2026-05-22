import { useState } from "react";

function BookForm({ onAddBook, onCancel }) {

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


  const handleAddBook = () => {
    if (!formData.title.trim()) {
      alert("도서 제목을 입력해주세요.");
      return;
    }

    console.log("안녕");
    console.log("title: ", formData.title);
    const newBook = {
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      content: formData.content,
      imageUrl: "",
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString()
    };

    onAddBook(newBook);
    setFormData({
      title: "",
      author: "",
      publisher: "",
      content: "",
    });
  }

  return (
    <form className="book-form" onSubmit={handleAddBook}>
      <div className="form-group">
        <label>도서 제목</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="도서 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>저자</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="저자를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>출판사</label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          placeholder="출판사를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>도서 소개</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="도서 소개를 입력하세요"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" onClick={() => {
          handleAddBook;
          alert("등록 되었습니다.");
          onCancel;
        }}>등록하기</button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default BookForm;