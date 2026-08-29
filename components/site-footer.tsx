export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-muted">
        <p className="font-display text-base text-ink">Hótel og matvælaskólinn</p>
        <p className="mt-1 max-w-md">
          Bókanir fyrir hádegis- og kvöldverði á æfingum Matreiðslu og
          framreiðsludeildar hjá Hótel og matvælaskólanum.
        </p>
        <p className="mt-6 text-xs text-muted/80">
          © {new Date().getFullYear()} Hótel og matvælaskólinn
        </p>
      </div>
    </footer>
  );
}
