"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const sittingSchema = z.object({
  date: z.string().min(1, "Dagsetning vantar"),
  mealType: z.enum(["LUNCH", "DINNER"]),
  title: z.string().trim().min(2, "Titill vantar").max(160),
  menuDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  maxSeats: z.coerce.number().int().min(1, "Þarf að vera a.m.k. 1").max(1000),
  pricePerSeat: z.coerce.number().int().min(0, "Verð má ekki vera neikvætt"),
  paymentReference: z.string().trim().max(40).optional().or(z.literal("")),
});

export type SittingFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof sittingSchema>, string>>;
};

async function parseSittingForm(formData: FormData) {
  return sittingSchema.safeParse({
    date: formData.get("date"),
    mealType: formData.get("mealType"),
    title: formData.get("title"),
    menuDescription: formData.get("menuDescription") ?? "",
    maxSeats: formData.get("maxSeats"),
    pricePerSeat: formData.get("pricePerSeat"),
    paymentReference: formData.get("paymentReference") ?? "",
  });
}

function fieldErrorsFromZod(error: z.ZodError<z.infer<typeof sittingSchema>>) {
  const fieldErrors: SittingFormState["fieldErrors"] = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof sittingSchema>;
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createSitting(_prevState: SittingFormState, formData: FormData): Promise<SittingFormState> {
  await requireAdminSession();

  const parsed = await parseSittingForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vinsamlegast leiðréttið villurnar.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;
  await prisma.sitting.create({
    data: {
      date: new Date(data.date),
      mealType: data.mealType,
      title: data.title,
      menuDescription: data.menuDescription || null,
      maxSeats: data.maxSeats,
      pricePerSeat: data.pricePerSeat,
      paymentReference: data.paymentReference || null,
    },
  });

  revalidatePath("/admin");
  return { status: "success", message: "Æfing búin til." };
}

export async function updateSitting(
  sittingId: string,
  _prevState: SittingFormState,
  formData: FormData
): Promise<SittingFormState> {
  await requireAdminSession();

  const parsed = await parseSittingForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vinsamlegast leiðréttið villurnar.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const data = parsed.data;
  await prisma.sitting.update({
    where: { id: sittingId },
    data: {
      date: new Date(data.date),
      mealType: data.mealType,
      title: data.title,
      menuDescription: data.menuDescription || null,
      maxSeats: data.maxSeats,
      pricePerSeat: data.pricePerSeat,
      paymentReference: data.paymentReference || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/aefingar/${sittingId}`);
  return { status: "success", message: "Æfing uppfærð." };
}

export async function toggleSittingStatus(sittingId: string) {
  await requireAdminSession();
  const sitting = await prisma.sitting.findUniqueOrThrow({ where: { id: sittingId } });
  await prisma.sitting.update({
    where: { id: sittingId },
    data: { status: sitting.status === "OPEN" ? "CLOSED" : "OPEN" },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/aefingar/${sittingId}`);
}

export async function deleteSitting(sittingId: string) {
  await requireAdminSession();
  await prisma.sitting.delete({ where: { id: sittingId } });
  revalidatePath("/admin");
}
