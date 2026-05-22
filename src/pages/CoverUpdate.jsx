import { useState } from "react";
import Header from "../components/Header";
import CoverPreview from "../components/CoverPreview";

function CoverUpdate({ book, onMoveToDetail, onMoveToList }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-image-2");
  const [quality, setQuality] = useState("medium");
  const [previewImage, setPreviewImage] = useState(book?.coverImageUrl || "");

  if (!book) {
    return (
      <div>
        <Header />

        <main className="cover-page">
          <p>표지를 생성할 도서 정보가 없습니다.</p>
          <button onClick={onMoveToList}>목록으로 돌아가기</button>
        </main>
      </div>
    );
  }

  const handleGenerateCover = () => {
    if (!apiKey.trim()) {
      alert("API Key를 입력해주세요.");
      return;
    }

    alert("AI 표지 생성 UI 확인용입니다. 실제 OpenAI 연동은 이후 진행합니다.");

    const updatedBook = {
      ...book,
      coverImageUrl: previewImage,
    };

    console.log("표지 생성 요청 정보:", {
      book,
      apiKey,
      model,
      quality,
    });

    onMoveToDetail(updatedBook);
  };

  return (
    <div>
      <Header />

      <main className="cover-page">
        <h2>AI 표지 생성</h2>

        <section className="cover-layout">
          <div className="cover-form-area">
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-xxxxxxxxxxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>모델</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="cover-buttons">
              <button
                type="button"
                disabled={!apiKey.trim()}
                onClick={handleGenerateCover}
              >
                AI 표지 생성
              </button>

              <button type="button" onClick={() => onMoveToDetail(book)}>
                취소
              </button>
            </div>
          </div>

          <div className="cover-result-area">
            <CoverPreview imageUrl={previewImage} />

            <div className="cover-book-info">
              <h3>{book.title}</h3>
              <p>저자: {book.author}</p>
              <p>출판사: {book.publisher}</p>
              <p>{book.content}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CoverUpdate;