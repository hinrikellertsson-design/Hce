import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "mk_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // vika
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const PASSWORD_RESET_TTL_MINUTES = 60;

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

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Býr til slembinn endurstillingarhlekk fyrir lykilorð, geymir bara hash-að
// gildi hans í gagnagrunni og skilar hráa tákninu til að setja í tölvupóstshlekk.
export async function createPasswordResetToken(adminId: string) {
  const token = randomBytes(32).toString("hex");
  await prisma.adminUser.update({
    where: { id: adminId },
    data: {
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60_000),
    },
  });
  return token;
}

export async function consumePasswordResetToken(token: string, newPasswordHash: string) {
  const admin = await prisma.adminUser.findFirst({
    where: { passwordResetTokenHash: hashResetToken(token), passwordResetExpiresAt: { gt: new Date() } },
  });
  if (!admin) return false;

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash: newPasswordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
  return true;
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
