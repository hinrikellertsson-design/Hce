"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendWaitlistSpotAvailableEmail } from "@/lib/email";

export async function notifyWaitlistEntry(entryId: string) {
  await requireAdminSession();

  const entry = await prisma.waitlistEntry.findUniqueOrThrow({
    where: { id: entryId },
    include: { sitting: true },
  });

  await sendWaitlistSpotAvailableEmail(
    entry.sitting,
    { name: entry.name, partySize: entry.partySize },
    entry.email,
    entry.sittingId
  );

  await prisma.waitlistEntry.update({ where: { id: entryId }, data: { notifiedAt: new Date() } });
  revalidatePath(`/admin/aefingar/${entry.sittingId}`);
}

export async function removeWaitlistEntry(entryId: string) {
  await requireAdminSession();
  const entry = await prisma.waitlistEntry.delete({ where: { id: entryId } });
  revalidatePath(`/admin/aefingar/${entry.sittingId}`);
}
