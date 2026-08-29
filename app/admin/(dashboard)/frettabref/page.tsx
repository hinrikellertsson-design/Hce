import { prisma } from "@/lib/prisma";
import { CopyEmailsButton } from "./copy-button";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const bookings = await prisma.booking.findMany({
    where: { marketingOptIn: true },
    select: { name: true, email: true },
    distinct: ["email"],
    orderBy: { email: "asc" },
  });

  const emails = bookings.map((b) => b.email);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Fréttabréf</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Netföng gesta sem hafa hakað við „Já, ég vil fá fréttir og tilboð&ldquo; í bókunarforminu. Afritaðu listann og
        límdu í BCC-reitinn í tölvupóstforritinu þínu (t.d. Gmail) til að senda fjölpóst.
      </p>
      <p className="mt-2 text-sm font-medium text-ink">
        {emails.length} {emails.length === 1 ? "netfang hefur" : "netföng hafa"} samþykkt.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <CopyEmailsButton emails={emails} />
        <a
          href="/api/admin/newsletter/export"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink hover:border-gold"
        >
          Sækja sem CSV
        </a>
      </div>

      {emails.length === 0 ? (
        <p className="mt-10 text-muted">Enginn hefur hakað við fréttabréf ennþá.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Nafn</th>
                <th className="px-5 py-3 font-medium">Netfang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.map((b) => (
                <tr key={b.email}>
                  <td className="px-5 py-4 font-medium text-ink">{b.name}</td>
                  <td className="px-5 py-4 text-muted">{b.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
