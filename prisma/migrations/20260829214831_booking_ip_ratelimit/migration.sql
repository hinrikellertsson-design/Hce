-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "ip" TEXT;

-- CreateIndex
CREATE INDEX "Booking_ip_createdAt_idx" ON "Booking"("ip", "createdAt");
