import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=Unauthorized");
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      <AdminSidebar />
      <div className="pl-64">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
