import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "mk_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // vika
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET vantar eða er of stutt (setja í .env)");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionCookie(adminId: string, email: string) {
  const token = await new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export type AdminSession = { adminId: string; email: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { adminId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

// Læsir stjórnandaaðgangi tímabundið eftir margar rangar innskráningartilraunir,
// til að hægja á brute-force-tilraunum til að giska á lykilorð.
export function checkLoginLockout(admin: { lockedUntil: Date | null }) {
  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60_000);
    return { locked: true as const, minutesLeft };
  }
  return { locked: false as const };
}

export async function recordFailedLogin(adminId: string, currentAttempts: number) {
  const attempts = currentAttempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000) },
    });
  } else {
    await prisma.adminUser.update({ where: { id: adminId }, data: { failedLoginAttempts: attempts } });
  }
}

export async function resetLoginAttempts(adminId: string) {
  await prisma.adminUser.update({ where: { id: adminId }, data: { failedLoginAttempts: 0, lockedUntil: null } });
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
