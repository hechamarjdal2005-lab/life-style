"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    id: "",
    title: "",
    subtitle: "",
    primary_cta_text: "",
    primary_cta_link: "",
    secondary_cta_text: "",
    secondary_cta_link: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: heroData, error } = await supabase.from("hero").select("*").single();
      if (heroData) {
        setData(heroData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("hero")
        .update({
          title: data.title,
          subtitle: data.subtitle,
          primary_cta_text: data.primary_cta_text,
          primary_cta_link: data.primary_cta_link,
          secondary_cta_text: data.secondary_cta_text,
          secondary_cta_link: data.secondary_cta_link,
        })
        .eq("id", data.id);

      if (error) throw error;
      toast.success("Hero section updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update hero section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Manage Hero Section</h2>
      
      <form onSubmit={handleSave}>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Headline</label>
              <Textarea 
                value={data.title}
                onChange={(e) => setData({...data, title: e.target.value})}
                className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Subheadline</label>
              <Textarea 
                value={data.subtitle}
                onChange={(e) => setData({...data, subtitle: e.target.value})}
                className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Primary CTA Text</label>
                <Input 
                  value={data.primary_cta_text}
                  onChange={(e) => setData({...data, primary_cta_text: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Primary CTA Link</label>
                <Input 
                  value={data.primary_cta_link}
                  onChange={(e) => setData({...data, primary_cta_link: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Secondary CTA Text</label>
                <Input 
                  value={data.secondary_cta_text}
                  onChange={(e) => setData({...data, secondary_cta_text: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Secondary CTA Link</label>
                <Input 
                  value={data.secondary_cta_link}
                  onChange={(e) => setData({...data, secondary_cta_link: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 px-8 h-12">
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
