function CoverPreview({ imageUrl }) {
  return (
    <div className="cover-preview">
      {imageUrl ? (
        <img src={imageUrl} alt="AI 생성 도서 표지" />
      ) : (
        <div className="cover-placeholder">
          <p>이미지 생성 후</p>
          <p>도서 표지가 표시됩니다</p>
        </div>
      )}
    </div>
  );
}

export default CoverPreview;