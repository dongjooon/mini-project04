import { useState } from "react";
import StartPage from "./pages/StartPage";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookUpdate from "./pages/BookUpdate";
import CoverUpdate from "./pages/CoverUpdate";

function App() {
  const [page, setPage] = useState("start");
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
        />
      )}

      {page === "create" && <BookCreate onMoveToList={moveToList} />}

      {page === "update" && (
        <BookUpdate
          book={selectedBook}
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