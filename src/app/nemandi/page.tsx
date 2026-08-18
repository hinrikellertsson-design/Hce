import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { statusLabels } from "@/lib/types";

export default async function NemandiDashboard() {
  const session = await auth();

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session!.user.id },
    include: {
      course: {
        include: {
          assignments: {
            orderBy: { dueDate: "asc" },
            include: {
              submissions: {
                where: { studentId: session!.user.id },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Áfangarnir mínir</h1>
      {enrollments.map(({ course }) => (
        <section key={course.id} className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-neutral-500">{course.code}</p>
            <h2 className="font-medium">{course.name}</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {course.assignments.map((a) => {
              const submission = a.submissions[0];
              return (
                <li key={a.id}>
                  <Link
                    href={`/nemandi/verkefni/${a.id}`}
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
                      {submission ? statusLabels[submission.status as keyof typeof statusLabels] : "Óskilað"}
                    </span>
                  </Link>
                </li>
              );
            })}
            {course.assignments.length === 0 && (
              <li className="text-neutral-500 text-sm">Engin verkefni ennþá.</li>
            )}
          </ul>
        </section>
      ))}
      {enrollments.length === 0 && (
        <p className="text-neutral-500">Þú ert ekki skráð/ur í neinn áfanga.</p>
      )}
    </div>
  );
}
