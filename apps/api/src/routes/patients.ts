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

patientsRouter.get("/:id", async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
    });

    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
});
