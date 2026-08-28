import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { formatDateLong, mealTypeLabel } from "@/lib/format";
import { CancelForm } from "./cancel-form";

export const dynamic = "force-dynamic";

export default async function CancelBookingPage({ params }: PageProps<"/bokun/[token]/hafna">) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
    include: { sitting: true },
  });

  if (!booking) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-16">
          <h1 className="font-display text-3xl text-ink">Afbóka bókun</h1>

          <div className="mt-6 rounded-2xl border border-line bg-white/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">
              {mealTypeLabel(booking.sitting.mealType)}
            </p>
            <p className="font-display mt-1 text-lg text-ink">{booking.sitting.title}</p>
            <p className="mt-1 text-sm text-muted">{formatDateLong(booking.sitting.date)}</p>
            <p className="mt-3 text-sm text-muted">
              Bókun á nafni <span className="text-ink">{booking.name}</span>, {booking.partySize} gestir.
            </p>
          </div>

          <div className="mt-8">
            {booking.status === "CANCELLED" ? (
              <div className="rounded-2xl border border-line bg-cream-muted p-6 text-muted">
                Þessi bókun hefur þegar verið afbókuð.
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted">
                  Ertu viss um að þú viljir afbóka þessa bókun? Sætin verða þá
                  laus fyrir aðra.
                </p>
                <CancelForm cancelToken={token} />
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
