import { useState } from "react";
import Header from "../components/Header";
import CoverPreview from "../components/CoverPreview";

function CoverUpdate({
  book,
  onMoveToStart,
  onMoveToDetail,
  onGenerateCover,
}) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-image-2");
  const [quality, setQuality] = useState("medium");
  const previewImage = book?.coverImageUrl || "";

  if (!book) {
    return (
      <>
        <Header
          onMoveToStart={onMoveToStart}
        />

        <main className="cover-page">
          <p>표지를 생성할 도서 정보가 없습니다.</p>
        </main>
      </>
    );
  }

  const handleGenerateCover = () => {
    if (!apiKey.trim()) {
      alert("API Key를 입력해주세요.");
      return;
    }

    console.log("표지 생성 요청 정보:", {
      bookId: book.id,
      apiKeyLength: apiKey.length,
      model,
      quality,
    });

    onGenerateCover(book);
  };

  return (
    <>
      <Header
        onMoveToStart={onMoveToStart}
      />

      <main className="cover-page">
        <section className="cover-layout">
          <div className="section-card cover-form-area">
            <h2>도서 표지 생성</h2>

            <div className="form-group">
              <label>API Key *</label>
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

          <div className="section-card cover-result-area">
            <CoverPreview imageUrl={previewImage} />

            <div className="cover-book-info">
              <h3>{book.title}</h3>
              <p>저자: {book.author}</p>
              {book.publisher && <p>출판사: {book.publisher}</p>}
              <p>{book.content}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CoverUpdate;
