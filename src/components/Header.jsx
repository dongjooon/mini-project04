function Header({ onMoveToStart }) {
  return (
    <header className="header">
      <div className="header-logo">
        <button
          type="button"
          className="home-button"
          onClick={onMoveToStart}
          aria-label="홈으로 이동"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path d="M3 10.8 12 3l9 7.8" />
            <path d="M5.5 9.7V21h13V9.7" />
            <path d="M9.5 21v-6h5v6" />
          </svg>
        </button>
        <button type="button" className="brand-title" onClick={onMoveToStart}>
          걷기가 서재
        </button>
      </div>
    </header>
  );
}

export default Header;
