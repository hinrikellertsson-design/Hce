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

  const bookings = await prisma.booking.findMany({
    where: { marketingOptIn: true },
    select: { name: true, email: true },
    distinct: ["email"],
    orderBy: { email: "asc" },
  });

  const header = ["Nafn", "Netfang"];
  const rows = bookings.map((b) => [b.name, b.email].map(csvEscape).join(","));
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="frettabref-netfong.csv"`,
    },
  });
}
