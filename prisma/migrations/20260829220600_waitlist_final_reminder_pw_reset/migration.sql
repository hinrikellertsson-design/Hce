-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "finalReminderSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "passwordResetTokenHash" TEXT,
ADD COLUMN     "passwordResetExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "sittingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WaitlistEntry_sittingId_idx" ON "WaitlistEntry"("sittingId");

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_sittingId_fkey" FOREIGN KEY ("sittingId") REFERENCES "Sitting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
