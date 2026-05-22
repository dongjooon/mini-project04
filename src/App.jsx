import { useCallback, useEffect, useMemo, useState } from "react";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookUpdate from "./pages/BookUpdate";
import CoverUpdate from "./pages/CoverUpdate";

const API_URL = "http://localhost:3000/books";

function App() {
  const [page, setPage] = useState("list");
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedId) || null,
    [books, selectedId]
  );

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.publisher.toLowerCase().includes(keyword) ||
        book.content.toLowerCase().includes(keyword)
      );
    });
  }, [books, search]);

  const loadBooks = useCallback(async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("도서 목록을 불러오지 못했습니다.");
      }

      const data = await res.json();

      setBooks(data);
      setSelectedId((prevId) => prevId ?? data[0]?.id ?? null);
    } catch (error) {
      console.error(error);
      setMessage("json-server 실행 여부를 확인해주세요.");
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadBooks();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadBooks]);

  const moveToList = () => {
    setMessage("");
    setPage("list");
  };

  const moveToCreate = () => {
    setMessage("");
    setPage("create");
  };

  const moveToDetail = (book) => {
    setSelectedId(book.id);
    setMessage("");
    setPage("detail");
  };

  const moveToUpdate = (book) => {
    setSelectedId(book.id);
    setMessage("");
    setPage("update");
  };

  const moveToCoverUpdate = (book) => {
    setSelectedId(book.id);
    setMessage("");
    setPage("coverUpdate");
  };

  const handleCreateBook = async (formData) => {
    const today = new Date().toISOString().slice(0, 10);
    const newBook = {
      ...formData,
      coverImageUrl: "",
      createdAt: today,
      updatedAt: today,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (!res.ok) {
        throw new Error("도서 등록 실패");
      }

      const savedBook = await res.json();

      setBooks((prevBooks) => [savedBook, ...prevBooks]);
      setSelectedId(savedBook.id);
      setMessage("새 도서를 등록했습니다.");
      setPage("detail");
    } catch (error) {
      console.error(error);
      setMessage("도서 등록 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateBook = async (book, formData) => {
    const updatedBook = {
      ...formData,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(`${API_URL}/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (!res.ok) {
        throw new Error("도서 수정 실패");
      }

      const savedBook = await res.json();

      setBooks((prevBooks) =>
        prevBooks.map((item) => (item.id === savedBook.id ? savedBook : item))
      );
      setSelectedId(savedBook.id);
      setMessage("도서 정보를 수정했습니다.");
      setPage("detail");
    } catch (error) {
      console.error(error);
      setMessage("도서 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteBook = async (book) => {
    const isConfirm = window.confirm("선택한 도서를 삭제할까요?");

    if (!isConfirm) return;

    try {
      const res = await fetch(`${API_URL}/${book.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("도서 삭제 실패");
      }

      const nextBooks = books.filter((item) => item.id !== book.id);

      setBooks(nextBooks);
      setSelectedId(nextBooks[0]?.id ?? null);
      setMessage("도서를 삭제했습니다.");
      setPage("list");
    } catch (error) {
      console.error(error);
      setMessage("도서 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleGenerateCover = async (book) => {
    const colorList = ["#2f7f6f", "#b8455f", "#1f4c73", "#7b5ea7", "#d08a3c"];
    const randomColor = colorList[Math.floor(Math.random() * colorList.length)];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="560">
        <rect width="400" height="560" fill="${randomColor}" />
        <text x="40" y="90" fill="white" font-size="24" font-family="Arial">AI BOOK COVER</text>
        <text x="40" y="270" fill="white" font-size="38" font-weight="700" font-family="Arial">${book.title}</text>
        <text x="40" y="500" fill="white" font-size="24" font-family="Arial">${book.author}</text>
      </svg>
    `;

    const imageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    try {
      const res = await fetch(`${API_URL}/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverImageUrl: imageSrc,
          updatedAt: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!res.ok) {
        throw new Error("표지 저장 실패");
      }

      const savedBook = await res.json();

      setBooks((prevBooks) =>
        prevBooks.map((item) => (item.id === savedBook.id ? savedBook : item))
      );
      setSelectedId(savedBook.id);
      setMessage("표지 시안을 생성했습니다.");
      setPage("detail");
    } catch (error) {
      console.error(error);
      setMessage("표지 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="app">
      {message && <div className="message">{message}</div>}

      {page === "list" && (
        <BookList
          books={filteredBooks}
          search={search}
          onSearch={setSearch}
          onMoveToStart={moveToList}
          onMoveToList={moveToList}
          onMoveToDetail={moveToDetail}
          onMoveToCreate={moveToCreate}
        />
      )}

      {page === "detail" && (
        <BookDetail
          book={selectedBook}
          onMoveToStart={moveToList}
          onMoveToList={moveToList}
          onMoveToUpdate={moveToUpdate}
          onMoveToCoverUpdate={moveToCoverUpdate}
          onDelete={handleDeleteBook}
        />
      )}

      {page === "create" && (
        <BookCreate
          onMoveToStart={moveToList}
          onMoveToList={moveToList}
          onCreate={handleCreateBook}
        />
      )}

      {page === "update" && (
        <BookUpdate
          book={selectedBook}
          onMoveToStart={moveToList}
          onMoveToDetail={moveToDetail}
          onUpdate={handleUpdateBook}
        />
      )}

      {page === "coverUpdate" && (
        <CoverUpdate
          book={selectedBook}
          onMoveToStart={moveToList}
          onMoveToDetail={moveToDetail}
          onGenerateCover={handleGenerateCover}
        />
      )}
    </div>
  );
}

export default App;
