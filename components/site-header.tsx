import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg tracking-tight text-ink">Hótel og matvælaskólinn</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Matreiðslu og framreiðsludeild
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/aefingar" className="text-ink/80 hover:text-ink transition-colors">
            Bóka borð
          </Link>
          <Link
            href="/aefingar"
            className="rounded-full bg-ink px-4 py-2 text-cream transition-colors hover:bg-gold-dark"
          >
            Skoða æfingar
          </Link>
        </nav>
      </div>
    </header>
  );
}
