import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  OPENAI_API_KEY: z.string().optional().default(""),
});

export const config = envSchema.parse(process.env);

export function isOpenAiConfigured(): boolean {
  return config.OPENAI_API_KEY.length > 0;
}
