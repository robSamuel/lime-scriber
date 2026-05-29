import { Router } from "express";
import { ZodError } from "zod";
import { handleAudioUpload } from "../middleware/upload.js";
import {
  createAudioNoteSchema,
  createTextNoteSchema,
} from "../schemas/note.schema.js";
import * as notesService from "../services/notes.service.js";

export const notesRouter = Router();

notesRouter.post("/", handleAudioUpload, async (req, res, next) => {
  try {
    const contentType = req.headers["content-type"] ?? "";

    if (contentType.includes("multipart/form-data")) {
      if (!req.file) {
        res.status(400).json({ error: "Audio file is required" });
        return;
      }

      const data = createAudioNoteSchema.parse({
        patientId: req.body.patientId,
        inputType: req.body.inputType,
      });

      const note = await notesService.createAudioNote(data, req.file.path);
      res.status(201).json(note);
      return;
    }

    const data = createTextNoteSchema.parse(req.body);
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
    if (error instanceof Error && error.message === "Only audio files are allowed") {
      res.status(400).json({ error: error.message });
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
