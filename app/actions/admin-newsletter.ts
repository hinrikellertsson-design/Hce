"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";

const subscriberSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Ógilt netfang"),
});

export type AddSubscriberState = { status: "idle" | "error" | "success"; message?: string };

export async function addNewsletterSubscriber(
  _prevState: AddSubscriberState,
  formData: FormData
): Promise<AddSubscriberState> {
  await requireAdminSession();

  const parsed = subscriberSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Ógild gögn." };
  }

  const data = parsed.data;

  try {
    await prisma.newsletterSubscriber.create({
      data: { name: data.name || null, email: data.email },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { status: "error", message: "Þetta netfang er þegar á listanum." };
    }
    throw err;
  }

  revalidatePath("/admin/frettabref");
  return { status: "success", message: "Netfang bætt við listann." };
}

export async function removeNewsletterSubscriber(id: string) {
  await requireAdminSession();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/frettabref");
}
