import { useState } from "react";
import { useEffect } from "react";
import StartPage from "./pages/StartPage";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookUpdate from "./pages/BookUpdate";
import CoverUpdate from "./pages/CoverUpdate";
import './App.css'

function App() {
  const [page, setPage] = useState("start");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const moveToList = () => {
    setPage("list");
  };

  const moveToCreate = () => {
    setPage("create");
  };

  const moveToDetail = (book) => {
    setSelectedBook(book);
    setPage("detail");
  };

  const moveToUpdate = (book) => {
    setSelectedBook(book);
    setPage("update");
  };

  const moveToCoverUpdate = (book) => {
    setSelectedBook(book);
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
      
    } catch(eff) {
      console.error(err);
    }
  };

  const handleBookUpdate = async (updatedBook) => {
    try {
      const book = books.find(b => b.id === updatedBook.id);
      const res = await fetch('http://localhost:3000/books/' + updatedBook.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ content: updatedBook.content/* 필요시 update할 컬럼을 더 작성 */})
      });
      const updated = await res.json();
      setBooks(books.map(b => b.id === updatedBook.id ? updated : b))
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {page === "start" && (
        <StartPage
          onMoveToList={moveToList}
          onMoveToCreate={moveToCreate}
        />
      )}

      {page === "list" && (
        <BookList
          books={books}
          onMoveToDetail={moveToDetail}
          onMoveToCreate={moveToCreate}
        />
      )}

      {page === "detail" && (
        <BookDetail
          book={selectedBook}
          onMoveToList={moveToList}
          onMoveToUpdate={moveToUpdate}
          onMoveToCoverUpdate={moveToCoverUpdate}
          onBookDelete={handleBookDelete}
        />
      )}

      {page === "create" && <BookCreate onAddBook={handleAddBook} onMoveToList={moveToList} />}

      {page === "update" && (
        <BookUpdate
          selectedBook={selectedBook}
          onMoveToDetail={moveToDetail}
          onMoveToList={moveToList}
        />
      )}

      {page === "coverUpdate" && (
        <CoverUpdate
          book={selectedBook}
          onMoveToDetail={moveToDetail}
          onMoveToList={moveToList}
        />
      )}
    </>
  );
}

export default App;