import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";

function NotesStub() {
  return <p>Notes list (coming soon)</p>;
}

function NoteDetailStub() {
  return <p>Note detail (coming soon)</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesStub />} />
        <Route path="/notes/:id" element={<NoteDetailStub />} />
      </Routes>
    </BrowserRouter>
  );
}
