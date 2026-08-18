import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAssignmentAction } from "@/lib/actions";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      enrollments: { include: { student: true } },
      assignments: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { submissions: true } } },
      },
    },
  });

  if (!course || course.teacherId !== session!.user.id) notFound();

  const createAssignment = createAssignmentAction.bind(null, course.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs text-neutral-500">{course.code}</p>
        <h1 className="text-xl font-semibold">{course.name}</h1>
        {course.description && (
          <p className="text-neutral-600 mt-1">{course.description}</p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Nemendur ({course.enrollments.length})</h2>
        <ul className="text-sm text-neutral-700 flex flex-col gap-1">
          {course.enrollments.map((e) => (
            <li key={e.id}>{e.student.name}</li>
          ))}
          {course.enrollments.length === 0 && (
            <li className="text-neutral-500">Engir nemendur skráðir enn.</li>
          )}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Verkefni</h2>
        <ul className="flex flex-col gap-2">
          {course.assignments.map((a) => (
            <li key={a.id}>
              <Link
                href={`/kennari/verkefni/${a.id}`}
                className="border rounded-lg p-3 bg-white flex items-center justify-between hover:border-neutral-400"
              >
                <div>
                  <p className="font-medium">{a.title}</p>
                  {a.dueDate && (
                    <p className="text-xs text-neutral-500">
                      Skiladagur: {new Date(a.dueDate).toLocaleDateString("is-IS")}
                    </p>
                  )}
                </div>
                <span className="text-sm text-neutral-600">
                  {a._count.submissions} skil
                </span>
              </Link>
            </li>
          ))}
          {course.assignments.length === 0 && (
            <li className="text-neutral-500 text-sm">Engin verkefni ennþá.</li>
          )}
        </ul>
      </section>

      <section className="border rounded-lg p-4 bg-white flex flex-col gap-3">
        <h2 className="font-medium">Búa til nýtt verkefni</h2>
        <form action={createAssignment} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium">
              Titill
            </label>
            <input
              id="title"
              name="title"
              required
              className="border border-neutral-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">
              Lýsing
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="border border-neutral-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Skiladagur
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              className="border border-neutral-300 rounded-md px-3 py-2 w-fit"
            />
          </div>
          <button
            type="submit"
            className="bg-neutral-900 text-white rounded-md px-4 py-2 font-medium w-fit"
          >
            Búa til verkefni
          </button>
        </form>
      </section>
    </div>
  );
}
