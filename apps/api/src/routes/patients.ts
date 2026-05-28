import { Router } from "express";
import { prisma } from "../db.js";

export const patientsRouter = Router();

patientsRouter.get("/", async (_req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { fullName: "asc" },
    });
    res.json(patients);
  } catch (error) {
    next(error);
  }
});
