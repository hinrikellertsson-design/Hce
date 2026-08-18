import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { submitAssignmentAction } from "@/lib/actions";
import { statusLabels } from "@/lib/types";

export default async function StudentAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!assignment) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_studentId: {
        courseId: assignment.courseId,
        studentId: session!.user.id,
      },
    },
  });
  if (!enrollment) notFound();

  const submission = await prisma.submission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment.id,
        studentId: session!.user.id,
      },
    },
    include: { feedback: true },
  });

  const submitAssignment = submitAssignmentAction.bind(null, assignment.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/nemandi"
          className="text-sm text-neutral-500 underline"
        >
          ← {assignment.course.name}
        </Link>
        <h1 className="text-xl font-semibold mt-1">{assignment.title}</h1>
        {assignment.description && (
          <p className="text-neutral-600 mt-1">{assignment.description}</p>
        )}
        {assignment.dueDate && (
          <p className="text-xs text-neutral-500 mt-1">
            Skiladagur: {new Date(assignment.dueDate).toLocaleDateString("is-IS")}
          </p>
        )}
      </div>

      <section className="border rounded-lg p-4 bg-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Mín skil</h2>
          {submission && (
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
              {statusLabels[submission.status as keyof typeof statusLabels]}
            </span>
          )}
        </div>
        <form action={submitAssignment} className="flex flex-col gap-3">
          <textarea
            name="content"
            rows={6}
            required
            defaultValue={submission?.content ?? ""}
            placeholder="Skrifaðu eða límdu svarið þitt hér..."
            className="border border-neutral-300 rounded-md px-3 py-2"
          />
          <button
            type="submit"
            className="bg-neutral-900 text-white rounded-md px-4 py-2 font-medium w-fit"
          >
            {submission ? "Uppfæra skil" : "Skila verkefni"}
          </button>
        </form>
      </section>

      {submission?.feedback && (
        <section className="border rounded-lg p-4 bg-white flex flex-col gap-2">
          <h2 className="font-medium">Endurgjöf frá kennara</h2>
          <p className="text-sm whitespace-pre-wrap text-neutral-800">
            {submission.feedback.comment}
          </p>
          {submission.feedback.grade && (
            <p className="text-sm font-medium">Einkunn: {submission.feedback.grade}</p>
          )}
        </section>
      )}
    </div>
  );
}
