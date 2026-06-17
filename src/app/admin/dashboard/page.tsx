import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Briefcase, Users, Eye } from "lucide-react";

export default async function DashboardOverview() {
  const supabase = await createClient();

  const [
    { count: messagesCount },
    { count: projectsCount },
    { count: servicesCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: 'exact', head: true }),
    supabase.from("projects").select("*", { count: 'exact', head: true }),
    supabase.from("services").select("*", { count: 'exact', head: true }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { name: "Total Messages", value: messagesCount || 0, icon: MessageSquare, color: "text-blue-500" },
    { name: "Active Projects", value: projectsCount || 0, icon: Briefcase, color: "text-cyan-500" },
    { name: "Services", value: servicesCount || 0, icon: Eye, color: "text-indigo-500" },
    { name: "Team Members", value: 2, icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.name}</CardTitle>
              <stat.icon size={20} className={stat.color} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages?.map((msg) => (
                <div key={msg.id} className="flex flex-col border-b border-white/5 pb-4 last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="text-sm text-slate-400 truncate">{msg.subject}</span>
                </div>
              ))}
              {(!recentMessages || recentMessages.length === 0) && (
                <p className="text-slate-500 text-sm py-4">No recent messages.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all text-sm font-medium">
              Update Hero Section
            </button>
            <button className="p-4 rounded-xl bg-cyan-600/10 border border-cyan-500/20 hover:bg-cyan-600/20 transition-all text-sm font-medium">
              Add New Project
            </button>
            <button className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all text-sm font-medium">
              Manage Services
            </button>
            <button className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all text-sm font-medium">
              Site Settings
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
