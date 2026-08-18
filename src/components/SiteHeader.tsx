import { logoutAction } from "@/lib/actions";

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <span className="font-semibold">Kennsluvefur — matreiðslubraut</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-neutral-600">{name}</span>
        <form action={logoutAction}>
          <button type="submit" className="text-neutral-600 underline">
            Skrá út
          </button>
        </form>
      </div>
    </header>
  );
}
