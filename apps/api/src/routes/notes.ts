import { Router } from "express";
import { ZodError } from "zod";
import { createNoteSchema } from "../schemas/note.schema.js";
import * as notesService from "../services/notes.service.js";

export const notesRouter = Router();

notesRouter.post("/", async (req, res, next) => {
  try {
    const data = createNoteSchema.parse(req.body);
    const note = await notesService.createTextNote(data);
    res.status(201).json(note);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
        issues: error.issues,
      });
      return;
    }
    next(error);
  }
});

notesRouter.get("/", async (_req, res, next) => {
  try {
    const notes = await notesService.listNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
});
