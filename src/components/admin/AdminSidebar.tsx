"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Wrench,
  Globe,
  UserRound,
  LogOut,
  Layers,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Hero", href: "/admin/dashboard/hero", icon: Globe },
  { name: "Services", href: "/admin/dashboard/services", icon: Wrench },
  { name: "Projects", href: "/admin/dashboard/projects", icon: Briefcase },
  { name: "Tech Stack", href: "/admin/dashboard/tech-stack", icon: Wrench },
  { name: "Process", href: "/admin/dashboard/process", icon: Layers },
  { name: "Packages", href: "/admin/dashboard/packages", icon: Briefcase },
  { name: "Translations", href: "/admin/dashboard/translations", icon: Languages },
  { name: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { name: "Founders", href: "/admin/dashboard/founders", icon: UserRound },
  { name: "Team", href: "/admin/dashboard/team", icon: Users },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-[#0F172A] border-r border-white/10 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-white tracking-tighter">
          H&M<span className="text-blue-500">STUDIO</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
