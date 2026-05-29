import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNote } from "../api/notes.ts";
import type { NoteDetail as NoteDetailType } from "../types/index.ts";
import { formatDate, formatDateTime } from "../utils/format.ts";

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Note id is missing");
      setLoading(false);
      return;
    }

    const noteId = id;
    let cancelled = false;

    async function load() {
      try {
        const data = await getNote(noteId);
        if (!cancelled) {
          setNote(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load note");
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
  }, [id]);

  return (
    <main className="detail-page">
      <p className="back-link">
        <Link to="/notes">← Back to notes</Link>
      </p>

      {loading && <p>Loading note…</p>}
      {error && <p className="error">{error}</p>}

      {note && (
        <>
          <header className="page-header">
            <h1>Note detail</h1>
            <span className={`badge badge-${note.inputType.toLowerCase()}`}>
              {note.inputType}
            </span>
          </header>

          <div className="detail-layout">
            <div className="detail-main">
              <section>
                <h2>Transcription</h2>
                <p className="content-block">{note.transcription}</p>
              </section>

              {note.processedContent && (
                <section>
                  <h2>SOAP summary</h2>
                  <pre className="soap-block">{note.processedContent}</pre>
                </section>
              )}
            </div>

            <aside className="detail-sidebar">
              <h2>Patient</h2>
              <dl>
                <dt>Name</dt>
                <dd>{note.patient.fullName}</dd>
                <dt>ID</dt>
                <dd>{note.patient.externalId}</dd>
                <dt>Date of birth</dt>
                <dd>{formatDate(note.patient.dateOfBirth)}</dd>
                <dt>Note created</dt>
                <dd>{formatDateTime(note.createdAt)}</dd>
              </dl>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
