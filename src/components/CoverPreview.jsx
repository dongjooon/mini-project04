import { useState } from "react";

function CoverPreview({
  imageUrl,
  onClick,
  onDelete,
  onUploadImage,
  isUploadDisabled = false,
  isLoading = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasImage = Boolean(imageUrl);

  const renderUploadButton = () => (
    <label
      className="cover-preview-upload-button"
      onClick={(e) => e.stopPropagation()}
      aria-label="이미지 업로드"
    >
      <input
        type="file"
        accept="image/*"
        onChange={onUploadImage}
        disabled={isUploadDisabled}
      />
      <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30">
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M4 15v4h16v-4" />
      </svg>
    </label>
  );

  return (
    <div
      className={`cover-preview${isLoading ? " is-loading" : ""}${hasImage ? " has-image" : ""}`}
      onClick={isLoading ? undefined : onClick}
      style={{
        cursor: hasImage && onClick && !isLoading ? "pointer" : "default",
      }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="cover-generating-state">
          <span className="cover-spinner" aria-hidden="true" />
          <strong>표지 시안이 생성중입니다</strong>
          <p>이미지를 만드는 동안 잠시만 기다려주세요.</p>
        </div>
      ) : hasImage ? (
        <>
          <img
            className="cover-blur-bg"
            src={imageUrl}
            alt=""
            aria-hidden="true"
          />
          <img className="cover-main-image" src={imageUrl} alt="도서 표지" />

          {onDelete && (
            <div
              className="cover-preview-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="cover-preview-menu-button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="표지 이미지 메뉴"
                aria-expanded={isMenuOpen}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="cover-preview-menu-panel">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        onUploadImage && renderUploadButton()
      )}
    </div>
  );
}

export default CoverPreview;
