import { auth } from "@/auth";
import { SiteHeader } from "@/components/SiteHeader";

export default async function NemandiLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader name={session?.user.name ?? ""} />
      <main className="flex-1 px-6 py-8 max-w-4xl w-full mx-auto">{children}</main>
    </div>
  );
}
