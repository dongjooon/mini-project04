function CoverPreview({ imageUrl, onClick }) {
  return (
    <div
      className="cover-preview"
      onClick={onClick}
      style={{ cursor: imageUrl && onClick ? "pointer" : "default" }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="도서 표지" />
      ) : (
        <p>
          이미지 생성 후
          <br />
          도서 표지가 표시됩니다
        </p>
      )}
    </div>
  );
}

export default CoverPreview;