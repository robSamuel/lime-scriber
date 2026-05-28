import { InputType } from "@prisma/client";
import { prisma } from "../db.js";
import { HttpError } from "../errors/http-error.js";
import type { CreateNoteInput } from "../schemas/note.schema.js";

const PREVIEW_MAX_LENGTH = 120;

function buildPreview(text: string): string {
  if (text.length <= PREVIEW_MAX_LENGTH) {
    return text;
  }
  return `${text.slice(0, PREVIEW_MAX_LENGTH)}...`;
}

export async function createTextNote(data: CreateNoteInput) {
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
    select: { id: true },
  });

  if (!patient) {
    throw new HttpError(404, "Patient not found");
  }

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
    select: {
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
    },
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
