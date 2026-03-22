// components/Sidebar.js
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brain, LayoutDashboard, FileText, MessageSquare, Zap, Compass, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const NAV = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume",       icon: FileText,         label: "Resume Builder" },
  { href: "/cover-letter", icon: MessageSquare,    label: "Cover Letter" },
  { href: "/interview",    icon: Zap,              label: "Interview Prep" },
  { href: "/career",       icon: Compass,          label: "Career Guidance" },
];

const ADMIN_NAV = [
  { href: "/admin", icon: ShieldCheck, label: "Admin Panel" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    toast({ title: "Signed out. See you soon! 👋" });
    await logout();
  };

  const NavItem = ({ href, icon: Icon, label }) => {
    const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
          active
            ? "bg-indigo-500/20 text-indigo-300"
            : "text-white/40 hover:text-white/80 hover:bg-white/5"
        )}>
        <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", active ? "text-indigo-400" : "text-white/30 group-hover:text-white/60")} />
        <span className="flex-1">{label}</span>
        {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-400/50" />}
      </Link>
    );
  };

  return (
    <aside className="sidebar-root">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center gradient-bg flex-shrink-0">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base tracking-tight leading-none">SensAI</p>
            <p className="text-white/25 text-[10px] font-medium tracking-wider uppercase mt-0.5">Career Co-Pilot</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {NAV.map((item) => <NavItem key={item.href} {...item} />)}

        {user?.role === "ADMIN" && (
          <>
            <div className="my-4 border-t border-white/5" />
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">Admin</p>
            {ADMIN_NAV.map((item) => <NavItem key={item.href} {...item} />)}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm font-semibold truncate">{user?.name ?? "..."}</p>
            <p className="text-white/30 text-xs truncate">{user?.email ?? ""}</p>
          </div>
          {user?.role === "ADMIN" && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 uppercase tracking-wide">
              Admin
            </span>
          )}
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/35 hover:text-white/70 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
