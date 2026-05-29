import { z } from "zod";

export const createTextNoteSchema = z.object({
  patientId: z.string().min(1),
  inputType: z.literal("TEXT"),
  rawInput: z.string().min(1).max(10_000),
});

export const createAudioNoteSchema = z.object({
  patientId: z.string().min(1),
  inputType: z.literal("AUDIO"),
});

export const createNoteSchema = z.discriminatedUnion("inputType", [
  createTextNoteSchema,
  createAudioNoteSchema,
]);

export type CreateTextNoteInput = z.infer<typeof createTextNoteSchema>;
export type CreateAudioNoteInput = z.infer<typeof createAudioNoteSchema>;
