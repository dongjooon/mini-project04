import { useState } from "react";

function BookForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitText,
  cancelClassName = "",
  onExtractTags,
}) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const handleShowApiKeyInput = () => {
    if (!formData.content?.trim()) {
      alert("도서 소개 내용을 먼저 입력해주세요!");
      return;
    }
    // 내용이 있으면 API 키 입력창을 보여줍니다.
    setShowApiKeyInput(true);
  };

  const handleTagClick = async () => {
    if (!apiKeyInput.trim()) {
      alert("OpenAI API 키를 입력해주세요!");
      return;
    }

    if (!formData.content?.trim()) {
      alert("도서 소개 내용을 먼저 입력해주세요!");
      return;
    }

    try {
      setIsExtracting(true); // 버튼 로딩 중...

      // ⭐️ 핵심: 복잡한 로직은 부모가 하고, 결과만 받아옵니다!
      const extractedTags = await onExtractTags(formData.content, apiKeyInput);

      // 부모의 onChange를 호출해 입력창 상태 업데이트
      onChange({
        target: { name: "tags", value: extractedTags },
      });
      setShowApiKeyInput(false);
      alert("AI 태그가 성공적으로 추출되었습니다!");
    } catch (error) {
      console.error(error);
      alert("AI 태그 추출에 실패했습니다.");
    } finally {
      setIsExtracting(false); // 버튼 로딩 끝
    }
  };

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>도서 제목</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="도서 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>저자</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={onChange}
          placeholder="저자를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>출판사</label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={onChange}
          placeholder="출판사를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>도서 소개</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={onChange}
          placeholder="도서 소개를 입력하세요"
        />

        {showApiKeyInput ? (
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input
              type="password"
              placeholder="OpenAI API 키 (sk-...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{ flex: 1, height: "38px" }}
            />
            <button
              type="button"
              onClick={handleTagClick}
              disabled={isExtracting}
              style={{
                background: "#2f7f6f",
                color: "white",
                border: "none",
                padding: "0 16px",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              {isExtracting ? "분석 중..." : "실행"}
            </button>
            <button
              type="button"
              onClick={() => setShowApiKeyInput(false)}
              disabled={isExtracting}
              style={{
                background: "#d5e0eb",
                color: "#14375c",
                border: "none",
                padding: "0 16px",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleShowApiKeyInput}
            style={{
              marginTop: "8px",
              background: "#2f7f6f",
              color: "white",
              border: "none",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            ✨ AI 태그 자동 추출
          </button>
        )}
      </div>

      <div className="form-group">
        <label>태그</label>
        <input
          type="text"
          name="tags"
          value={formData.tags || ""}
          onChange={onChange}
          placeholder="#태그 #형식으로 #입력 (자동 추출 시 채워집니다)"
        />
      </div>

      <div className="form-buttons">
        <button type="submit">{submitText}</button>
        <button type="button" className={cancelClassName} onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default BookForm;
