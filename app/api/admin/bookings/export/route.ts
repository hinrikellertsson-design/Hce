import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { formatDateShort, mealTypeLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

function csvEscape(value: string) {
  // Forðumst "formula injection": ef gildi byrjar á =, +, -, @ (eða tab/CR)
  // getur Excel/Sheets túlkað það sem formúlu þegar skráin er opnuð. Forskeytum
  // með ' svo innihaldið sé alltaf lesið sem hreinn texti.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\n;]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sittingId = request.nextUrl.searchParams.get("sittingId");

  const bookings = await prisma.booking.findMany({
    where: sittingId ? { sittingId } : undefined,
    include: { sitting: true },
    orderBy: [{ sitting: { date: "asc" } }, { createdAt: "asc" }],
  });

  const header = [
    "Æfing",
    "Dagsetning",
    "Máltíð",
    "Nafn",
    "Netfang",
    "Sími",
    "Fjöldi",
    "Staða",
    "Greitt",
    "Athugasemd",
    "Bókað",
  ];

  const rows = bookings.map((b) =>
    [
      b.sitting.title,
      formatDateShort(b.sitting.date),
      mealTypeLabel(b.sitting.mealType),
      b.name,
      b.email,
      b.phone,
      String(b.partySize),
      b.status === "CONFIRMED" ? "Staðfest" : "Afbókað",
      b.isPaid ? "Já" : "Nei",
      b.notes ?? "",
      b.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");
  const filename = sittingId ? `bokanir-${sittingId}.csv` : "bokanir-allar.csv";

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
