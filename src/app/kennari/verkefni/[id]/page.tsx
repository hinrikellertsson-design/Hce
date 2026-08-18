import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { giveFeedbackAction } from "@/lib/actions";
import { statusLabels } from "@/lib/types";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      course: { include: { enrollments: { include: { student: true } } } },
      submissions: {
        include: { student: true, feedback: true },
      },
    },
  });

  if (!assignment || assignment.course.teacherId !== session!.user.id) notFound();

  const submissionByStudent = new Map(
    assignment.submissions.map((s) => [s.studentId, s])
  );
  const notSubmitted = assignment.course.enrollments.filter(
    (e) => !submissionByStudent.has(e.studentId)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/kennari/afangar/${assignment.courseId}`}
          className="text-sm text-neutral-500 underline"
        >
          ← {assignment.course.name}
        </Link>
        <h1 className="text-xl font-semibold mt-1">{assignment.title}</h1>
        {assignment.description && (
          <p className="text-neutral-600 mt-1">{assignment.description}</p>
        )}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-medium">Skil ({assignment.submissions.length})</h2>
        {assignment.submissions.map((s) => (
          <div key={s.id} className="border rounded-lg p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{s.student.name}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
                {statusLabels[s.status as keyof typeof statusLabels]}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap text-neutral-800 bg-neutral-50 rounded-md p-3">
              {s.content}
            </p>
            <form
              action={giveFeedbackAction.bind(null, s.id)}
              className="flex flex-col gap-2 border-t pt-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Endurgjöf</label>
                <textarea
                  name="comment"
                  rows={2}
                  defaultValue={s.feedback?.comment ?? ""}
                  className="border border-neutral-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Einkunn</label>
                <input
                  name="grade"
                  defaultValue={s.feedback?.grade ?? ""}
                  className="border border-neutral-300 rounded-md px-3 py-2 w-24"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 text-white rounded-md px-4 py-2 font-medium ml-auto"
                >
                  Vista endurgjöf
                </button>
              </div>
            </form>
          </div>
        ))}
        {assignment.submissions.length === 0 && (
          <p className="text-neutral-500 text-sm">Engin skil hafa borist ennþá.</p>
        )}
      </section>

      {notSubmitted.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-medium">Hafa ekki skilað ({notSubmitted.length})</h2>
          <ul className="text-sm text-neutral-600 flex flex-col gap-1">
            {notSubmitted.map((e) => (
              <li key={e.id}>{e.student.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
