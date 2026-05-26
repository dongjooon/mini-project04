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
  const [listPage, setListPage] = useState(1);
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
    setListPage(1);
    setMessage("");
    setPage("list");
  };

  const moveBackToList = () => {
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

 const handleGenerateCover = async ({ book, apiKey, model, quality }) => {
  const OPENAI_IMAGE_API_URL =
    "https://api.openai.com/v1/images/generations";

  const prompt = `
    다음 도서에 어울리는 책 표지 이미지를 생성해주세요.

    도서 제목: ${book.title}
    저자: ${book.author}
    출판사: ${book.publisher || ""}
    도서 내용: ${book.content}

    요구사항:
    - 세로형 책 표지 디자인
    - 깔끔하고 전문적인 분위기
    - 도서 내용과 어울리는 이미지 중심 디자인
    - 실제 서점에 있을 법한 표지 느낌
    - 글자는 너무 많이 넣지 않기
`;

  try {
    setMessage("");

    const res = await fetch(OPENAI_IMAGE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: "1024x1536",
        quality: quality,
        output_format: "png",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "OpenAI 요청 실패");
    }

    const b64Json = data.data?.[0]?.b64_json;

    if (!b64Json) {
      throw new Error("이미지 데이터가 응답에 없습니다.");
    }

    const imageSrc = `data:image/png;base64,${b64Json}`;

    const patchRes = await fetch(`${API_URL}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverImageUrl: imageSrc,
        updatedAt: new Date().toISOString().slice(0, 10),
      }),
    });

    if (!patchRes.ok) {
      throw new Error("표지 저장 실패");
    }

    const savedBook = await patchRes.json();

    setBooks((prevBooks) =>
      prevBooks.map((item) => (item.id === savedBook.id ? savedBook : item))
    );

    setSelectedId(savedBook.id);
    setMessage("");
    return savedBook;
  } catch (error) {
    console.error(error);
    setMessage(error.message || "표지 생성 중 오류가 발생했습니다.");
    alert(error.message || "표지 생성 중 오류가 발생했습니다.");
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
          currentPage={listPage}
          onPageChange={setListPage}
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
          onMoveBackToList={moveBackToList}
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
