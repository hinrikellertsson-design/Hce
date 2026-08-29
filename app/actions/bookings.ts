"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendBookingReceivedEmail, sendCancellationEmail } from "@/lib/email";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_BOOKINGS = 3;

async function getRequestIp() {
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

const bookingSchema = z.object({
  sittingId: z.string().min(1),
  name: z.string().trim().min(2, "Nafn þarf að vera a.m.k. 2 stafir").max(120),
  email: z.string().trim().email("Ógilt netfang"),
  phone: z
    .string()
    .trim()
    .min(7, "Símanúmer virðist of stutt")
    .max(20),
  partySize: z.coerce.number().int().min(1, "Fjöldi verður að vera a.m.k. 1").max(50),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateBookingState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;
  bookingId?: string;
  cancelToken?: string;
};

export async function createBooking(
  _prevState: CreateBookingState,
  formData: FormData
): Promise<CreateBookingState> {
  // Falin gildra fyrir vélmenni: venjulegir gestir sjá aldrei þennan reit,
  // svo ef hann er útfylltur er þetta líklega sjálfvirk ruslsending.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { status: "success" };
  }

  const ip = await getRequestIp();
  if (ip) {
    const recentCount = await prisma.booking.count({
      where: { ip, createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000) } },
    });
    if (recentCount >= RATE_LIMIT_MAX_BOOKINGS) {
      return {
        status: "error",
        message: "Of margar bókanir hafa verið gerðar frá þessari nettengingu á stuttum tíma. Vinsamlegast reyndu aftur eftir smá stund.",
      };
    }
  }

  const raw = {
    sittingId: formData.get("sittingId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    partySize: formData.get("partySize"),
    notes: formData.get("notes") ?? "",
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: CreateBookingState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof bookingSchema>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Vinsamlegast leiðréttið villurnar hér að neðan.", fieldErrors };
  }

  const data = parsed.data;

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const sitting = await tx.sitting.findUnique({ where: { id: data.sittingId } });
      if (!sitting || sitting.status !== "OPEN") {
        throw new Error("SITTING_CLOSED");
      }

      // Lásum röðina svo tvær samhliða bókanir geti ekki báðar farið yfir hámark.
      await tx.$queryRaw`SELECT id FROM "Sitting" WHERE id = ${sitting.id} FOR UPDATE`;

      const bookedAgg = await tx.booking.aggregate({
        where: { sittingId: sitting.id, status: "CONFIRMED" },
        _sum: { partySize: true },
      });
      const booked = bookedAgg._sum.partySize ?? 0;
      const available = sitting.maxSeats - booked;

      if (data.partySize > available) {
        throw new Error(`NOT_ENOUGH_SEATS:${available}`);
      }

      return tx.booking.create({
        data: {
          sittingId: sitting.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          partySize: data.partySize,
          notes: data.notes || null,
          ip,
        },
        include: { sitting: true },
      });
    });

    await sendBookingReceivedEmail(
      booking.sitting,
      { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
      booking.email
    );

    return { status: "success", bookingId: booking.id, cancelToken: booking.cancelToken };
  } catch (err) {
    if (err instanceof Error && err.message === "SITTING_CLOSED") {
      return { status: "error", message: "Því miður er þessi æfing ekki lengur opin fyrir bókanir." };
    }
    if (err instanceof Error && err.message.startsWith("NOT_ENOUGH_SEATS:")) {
      const available = err.message.split(":")[1];
      return {
        status: "error",
        message:
          available === "0"
            ? "Því miður eru öll sæti upppöntuð á þessa æfingu."
            : `Því miður eru aðeins ${available} sæti laus á þessa æfingu.`,
      };
    }
    console.error("[createBooking] villa:", err);
    return { status: "error", message: "Eitthvað fór úrskeiðis. Vinsamlegast reynið aftur." };
  }
}

export type CancelBookingState = { status: "idle" | "error" | "success"; message?: string };

export async function cancelBookingByToken(
  _prevState: CancelBookingState,
  formData: FormData
): Promise<CancelBookingState> {
  const token = String(formData.get("cancelToken") ?? "");
  if (!token) return { status: "error", message: "Ógildur hlekkur." };

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
    include: { sitting: true },
  });

  if (!booking) {
    return { status: "error", message: "Fann ekki bókun tengda þessum hlekk." };
  }
  if (booking.status === "CANCELLED") {
    return { status: "success", message: "Þessi bókun var þegar afbókuð." };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });

  await sendCancellationEmail(
    booking.sitting,
    { id: booking.id, name: booking.name, partySize: booking.partySize, cancelToken: booking.cancelToken },
    booking.email
  );

  return { status: "success", message: "Bókunin hefur verið afbókuð. Sætin eru nú laus fyrir aðra." };
}
