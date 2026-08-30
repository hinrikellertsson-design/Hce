import { prisma } from "@/lib/prisma";
import { CopyEmailsButton } from "./copy-button";
import { AddSubscriberForm } from "./add-subscriber-form";
import { RemoveSubscriberButton } from "./remove-subscriber-button";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [bookingOptIns, subscribers] = await Promise.all([
    prisma.booking.findMany({
      where: { marketingOptIn: true },
      select: { name: true, email: true },
      distinct: ["email"],
      orderBy: { email: "asc" },
    }),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const allEmails = Array.from(new Set([...bookingOptIns.map((b) => b.email), ...subscribers.map((s) => s.email)]));

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Fréttabréf</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Netföng gesta sem hafa hakað við „Já, ég vil fá fréttir og tilboð&ldquo; í bókunarforminu, auk þeirra sem þú
        hefur skráð handvirkt. Afritaðu listann og límdu í BCC-reitinn í tölvupóstforritinu þínu (t.d. Gmail) til að
        senda fjölpóst.
      </p>
      <p className="mt-2 text-sm font-medium text-ink">
        {allEmails.length} {allEmails.length === 1 ? "netfang samtals" : "netföng samtals"}.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <CopyEmailsButton emails={allEmails} />
        <a
          href="/api/admin/newsletter/export"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink hover:border-gold"
        >
          Sækja sem CSV
        </a>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg text-ink">Bæta netfangi handvirkt</h2>
        <p className="mt-1 text-sm text-muted">
          T.d. fyrir fólk sem hringir eða sendir tölvupóst og vill vera á lista fyrir næstu önn.
        </p>
        <div className="mt-4">
          <AddSubscriberForm />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg text-ink">Handvirkt skráð ({subscribers.length})</h2>
        {subscribers.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Enginn skráður handvirkt ennþá.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Nafn</th>
                  <th className="px-5 py-3 font-medium">Netfang</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td className="px-5 py-4 font-medium text-ink">{s.name ?? "—"}</td>
                    <td className="px-5 py-4 text-muted">{s.email}</td>
                    <td className="px-5 py-4 text-right text-xs">
                      <RemoveSubscriberButton id={s.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg text-ink">Frá bókunum ({bookingOptIns.length})</h2>
        {bookingOptIns.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Enginn hefur hakað við fréttabréf í bókun ennþá.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Nafn</th>
                  <th className="px-5 py-3 font-medium">Netfang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookingOptIns.map((b) => (
                  <tr key={b.email}>
                    <td className="px-5 py-4 font-medium text-ink">{b.name}</td>
                    <td className="px-5 py-4 text-muted">{b.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
