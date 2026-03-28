import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import BottomNav from "@/app/(ui)/components/BottomNav";
import Sidebar from "@/app/(ui)/components/Sidebar";

export default async function UILayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar user={session.user} />

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
