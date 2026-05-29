import { createReadStream } from "node:fs";
import OpenAI from "openai";
import { config, isOpenAiConfigured } from "../config.js";
import { HttpError } from "../errors/http-error.js";

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY || "not-configured" });

export async function transcribeAudio(filePath: string): Promise<string> {
  if (!isOpenAiConfigured()) {
    throw new HttpError(
      503,
      "OPENAI_API_KEY is not configured. Set it in .env to enable audio transcription.",
    );
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(filePath),
      model: "whisper-1",
    });
    return transcription.text;
  } catch (error) {
    console.error("Whisper transcription failed:", error);
    throw new HttpError(
      503,
      "Audio transcription is temporarily unavailable. Check OPENAI_API_KEY and try again.",
    );
  }
}
