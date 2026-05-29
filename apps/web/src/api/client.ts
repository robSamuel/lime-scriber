import type { Patient } from "../types/index.ts";

export type { Patient };

const baseUrl = import.meta.env.VITE_API_URL;

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json() as Promise<{ status: string }>;
}

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`${baseUrl}/patients`);
  if (!res.ok) {
    throw new Error(`Failed to fetch patients: ${res.status}`);
  }
  return res.json() as Promise<Patient[]>;
}
