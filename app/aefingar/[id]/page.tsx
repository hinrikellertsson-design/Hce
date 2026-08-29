import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatKronur, mealTypeLabel } from "@/lib/format";
import { availableSeats, getBookedSeats } from "@/lib/sittings";
import { BookingForm } from "./booking-form";
import { WaitlistForm } from "./waitlist-form";

export const dynamic = "force-dynamic";

export default async function SittingDetailPage({ params }: PageProps<"/aefingar/[id]">) {
  const { id } = await params;

  const sitting = await prisma.sitting.findUnique({ where: { id } });
  if (!sitting) notFound();

  const booked = await getBookedSeats(sitting.id);
  const available = availableSeats(sitting.maxSeats, booked);
  const canBook = sitting.status === "OPEN" && sitting.date >= new Date();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">
              {mealTypeLabel(sitting.mealType)}
            </p>
            <h1 className="font-display mt-3 text-3xl text-ink sm:text-4xl">{sitting.title}</h1>
            <p className="mt-3 text-muted">{formatDateLong(sitting.date)}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white/60 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Verð á mann</p>
                <p className="font-display mt-1 text-lg text-ink">{formatKronur(sitting.pricePerSeat)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Laus sæti</p>
                <p className="font-display mt-1 text-lg text-ink">{available} / {sitting.maxSeats}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Staða</p>
                <p className="font-display mt-1 text-lg text-ink">
                  {canBook && available > 0 ? "Opið fyrir bókun" : "Lokað"}
                </p>
              </div>
            </div>

            {sitting.menuDescription && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-ink">Um æfinguna</h2>
                <p className="mt-3 whitespace-pre-line text-muted">{sitting.menuDescription}</p>
              </div>
            )}
          </div>

          <div>
            {!canBook ? (
              <div className="rounded-2xl border border-line bg-cream-muted p-6 text-center text-muted">
                Þessi æfing er ekki lengur opin fyrir bókanir.
              </div>
            ) : available > 0 ? (
              <BookingForm sittingId={sitting.id} available={available} />
            ) : (
              <WaitlistForm sittingId={sitting.id} />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
