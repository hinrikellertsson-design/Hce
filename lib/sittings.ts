import { prisma } from "@/lib/prisma";

export async function getBookedSeats(sittingId: string, tx: typeof prisma = prisma) {
  const result = await tx.booking.aggregate({
    where: { sittingId, status: "CONFIRMED" },
    _sum: { partySize: true },
  });
  return result._sum.partySize ?? 0;
}

export function availableSeats(maxSeats: number, bookedSeats: number) {
  return Math.max(0, maxSeats - bookedSeats);
}
