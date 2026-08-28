import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatKronur, mealTypeLabel } from "@/lib/format";
import { availableSeats, getBookedSeats } from "@/lib/sittings";

export const dynamic = "force-dynamic";

async function getOpenSittings() {
  const sittings = await prisma.sitting.findMany({
    where: { status: "OPEN", date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  return Promise.all(
    sittings.map(async (sitting) => ({
      sitting,
      available: availableSeats(sitting.maxSeats, await getBookedSeats(sitting.id)),
    }))
  );
}

export default async function SittingsPage() {
  const sittings = await getOpenSittings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Bókanir</p>
          <h1 className="font-display mt-3 text-3xl text-ink sm:text-4xl">Veldu æfingu</h1>
          <p className="mt-3 max-w-xl text-muted">
            Hér að neðan sérðu allar opnar hádegis- og kvöldverðaræfingar.
            Veldu þá sem hentar til að bóka borð.
          </p>

          {sittings.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
              Engar æfingar eru opnar fyrir bókun þessa stundina. Kíktu aftur
              síðar eða hafðu samband við deildina.
            </div>
          ) : (
            <ul className="mt-10 divide-y divide-line border-t border-b border-line">
              {sittings.map(({ sitting, available }) => (
                <li key={sitting.id}>
                  <Link
                    href={`/aefingar/${sitting.id}`}
                    className="flex flex-col gap-2 py-6 transition-colors hover:bg-cream-muted sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">
                        {mealTypeLabel(sitting.mealType)}
                      </p>
                      <p className="font-display mt-1 text-xl text-ink">{sitting.title}</p>
                      <p className="mt-1 text-sm text-muted">{formatDateLong(sitting.date)}</p>
                    </div>
                    <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-sm text-muted">{formatKronur(sitting.pricePerSeat)} / mann</span>
                      <span
                        className={`text-sm font-medium ${available > 0 ? "text-gold-dark" : "text-muted"}`}
                      >
                        {available > 0 ? `${available} sæti laus` : "Fullbókað"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
