"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkLoginLockout,
  clearSessionCookie,
  consumePasswordResetToken,
  createPasswordResetToken,
  createSessionCookie,
  hashPassword,
  recordFailedLogin,
  resetLoginAttempts,
  verifyPassword,
} from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

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

export type ForgotPasswordState = { status: "idle" | "success"; message?: string };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const genericMessage = "Ef netfangið er skráð hjá okkur hefur endurstillingarhlekkur verið sendur á það.";

  if (!email) {
    return { status: "success", message: genericMessage };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (admin) {
    const token = await createPasswordResetToken(admin.id);
    await sendPasswordResetEmail(admin.email, token);
  }

  // Sömu skilaboð óháð því hvort netfangið er til — kemur í veg fyrir að hægt
  // sé að nota þessa síðu til að giska á hvaða netföng eru stjórnendur.
  return { status: "success", message: genericMessage };
}

export type ResetPasswordState = { status: "idle" | "error" | "success"; message?: string };

export async function resetPassword(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { status: "error", message: "Lykilorð þarf að vera a.m.k. 8 stafir." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Lykilorðin passa ekki saman." };
  }

  const passwordHash = await hashPassword(password);
  const ok = await consumePasswordResetToken(token, passwordHash);
  if (!ok) {
    return { status: "error", message: "Hlekkurinn er útrunninn eða ógildur. Óskaðu eftir nýjum." };
  }

  return { status: "success", message: "Lykilorð uppfært. Þú getur nú skráð þig inn." };
}
