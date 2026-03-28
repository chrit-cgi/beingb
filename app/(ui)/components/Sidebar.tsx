"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
];

interface Props {
  user: { email?: string | null; name?: string | null };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r bg-white px-4 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">BeingB</h1>
        <p className="text-sm text-gray-500 mt-1 truncate">{user.name ?? user.email}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-500 hover:text-black text-left px-3 py-2 min-h-[44px]"
      >
        Sign out
      </button>
    </aside>
  );
}
