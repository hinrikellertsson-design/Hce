import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatKronur, mealTypeLabel } from "@/lib/format";
import { availableSeats, getBookedSeats } from "@/lib/sittings";
import { ToggleStatusButton, DeleteSittingButton } from "./sitting-actions";

export const dynamic = "force-dynamic";

export default async function AdminSittingsPage() {
  const sittings = await prisma.sitting.findMany({ orderBy: { date: "desc" } });

  const rows = await Promise.all(
    sittings.map(async (sitting) => {
      const booked = await getBookedSeats(sitting.id);
      return { sitting, booked, available: availableSeats(sitting.maxSeats, booked) };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Æfingar</h1>
        <Link
          href="/admin/aefingar/ny"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark"
        >
          + Ný æfing
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-muted">Engin æfing hefur verið búin til ennþá.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Æfing</th>
                <th className="px-5 py-3 font-medium">Dagsetning</th>
                <th className="px-5 py-3 font-medium">Máltíð</th>
                <th className="px-5 py-3 font-medium">Verð</th>
                <th className="px-5 py-3 font-medium">Sæti</th>
                <th className="px-5 py-3 font-medium">Staða</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(({ sitting, booked, available }) => (
                <tr key={sitting.id} className="hover:bg-cream-muted/60">
                  <td className="px-5 py-4">
                    <Link href={`/admin/aefingar/${sitting.id}`} className="font-medium text-ink hover:underline">
                      {sitting.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">{formatDateLong(sitting.date)}</td>
                  <td className="px-5 py-4 text-muted">{mealTypeLabel(sitting.mealType)}</td>
                  <td className="px-5 py-4 text-muted">{formatKronur(sitting.pricePerSeat)}</td>
                  <td className="px-5 py-4 text-muted">
                    {booked} / {sitting.maxSeats}
                    <span className="ml-1 text-xs">({available} laus)</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        sitting.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {sitting.status === "OPEN" ? "Opið" : "Lokað"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <ToggleStatusButton sittingId={sitting.id} status={sitting.status} />
                      <DeleteSittingButton sittingId={sitting.id} />
                    </div>
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
