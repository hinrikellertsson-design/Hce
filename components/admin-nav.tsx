import Link from "next/link";
import { logoutAdmin } from "@/app/actions/auth";

export function AdminNav({ email }: { email: string }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-lg text-ink">
            MK Stjórnborð
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted">
            <Link href="/admin" className="hover:text-ink">
              Æfingar
            </Link>
            <Link href="/admin/aefingar/ny" className="hover:text-ink">
              Ný æfing
            </Link>
            <Link href="/admin/stillingar" className="hover:text-ink">
              Stillingar
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>{email}</span>
          <form action={logoutAdmin}>
            <button type="submit" className="text-gold-dark hover:underline">
              Skrá út
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
