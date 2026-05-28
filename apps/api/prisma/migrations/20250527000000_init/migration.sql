-- CreateEnum
CREATE TYPE "InputType" AS ENUM ('TEXT', 'AUDIO');

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "input_type" "InputType" NOT NULL,
    "raw_input" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "processed_content" TEXT,
    "preview" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_external_id_key" ON "patients"("external_id");

-- CreateIndex
CREATE INDEX "notes_patient_id_idx" ON "notes"("patient_id");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
