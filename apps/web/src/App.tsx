import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateNote from "./pages/CreateNote.tsx";
import Home from "./pages/Home.tsx";
import NoteDetail from "./pages/NoteDetail.tsx";
import NoteList from "./pages/NoteList.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NoteList />} />
        <Route path="/notes/new" element={<CreateNote />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
