import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@mk.is").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "breyttu-mer-strax";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  console.log(`Stjórnandi tilbúinn: ${admin.email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `Ekkert ADMIN_PASSWORD var sett — sjálfgefið lykilorð er "${password}". Skiptu um það sem fyrst eftir fyrstu innskráningu.`
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
