import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import BottomNav from "@/app/(ui)/components/BottomNav";
import Sidebar from "@/app/(ui)/components/Sidebar";

export default async function UILayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-dvh">
      <Sidebar user={session.user} />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
