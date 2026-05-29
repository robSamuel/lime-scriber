import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPatients } from "../api/client.ts";
import { createAudioNote, createTextNote } from "../api/notes.ts";
import type { Patient } from "../types/index.ts";

type InputMode = "TEXT" | "AUDIO";

export default function CreateNote() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("TEXT");
  const [rawInput, setRawInput] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    patientId?: string;
    content?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getPatients();
        if (!cancelled) {
          setPatients(data);
          if (data.length > 0) {
            setPatientId(data[0]?.id ?? "");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load patients",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingPatients(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function validate(): boolean {
    const errors: { patientId?: string; content?: string } = {};
    if (!patientId) {
      errors.patientId = "Select a patient";
    }
    if (inputMode === "TEXT" && !rawInput.trim()) {
      errors.content = "Enter note text";
    }
    if (inputMode === "AUDIO" && !audioFile) {
      errors.content = "Choose an audio file";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const note =
        inputMode === "TEXT"
          ? await createTextNote(patientId, rawInput.trim())
          : await createAudioNote(patientId, audioFile as File);
      navigate(`/notes/${note.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <p className="back-link">
        <Link to="/notes">← Back to notes</Link>
      </p>

      <h1>Create note</h1>

      {loadingPatients && <p>Loading patients…</p>}

      {!loadingPatients && (
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-field">
            <label htmlFor="patientId">Patient</label>
            <select
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={submitting || patients.length === 0}
            >
              {patients.length === 0 && (
                <option value="">No patients available</option>
              )}
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.externalId})
                </option>
              ))}
            </select>
            {fieldErrors.patientId && (
              <span className="field-error">{fieldErrors.patientId}</span>
            )}
          </div>

          <div className="form-field">
            <span className="label">Input type</span>
            <div className="toggle-group">
              <label>
                <input
                  type="radio"
                  name="inputMode"
                  value="TEXT"
                  checked={inputMode === "TEXT"}
                  onChange={() => setInputMode("TEXT")}
                  disabled={submitting}
                />
                Text
              </label>
              <label>
                <input
                  type="radio"
                  name="inputMode"
                  value="AUDIO"
                  checked={inputMode === "AUDIO"}
                  onChange={() => setInputMode("AUDIO")}
                  disabled={submitting}
                />
                Audio
              </label>
            </div>
          </div>

          {inputMode === "TEXT" ? (
            <div className="form-field">
              <label htmlFor="rawInput">Note text</label>
              <textarea
                id="rawInput"
                rows={8}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                disabled={submitting}
                placeholder="Enter clinical note…"
              />
              {fieldErrors.content && (
                <span className="field-error">{fieldErrors.content}</span>
              )}
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="audio">Audio file</label>
              <input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                disabled={submitting}
              />
              {fieldErrors.content && (
                <span className="field-error">{fieldErrors.content}</span>
              )}
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="btn"
            disabled={submitting || patients.length === 0}
          >
            {submitting ? "Saving…" : "Create note"}
          </button>
        </form>
      )}
    </main>
  );
}
