"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/briefing", label: "Briefing", icon: "☀️", desc: "Morning decision" },
  { href: "/dashboard", label: "Dashboard", icon: "📊", desc: "Weekly HQ" },
  { href: "/load", label: "Load Monitor", icon: "💓", desc: "Burnout prevention" },
  { href: "/races", label: "Races", icon: "🏁", desc: "Race hub" },
  { href: "/fuelling", label: "Fuelling", icon: "⚡", desc: "Nutrition" },
  { href: "/planner", label: "Planner", icon: "📅", desc: "Monthly view" },
  { href: "/chat", label: "Ask AI", icon: "🤖", desc: "Coach" },
  { href: "/settings", label: "Settings", icon: "⚙️", desc: "Configure" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-surface-900 dark:bg-surface-950 border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-lg font-bold text-white tracking-tight">
          ⚡ Command Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">Alexandre Santos</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                isActive
                  ? "bg-brand-600/20 text-brand-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-[10px] text-gray-500">{item.desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle + status */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Build 5 — Live Data</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </aside>
  );
}
