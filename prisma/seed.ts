// Sáðgögn fyrir frumgerð — eingöngu uppspunnin sýnigögn, engar raunverulegar
// persónuupplýsingar nemenda eða kennara.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const teacherPassword = await bcrypt.hash("kennari123", 10);
  const studentPassword = await bcrypt.hash("nemandi123", 10);

  const teacher = await prisma.user.create({
    data: {
      name: "Anna Kennari",
      email: "kennari@mk.is",
      passwordHash: teacherPassword,
      role: "TEACHER",
    },
  });

  const studentNames = ["Bjarni Nemandi", "Katla Nemandi", "Dagur Nemandi"];
  const students = await Promise.all(
    studentNames.map((name, i) =>
      prisma.user.create({
        data: {
          name,
          email: `nemandi${i + 1}@mk.is`,
          passwordHash: studentPassword,
          role: "STUDENT",
        },
      })
    )
  );

  const course = await prisma.course.create({
    data: {
      name: "Matreiðsla 1",
      code: "MATR1AA05",
      description: "Grunnáfangi í matreiðslu — hráefnisþekking og eldunaraðferðir.",
      teacherId: teacher.id,
    },
  });

  await Promise.all(
    students.map((s) =>
      prisma.enrollment.create({
        data: { courseId: course.id, studentId: s.id },
      })
    )
  );

  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: "Verkefni 1: Grunnsoð",
      description: "Útbúið stutta skýrslu um gerð grænmetissoðs og skilið inn.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: "Verkefni 2: Hnífatækni",
      description: "Myndband eða lýsing á æfingu í grunnhnífatækni.",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const submission = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: students[0].id,
      content:
        "Grænmetissoð: laukur, gulrót, sellerí og púrra svitað, vatni bætt við og soðið í 45 mín, síað.",
      status: "SUBMITTED",
    },
  });

  await prisma.feedback.create({
    data: {
      submissionId: submission.id,
      teacherId: teacher.id,
      comment: "Gott hlutfall grænmetis, mundu að skrá suðutíma nákvæmlega næst.",
      grade: "8",
    },
  });

  await prisma.submission.update({
    where: { id: submission.id },
    data: { status: "GRADED" },
  });

  console.log("Sáðgögn tilbúin.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
