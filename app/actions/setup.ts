"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, hashPassword } from "@/lib/auth";

const setupSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Ógilt netfang"),
    password: z.string().min(8, "Lykilorð þarf að vera a.m.k. 8 stafir"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Lykilorðin passa ekki saman",
    path: ["passwordConfirm"],
  });

export type SetupState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "passwordConfirm", string>>;
};

// Eingöngu hægt að nota þessa aðgerð meðan enginn stjórnandi er til —
// kemur í veg fyrir að síðan sé misnotuð til að búa til fleiri stjórnendur
// eftir að fyrsti hefur verið stofnaður.
export async function setupFirstAdmin(_prevState: SetupState, formData: FormData): Promise<SetupState> {
  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    return { status: "error", message: "Uppsetningu er þegar lokið — notaðu innskráninguna í staðinn." };
  }

  const parsed = setupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    const fieldErrors: SetupState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "email" | "password" | "passwordConfirm";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Vinsamlegast leiðréttið villurnar hér að neðan.", fieldErrors };
  }

  const { email, password } = parsed.data;
  const passwordHash = await hashPassword(password);

  // Race-vörn: ef tveir reyna að setja upp á sama augnabliki, láta
  // gagnagrunninn hafna seinni tilrauninni frekar en að treysta bara
  // count-athuguninni að ofan.
  let admin;
  try {
    admin = await prisma.adminUser.create({ data: { email, passwordHash } });
  } catch {
    return { status: "error", message: "Uppsetningu er þegar lokið — notaðu innskráninguna í staðinn." };
  }

  await createSessionCookie(admin.id, admin.email);
  redirect("/admin");
}
