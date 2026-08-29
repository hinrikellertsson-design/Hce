import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatKronur, mealTypeLabel } from "@/lib/format";
import { availableSeats, getBookedSeats } from "@/lib/sittings";

export const dynamic = "force-dynamic";

async function getUpcomingSittings() {
  const sittings = await prisma.sitting.findMany({
    where: { status: "OPEN", date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 3,
  });

  return Promise.all(
    sittings.map(async (sitting) => ({
      sitting,
      available: availableSeats(sitting.maxSeats, await getBookedSeats(sitting.id)),
    }))
  );
}

export default async function HomePage() {
  const upcoming = await getUpcomingSittings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
            <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">
              Nemenda æfingar · Matreiðslu og Framreiðsludeild
            </p>
            <h1 className="font-display mt-4 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
              Njóttu máltíðar sem nemendur Hótel og matvælaskólans elda og bera fram
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
              Á æfingum matreiðslu og framreiðsludeildarinnar bjóðum við hádegis-
              og kvöldverði opna almenningi. Bókaðu borð á örfáum mínútum —
              við sendum staðfestingu og greiðsluupplýsingar viku fyrir
              viðburðinn.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/aefingar"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark"
              >
                Skoða laus borð
              </Link>
              <a
                href="#hvernig"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-gold"
              >
                Hvernig virkar þetta?
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">Næstu æfingar</h2>
            <Link href="/aefingar" className="text-sm text-gold-dark hover:underline">
              Sjá allar æfingar →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <p className="mt-6 text-muted">
              Engar æfingar eru opnar fyrir bókun þessa stundina. Kíktu aftur
              síðar.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {upcoming.map(({ sitting, available }) => (
                <Link
                  key={sitting.id}
                  href={`/aefingar/${sitting.id}`}
                  className="group rounded-2xl border border-line bg-white/60 p-6 transition-colors hover:border-gold"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">
                    {mealTypeLabel(sitting.mealType)}
                  </p>
                  <p className="font-display mt-2 text-lg text-ink">{sitting.title}</p>
                  <p className="mt-1 text-sm text-muted">{formatDateLong(sitting.date)}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted">{formatKronur(sitting.pricePerSeat)} / mann</span>
                    <span className={available > 0 ? "text-gold-dark" : "text-muted"}>
                      {available > 0 ? `${available} sæti laus` : "Fullbókað"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="hvernig" className="border-t border-line bg-cream-muted">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="font-display text-2xl text-ink">Hvernig virkar þetta?</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Veldu æfingu",
                  body: "Skoðaðu opnar hádegis- og kvöldverðaræfingar og veldu þá sem hentar.",
                },
                {
                  step: "2",
                  title: "Bókaðu borð",
                  body: "Skráðu nafn, netfang, síma og fjölda gesta — bókunin er staðfest samstundis.",
                },
                {
                  step: "3",
                  title: "Fáðu greiðsluupplýsingar",
                  body: "Viku fyrir viðburðinn sendum við staðfestingu og upplýsingar um greiðslu.",
                },
              ].map((item) => (
                <div key={item.step}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-cream">
                    {item.step}
                  </div>
                  <p className="mt-4 font-display text-lg text-ink">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
