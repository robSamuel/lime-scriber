export type Patient = {
  id: string;
  externalId: string;
  fullName: string;
  dateOfBirth: string;
  createdAt: string;
};

export type NoteListItem = {
  id: string;
  preview: string;
  createdAt: string;
  inputType: "TEXT" | "AUDIO";
  patient: { id: string; fullName: string };
};

export type NoteDetail = {
  id: string;
  transcription: string;
  processedContent: string | null;
  inputType: "TEXT" | "AUDIO";
  rawInput: string;
  createdAt: string;
  patient: Pick<Patient, "id" | "externalId" | "fullName" | "dateOfBirth">;
};

export type NoteCreated = {
  id: string;
  inputType: "TEXT" | "AUDIO";
  rawInput: string;
  transcription: string;
  processedContent: string | null;
  preview: string;
  createdAt: string;
  patient: { id: string; fullName: string };
};
