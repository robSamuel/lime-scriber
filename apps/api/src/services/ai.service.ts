import { createReadStream } from "node:fs";
import OpenAI from "openai";
import { config, isOpenAiConfigured } from "../config.js";
import { HttpError } from "../errors/http-error.js";
import { SOAP_SYSTEM_PROMPT } from "../prompts/soap.js";

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

export async function structureNote(transcription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SOAP_SYSTEM_PROMPT },
      { role: "user", content: transcription },
    ],
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("Empty response from structureNote");
  }

  return content;
}
