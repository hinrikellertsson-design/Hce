import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function csvEscape(value: string) {
  // Sama vörn og í bókanaútflutningnum: forðumst "formula injection" í Excel/Sheets.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\n;]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [bookings, subscribers] = await Promise.all([
    prisma.booking.findMany({
      where: { marketingOptIn: true },
      select: { name: true, email: true },
      distinct: ["email"],
      orderBy: { email: "asc" },
    }),
    prisma.newsletterSubscriber.findMany({ select: { name: true, email: true } }),
  ]);

  const seen = new Set<string>();
  const combined: { name: string; email: string }[] = [];
  for (const entry of [...bookings, ...subscribers.map((s) => ({ name: s.name ?? "", email: s.email }))]) {
    if (seen.has(entry.email)) continue;
    seen.add(entry.email);
    combined.push(entry);
  }

  const header = ["Nafn", "Netfang"];
  const rows = combined.map((b) => [b.name, b.email].map(csvEscape).join(","));
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="frettabref-netfong.csv"`,
    },
  });
}
