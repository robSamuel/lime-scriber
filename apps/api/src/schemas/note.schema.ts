import { z } from "zod";

export const createNoteSchema = z.object({
  patientId: z.string().min(1),
  inputType: z.literal("TEXT"),
  rawInput: z.string().min(1).max(10_000),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
