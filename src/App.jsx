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

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await fetch("http://localhost:3000/books");
        const data = await response.json();
        setBooks(data);
        console.log("책 데이터: ", data);
      } catch (error) {
        console.error("에러: ", error);
      }
    };
    loadBooks();
  }, []);

  const handleAddBook = async (newBook) => {
    try {
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      const createdBook = await response.json();
      setBooks([...books, createdBook]);
    } catch (error) {
      console.error("에러: ", error);
    }
  };


  const handleBookDelete = async (id) => {
    try {
      await fetch('http://localhost:3000/books/' + id, {
        method: 'DELETE',
      });
      setBooks(books.filter(b => b.id !== id));

    } catch (eff) {
      console.error(err);
    }
  };

  const handleBookUpdate = async (updatedBook) => {
    try {
      const book = books.find(b => b.id === updatedBook.id);
      const res = await fetch('http://localhost:3000/books/' + updatedBook.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook)
      });
      const updated = await res.json();
      setBooks(books.map(b => b.id === updatedBook.id ? updated : b));
      moveToDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      {message && <div className="message">{message}</div>}

      {page === "list" && (
        <BookList
          books={books}
          onMoveToStart={moveToList}
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
          onBookDelete={handleBookDelete}
          onBookUpdate={handleBookUpdate}
        />
      )}

      {page === "create" && <BookCreate onMoveToStart={moveToList} onAddBook={handleAddBook} onMoveToList={moveToList} />}

      {page === "update" && (
        <BookUpdate
          book={selectedBook}
          onMoveToStart={moveToList}
          onBookUpdate={handleBookUpdate}
          onMoveToDetail={moveToDetail}
          onUpdate={handleBookUpdate}
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
