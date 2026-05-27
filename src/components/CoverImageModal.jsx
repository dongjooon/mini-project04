import { useEffect, useRef, useState } from "react";

function CoverImageModal({ imageUrl, title, onClose }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fileName = `${title || "book-cover"}.png`;

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <div className="cover-modal-backdrop" onClick={onClose}>
      <div
        className="cover-modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="cover-modal-close"
          onClick={onClose}
          aria-label="미리보기 닫기"
        >
          ×
        </button>

        <div className="cover-modal-menu" ref={menuRef}>
          <button
            type="button"
            className="cover-modal-menu-button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="표지 옵션 열기"
            aria-expanded={isMenuOpen}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="cover-modal-menu-panel">
              <a href={imageUrl} download={fileName}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M12 3v11" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                <span>다운로드</span>
              </a>
            </div>
          )}
        </div>

        <img src={imageUrl} alt={`${title || "도서"} 표지 크게 보기`} />
      </div>
    </div>
  );
}

export default CoverImageModal;
