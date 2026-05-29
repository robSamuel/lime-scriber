import type { NoteCreated, NoteDetail, NoteListItem } from "../types/index.ts";

const baseUrl = import.meta.env.VITE_API_URL;

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) {
      return body.error;
    }
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed: ${res.status}`;
}

export async function getNotes(): Promise<NoteListItem[]> {
  const res = await fetch(`${baseUrl}/notes`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<NoteListItem[]>;
}

export async function getNote(id: string): Promise<NoteDetail> {
  const res = await fetch(`${baseUrl}/notes/${id}`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<NoteDetail>;
}

export async function createTextNote(
  patientId: string,
  rawInput: string,
): Promise<NoteCreated> {
  const res = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patientId, inputType: "TEXT", rawInput }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<NoteCreated>;
}

export async function createAudioNote(
  patientId: string,
  file: File,
): Promise<NoteCreated> {
  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("inputType", "AUDIO");
  formData.append("audio", file);

  const res = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<NoteCreated>;
}
