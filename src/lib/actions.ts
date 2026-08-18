"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(_prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Rangt netfang eða lykilorð.";
    }
    throw error;
  }

  const session = await auth();
  redirect(session?.user.role === "TEACHER" ? "/kennari" : "/nemandi");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}

export async function createAssignmentAction(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") throw new Error("Ekki heimilt");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.teacherId !== session.user.id) throw new Error("Ekki heimilt");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDateRaw = formData.get("dueDate") as string;

  await prisma.assignment.create({
    data: {
      courseId,
      title,
      description: description || null,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    },
  });

  revalidatePath(`/kennari/afangar/${courseId}`);
}

export async function submitAssignmentAction(assignmentId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") throw new Error("Ekki heimilt");

  const content = formData.get("content") as string;
  if (!content?.trim()) throw new Error("Skil má ekki vera tómt");

  await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: session.user.id,
      },
    },
    create: {
      assignmentId,
      studentId: session.user.id,
      content,
      status: "SUBMITTED",
    },
    update: {
      content,
      status: "SUBMITTED",
    },
  });

  revalidatePath(`/nemandi/verkefni/${assignmentId}`);
}

export async function giveFeedbackAction(submissionId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") throw new Error("Ekki heimilt");

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { assignment: { include: { course: true } } },
  });
  if (!submission || submission.assignment.course.teacherId !== session.user.id) {
    throw new Error("Ekki heimilt");
  }

  const comment = formData.get("comment") as string;
  const grade = formData.get("grade") as string;

  await prisma.feedback.upsert({
    where: { submissionId },
    create: {
      submissionId,
      teacherId: session.user.id,
      comment,
      grade: grade || null,
    },
    update: {
      comment,
      grade: grade || null,
    },
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "GRADED" },
  });

  revalidatePath(`/kennari/verkefni/${submission.assignmentId}`);
}
