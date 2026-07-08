export function SetupNotice() {
  return (
    <div className="border border-warning/40 bg-warning-soft px-5 py-4 text-sm text-ink">
      <p className="font-medium mb-1">Supabase isn&apos;t connected yet</p>
      <p className="text-ink-muted">
        Add <code className="rounded bg-surface px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-surface px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
        (see <code className="rounded bg-surface px-1 py-0.5">README.md</code>), then reload.
      </p>
    </div>
  );
}
