import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || ".audio";
    cb(null, `${unique}${ext}`);
  },
});

function audioFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
    return;
  }
  cb(new Error("Only audio files are allowed"));
}

export const audioUpload = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export function handleAudioUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const contentType = req.headers["content-type"] ?? "";
  if (contentType.includes("multipart/form-data")) {
    audioUpload.single("audio")(req, res, next);
    return;
  }
  next();
}
