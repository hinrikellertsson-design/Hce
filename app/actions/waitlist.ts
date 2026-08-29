"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWaitlistJoinedEmail } from "@/lib/email";

const waitlistSchema = z.object({
  sittingId: z.string().min(1),
  name: z.string().trim().min(2, "Nafn þarf að vera a.m.k. 2 stafir").max(120),
  email: z.string().trim().email("Ógilt netfang"),
  phone: z.string().trim().min(7, "Símanúmer virðist of stutt").max(20),
  partySize: z.coerce.number().int().min(1, "Fjöldi verður að vera a.m.k. 1").max(50),
});

export type JoinWaitlistState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof waitlistSchema>, string>>;
};

export async function joinWaitlist(
  _prevState: JoinWaitlistState,
  formData: FormData
): Promise<JoinWaitlistState> {
  // Falin gildra fyrir vélmenni, sama og á bókunarforminu.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { status: "success" };
  }

  const parsed = waitlistSchema.safeParse({
    sittingId: formData.get("sittingId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    partySize: formData.get("partySize"),
  });

  if (!parsed.success) {
    const fieldErrors: JoinWaitlistState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof waitlistSchema>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Vinsamlegast leiðréttið villurnar hér að neðan.", fieldErrors };
  }

  const data = parsed.data;

  const sitting = await prisma.sitting.findUnique({ where: { id: data.sittingId } });
  if (!sitting) {
    return { status: "error", message: "Fann ekki æfinguna." };
  }

  const entry = await prisma.waitlistEntry.create({
    data: {
      sittingId: sitting.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      partySize: data.partySize,
    },
  });

  await sendWaitlistJoinedEmail(sitting, { name: entry.name, partySize: entry.partySize }, entry.email);

  return { status: "success" };
}
