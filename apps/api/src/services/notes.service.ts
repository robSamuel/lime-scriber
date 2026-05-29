import path from "node:path";
import { InputType } from "@prisma/client";
import { prisma } from "../db.js";
import { HttpError } from "../errors/http-error.js";
import type {
  CreateAudioNoteInput,
  CreateTextNoteInput,
} from "../schemas/note.schema.js";
import { transcribeAudio } from "./ai.service.js";

const PREVIEW_MAX_LENGTH = 120;

const noteSelect = {
  id: true,
  inputType: true,
  rawInput: true,
  transcription: true,
  processedContent: true,
  preview: true,
  createdAt: true,
  patient: {
    select: {
      id: true,
      fullName: true,
    },
  },
} as const;

function buildPreview(text: string): string {
  if (text.length <= PREVIEW_MAX_LENGTH) {
    return text;
  }
  return `${text.slice(0, PREVIEW_MAX_LENGTH)}...`;
}

async function assertPatientExists(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true },
  });

  if (!patient) {
    throw new HttpError(404, "Patient not found");
  }
}

export async function createTextNote(data: CreateTextNoteInput) {
  await assertPatientExists(data.patientId);

  const preview = buildPreview(data.rawInput);

  return prisma.note.create({
    data: {
      patientId: data.patientId,
      inputType: InputType.TEXT,
      rawInput: data.rawInput,
      transcription: data.rawInput,
      processedContent: null,
      preview,
    },
    select: noteSelect,
  });
}

export async function createAudioNote(
  data: CreateAudioNoteInput,
  filePath: string,
) {
  await assertPatientExists(data.patientId);

  const transcription = await transcribeAudio(filePath);
  const preview = buildPreview(transcription);
  const rawInput = path.join("uploads", path.basename(filePath));

  return prisma.note.create({
    data: {
      patientId: data.patientId,
      inputType: InputType.AUDIO,
      rawInput,
      transcription,
      processedContent: null,
      preview,
    },
    select: noteSelect,
  });
}

export async function listNotes() {
  return prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      preview: true,
      createdAt: true,
      inputType: true,
      patient: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
    select: {
      id: true,
      transcription: true,
      processedContent: true,
      inputType: true,
      rawInput: true,
      createdAt: true,
      patient: {
        select: {
          id: true,
          externalId: true,
          fullName: true,
          dateOfBirth: true,
        },
      },
    },
  });
}
