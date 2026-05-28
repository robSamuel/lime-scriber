import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const patients = [
  {
    externalId: "PT-1001",
    fullName: "Maria Gonzalez",
    dateOfBirth: new Date("1948-03-12"),
  },
  {
    externalId: "PT-1002",
    fullName: "James Whitaker",
    dateOfBirth: new Date("1955-07-22"),
  },
  {
    externalId: "PT-1003",
    fullName: "Elena Ruiz",
    dateOfBirth: new Date("1962-11-05"),
  },
];

async function main() {
  const count = await prisma.patient.count();
  if (count > 0) {
    console.log("Patients already seeded, skipping.");
    return;
  }

  for (const patient of patients) {
    await prisma.patient.create({ data: patient });
  }

  console.log(`Seeded ${patients.length} patients.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
