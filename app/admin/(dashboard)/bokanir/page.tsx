import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminBookingsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const bookings = query
    ? await prisma.booking.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { sitting: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Leita í bókunum</h1>
      <p className="mt-1 text-sm text-muted">Leitaðu að nafni, netfangi eða símanúmeri þvert á allar æfingar.</p>

      <form className="mt-6 flex gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Nafn, netfang eða sími..."
          className="w-full max-w-md rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark"
        >
          Leita
        </button>
      </form>

      {!query ? (
        <p className="mt-10 text-muted">Sláðu inn leitarorð til að finna bókun.</p>
      ) : bookings.length === 0 ? (
        <p className="mt-10 text-muted">Engar bókanir fundust fyrir „{query}&ldquo;</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Nafn</th>
                <th className="px-5 py-3 font-medium">Netfang</th>
                <th className="px-5 py-3 font-medium">Sími</th>
                <th className="px-5 py-3 font-medium">Fjöldi</th>
                <th className="px-5 py-3 font-medium">Æfing</th>
                <th className="px-5 py-3 font-medium">Dagsetning</th>
                <th className="px-5 py-3 font-medium">Staða</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.map((booking) => (
                <tr key={booking.id} className={booking.status === "CANCELLED" ? "opacity-50" : ""}>
                  <td className="px-5 py-4 font-medium text-ink">{booking.name}</td>
                  <td className="px-5 py-4 text-muted">{booking.email}</td>
                  <td className="px-5 py-4 text-muted">{booking.phone}</td>
                  <td className="px-5 py-4 text-muted">{booking.partySize}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/aefingar/${booking.sittingId}`} className="text-gold-dark hover:underline">
                      {booking.sitting.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">{formatDateShort(booking.sitting.date)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {booking.status === "CONFIRMED" ? "Staðfest" : "Afbókað"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
