"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendCancellationEmail, sendFinalPaymentReminderEmail, sendPaymentReminderEmail } from "@/lib/email";
import { getSettings, SETTINGS_KEYS } from "@/lib/settings";

const bookingEditSchema = z.object({
  name: z.string().trim().min(2, "Nafn þarf að vera a.m.k. 2 stafir").max(120),
  email: z.string().trim().email("Ógilt netfang"),
  phone: z.string().trim().min(7, "Símanúmer virðist of stutt").max(20),
  partySize: z.coerce.number().int().min(1, "Fjöldi verður að vera a.m.k. 1").max(50),
});

export type UpdateBookingResult = { status: "success" } | { status: "error"; message: string };

export async function updateBookingDetails(
  bookingId: string,
  input: { name: string; email: string; phone: string; partySize: number }
): Promise<UpdateBookingResult> {
  await requireAdminSession();

  const parsed = bookingEditSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Ógild gögn." };
  }
  const data = parsed.data;

  const existing = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });

  if (data.partySize !== existing.partySize && existing.status === "CONFIRMED") {
    const bookedAgg = await prisma.booking.aggregate({
      where: { sittingId: existing.sittingId, status: "CONFIRMED", id: { not: bookingId } },
      _sum: { partySize: true },
    });
    const bookedByOthers = bookedAgg._sum.partySize ?? 0;
    const sitting = await prisma.sitting.findUniqueOrThrow({ where: { id: existing.sittingId } });
    if (bookedByOthers + data.partySize > sitting.maxSeats) {
      return {
        status: "error",
        message: `Ekki nóg pláss — hámark ${sitting.maxSeats - bookedByOthers} sæti fyrir þessa bókun.`,
      };
    }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { name: data.name, email: data.email, phone: data.phone, partySize: data.partySize },
  });

  revalidatePath(`/admin/aefingar/${existing.sittingId}`);
  revalidatePath("/admin/bokanir");
  return { status: "success" };
}

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

export async function sendFinalReminderNow(bookingId: string) {
  await requireAdminSession();

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { sitting: true },
  });

  const settings = await getSettings();

  await sendFinalPaymentReminderEmail(
    booking.sitting,
    { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
    booking.email,
    settings[SETTINGS_KEYS.bankAccount],
    settings[SETTINGS_KEYS.bankAccountHolder],
    settings[SETTINGS_KEYS.bankKennitala]
  );

  await prisma.booking.update({ where: { id: bookingId }, data: { finalReminderSentAt: new Date() } });
  revalidatePath(`/admin/aefingar/${booking.sittingId}`);
}
