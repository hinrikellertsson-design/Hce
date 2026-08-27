"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendCancellationEmail, sendPaymentReminderEmail } from "@/lib/email";
import { getSettings, SETTINGS_KEYS } from "@/lib/settings";

export async function adminCancelBooking(bookingId: string) {
  await requireAdminSession();

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: { sitting: true },
  });

  await sendCancellationEmail(
    booking.sitting,
    { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
    booking.email
  );

  revalidatePath(`/admin/aefingar/${booking.sittingId}`);
}

export async function toggleBookingPaid(bookingId: string) {
  await requireAdminSession();
  const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });
  await prisma.booking.update({ where: { id: bookingId }, data: { isPaid: !booking.isPaid } });
  revalidatePath(`/admin/aefingar/${booking.sittingId}`);
}

export async function sendReminderNow(bookingId: string) {
  await requireAdminSession();

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { sitting: true },
  });

  const settings = await getSettings();

  await sendPaymentReminderEmail(
    booking.sitting,
    { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
    booking.email,
    settings[SETTINGS_KEYS.paymentInstructions],
    settings[SETTINGS_KEYS.bankAccount],
    settings[SETTINGS_KEYS.bankAccountHolder],
    settings[SETTINGS_KEYS.bankKennitala]
  );

  await prisma.booking.update({ where: { id: bookingId }, data: { reminderSentAt: new Date() } });
  revalidatePath(`/admin/aefingar/${booking.sittingId}`);
}
