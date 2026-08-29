"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkLoginLockout,
  clearSessionCookie,
  createSessionCookie,
  recordFailedLogin,
  resetLoginAttempts,
  verifyPassword,
} from "@/lib/auth";

export type LoginState = { status: "idle" | "error"; message?: string };

export async function loginAdmin(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Vinsamlegast fyllið út netfang og lykilorð." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { status: "error", message: "Rangt netfang eða lykilorð." };
  }

  const lockout = checkLoginLockout(admin);
  if (lockout.locked) {
    return {
      status: "error",
      message: `Of margar rangar tilraunir. Reyndu aftur eftir ${lockout.minutesLeft} mín.`,
    };
  }

  if (!(await verifyPassword(password, admin.passwordHash))) {
    await recordFailedLogin(admin.id, admin.failedLoginAttempts);
    return { status: "error", message: "Rangt netfang eða lykilorð." };
  }

  await resetLoginAttempts(admin.id);
  await createSessionCookie(admin.id, admin.email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/innskraning");
}
