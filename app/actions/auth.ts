"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, createSessionCookie, verifyPassword } from "@/lib/auth";

export type LoginState = { status: "idle" | "error"; message?: string };

export async function loginAdmin(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Vinsamlegast fyllið út netfang og lykilorð." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { status: "error", message: "Rangt netfang eða lykilorð." };
  }

  await createSessionCookie(admin.id, admin.email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/innskraning");
}
