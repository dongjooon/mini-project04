import { useState, useEffect } from "react";
import Header from "../components/Header";
import NewBooksSection from "../components/NewBooksSection";
import PopularBooksSection from "../components/PopularBooksSection";

function StartPage({
  newBooks = [],
  popularBooks = [],
  onMoveToStart,
  onMoveToList,
  onMoveToDetail,
  onMoveToCreate,
  aiRecommendation,
}) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <Header onMoveToStart={onMoveToStart} />

      <main className="book-list-page">
        <section
          className="hero-slider-container"
          style={{ position: "relative", marginBottom: "32px" }}
        >
          {currentBanner === 0 && (
            <div
              className="list-hero fade-in"
              aria-label="AivleBooks 소개"
              style={{
                height: "160px",
                display: "flex",
              }}
            >
              <div>
                <strong>AivleBooks</strong>
                <p>글과 AI 표지 시안을 함께 관리하는 창작 서재</p>
              </div>
            </div>
          )}

          {currentBanner === 1 && (
            <div
              className="list-hero fade-in"
              style={{
                backgroundColor: "#eef2ff",
                color: "violet",
                cursor: "pointer",
                height: "160px",
              }}
              aria-label="이 달의 GPT 추천 도서"
            >
              <div>
                <strong>✨ {currentMonth}월의 AI 추천 도서</strong>
                <p style={{ marginTop: "8px", fontWeight: "bold" }}>
                  [{aiRecommendation.title}] - {aiRecommendation.author}
                </p>
                <p
                  style={{ marginTop: "4px", fontSize: "0.9rem", opacity: 0.8 }}
                >
                  🤖 "{aiRecommendation.reason}"
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              position: "absolute",
              bottom: "16px",
              width: "100%",
            }}
          >
            <button
              onClick={() => setCurrentBanner(0)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "none",
                backgroundColor:
                  currentBanner === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            />
            <button
              onClick={() => setCurrentBanner(1)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "none",
                backgroundColor:
                  currentBanner === 1 ? "#3b82f6" : "rgba(59,130,246,0.3)",
                cursor: "pointer",
              }}
            />
          </div>
        </section>

        <section className="section-card">
          <div
            className="page-title-row"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div className="list-actions">
              <button
                type="button"
                className="create-button"
                onClick={onMoveToList}
              >
                도서 목록
              </button>

              <button
                type="button"
                className="create-button"
                onClick={onMoveToCreate}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <span>새 도서 등록</span>
              </button>
            </div>
          </div>

          <div
            className="main-sections-container"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "48px",
              marginTop: "32px",
            }}
          >
            <PopularBooksSection
              popularBooks={popularBooks}
              onMoveToDetail={onMoveToDetail}
            />

            <hr
              style={{
                border: "0",
                height: "1px",
                backgroundColor: "#eaeaea",
                margin: "0",
              }}
            />

            <NewBooksSection
              newBooks={newBooks}
              onMoveToDetail={onMoveToDetail}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default StartPage;
