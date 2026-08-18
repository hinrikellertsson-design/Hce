import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function KennariDashboard() {
  const session = await auth();
  const courses = await prisma.course.findMany({
    where: { teacherId: session!.user.id },
    include: {
      _count: { select: { enrollments: true, assignments: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Áfangarnir mínir</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/kennari/afangar/${course.id}`}
            className="border rounded-lg p-4 bg-white hover:border-neutral-400 transition"
          >
            <p className="text-xs text-neutral-500">{course.code}</p>
            <p className="font-medium">{course.name}</p>
            <p className="text-sm text-neutral-600 mt-2">
              {course._count.enrollments} nemendur · {course._count.assignments} verkefni
            </p>
          </Link>
        ))}
        {courses.length === 0 && (
          <p className="text-neutral-500">Engir áfangar skráðir enn.</p>
        )}
      </div>
    </div>
  );
}
