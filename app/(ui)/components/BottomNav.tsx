"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/report", label: "Report", icon: "✏️" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[60px] text-xs font-medium transition-colors ${
            pathname.startsWith(item.href)
              ? "text-black"
              : "text-gray-400"
          }`}
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
