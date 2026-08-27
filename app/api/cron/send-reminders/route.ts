import { NextRequest, NextResponse } from "next/server";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminderEmail } from "@/lib/email";
import { getSettings, SETTINGS_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Keyrt daglega af Vercel Cron (sjá vercel.json). Finnur æfingar sem eiga sér
// stað eftir nákvæmlega viku og sendir staðfestingar-/greiðslupóst á allar
// staðfestar bókanir sem eiga eftir að fá slíkan póst.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = addDays(new Date(), 7);
  const rangeStart = startOfDay(target);
  const rangeEnd = endOfDay(target);

  const sittings = await prisma.sitting.findMany({
    where: { date: { gte: rangeStart, lte: rangeEnd } },
    include: {
      bookings: {
        where: { status: "CONFIRMED", reminderSentAt: null },
      },
    },
  });

  const settings = await getSettings();
  let sentCount = 0;
  const errors: string[] = [];

  for (const sitting of sittings) {
    for (const booking of sitting.bookings) {
      try {
        await sendPaymentReminderEmail(
          sitting,
          { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
          booking.email,
          settings[SETTINGS_KEYS.paymentInstructions],
          settings[SETTINGS_KEYS.bankAccount],
          settings[SETTINGS_KEYS.bankAccountHolder],
          settings[SETTINGS_KEYS.bankKennitala]
        );
        await prisma.booking.update({ where: { id: booking.id }, data: { reminderSentAt: new Date() } });
        sentCount++;
      } catch (err) {
        console.error(`[cron] Villa við sendingu áminningar fyrir bókun ${booking.id}:`, err);
        errors.push(booking.id);
      }
    }
  }

  return NextResponse.json({
    sittingsChecked: sittings.length,
    remindersSent: sentCount,
    failedBookingIds: errors,
  });
}
