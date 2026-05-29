import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "../api/notes.ts";
import type { NoteListItem } from "../types/index.ts";
import { formatDateTime } from "../utils/format.ts";

export default function NoteList() {
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getNotes();
        if (!cancelled) {
          setNotes(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load notes");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <header className="page-header">
        <h1>Notes</h1>
        <Link to="/notes/new" className="btn">
          Create note
        </Link>
      </header>

      {loading && <p>Loading notes…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p>No notes yet. <Link to="/notes/new">Create the first note</Link>.</p>
      )}

      {!loading && !error && notes.length > 0 && (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`} className="note-card">
                <div className="note-card-header">
                  <strong>{note.patient.fullName}</strong>
                  <span className={`badge badge-${note.inputType.toLowerCase()}`}>
                    {note.inputType}
                  </span>
                </div>
                <p className="note-meta">{formatDateTime(note.createdAt)}</p>
                <p className="note-preview">{note.preview}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="back-link">
        <Link to="/">Home</Link>
      </p>
    </main>
  );
}
