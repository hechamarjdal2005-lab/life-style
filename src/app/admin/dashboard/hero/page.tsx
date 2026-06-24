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
    title_en: "",
    title_fr: "",
    title_ar: "",
    subtitle: "",
    subtitle_en: "",
    subtitle_fr: "",
    subtitle_ar: "",
    primary_cta_text: "",
    primary_cta_text_en: "",
    primary_cta_text_fr: "",
    primary_cta_text_ar: "",
    primary_cta_link: "",
    secondary_cta_text: "",
    secondary_cta_text_en: "",
    secondary_cta_text_fr: "",
    secondary_cta_text_ar: "",
    secondary_cta_link: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: heroData, error } = await supabase.from("hero").select("*").single();
      if (heroData) {
        setData({
          id: heroData.id || "",
          title: heroData.title_en || heroData.title || "",
          title_en: heroData.title_en || heroData.title || "",
          title_fr: heroData.title_fr || "",
          title_ar: heroData.title_ar || "",
          subtitle: heroData.subtitle_en || heroData.subtitle || "",
          subtitle_en: heroData.subtitle_en || heroData.subtitle || "",
          subtitle_fr: heroData.subtitle_fr || "",
          subtitle_ar: heroData.subtitle_ar || "",
          primary_cta_text: heroData.primary_cta_text_en || heroData.primary_cta_text || "",
          primary_cta_text_en: heroData.primary_cta_text_en || heroData.primary_cta_text || "",
          primary_cta_text_fr: heroData.primary_cta_text_fr || "",
          primary_cta_text_ar: heroData.primary_cta_text_ar || "",
          primary_cta_link: heroData.primary_cta_link || "",
          secondary_cta_text: heroData.secondary_cta_text_en || heroData.secondary_cta_text || "",
          secondary_cta_text_en: heroData.secondary_cta_text_en || heroData.secondary_cta_text || "",
          secondary_cta_text_fr: heroData.secondary_cta_text_fr || "",
          secondary_cta_text_ar: heroData.secondary_cta_text_ar || "",
          secondary_cta_link: heroData.secondary_cta_link || "",
        });
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
          title: data.title_en,
          title_en: data.title_en,
          title_fr: data.title_fr,
          title_ar: data.title_ar,
          subtitle: data.subtitle_en,
          subtitle_en: data.subtitle_en,
          subtitle_fr: data.subtitle_fr,
          subtitle_ar: data.subtitle_ar,
          primary_cta_text: data.primary_cta_text_en,
          primary_cta_text_en: data.primary_cta_text_en,
          primary_cta_text_fr: data.primary_cta_text_fr,
          primary_cta_text_ar: data.primary_cta_text_ar,
          primary_cta_link: data.primary_cta_link,
          secondary_cta_text: data.secondary_cta_text_en,
          secondary_cta_text_en: data.secondary_cta_text_en,
          secondary_cta_text_fr: data.secondary_cta_text_fr,
          secondary_cta_text_ar: data.secondary_cta_text_ar,
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Textarea 
                    value={data.title_en}
                    onChange={(e) => setData({...data, title_en: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Textarea 
                    value={data.title_fr}
                    onChange={(e) => setData({...data, title_fr: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Textarea 
                    value={data.title_ar}
                    onChange={(e) => setData({...data, title_ar: e.target.value})}
                    dir="rtl"
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px] text-right"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Subheadline</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Textarea 
                    value={data.subtitle_en}
                    onChange={(e) => setData({...data, subtitle_en: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Textarea 
                    value={data.subtitle_fr}
                    onChange={(e) => setData({...data, subtitle_fr: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Textarea 
                    value={data.subtitle_ar}
                    onChange={(e) => setData({...data, subtitle_ar: e.target.value})}
                    dir="rtl"
                    className="bg-white/5 border-white/10 focus:border-blue-500 min-h-[100px] text-right"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Primary CTA Text</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Input 
                    value={data.primary_cta_text_en}
                    onChange={(e) => setData({...data, primary_cta_text_en: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Input 
                    value={data.primary_cta_text_fr}
                    onChange={(e) => setData({...data, primary_cta_text_fr: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Input 
                    value={data.primary_cta_text_ar}
                    onChange={(e) => setData({...data, primary_cta_text_ar: e.target.value})}
                    dir="rtl"
                    className="bg-white/5 border-white/10 focus:border-blue-500 text-right"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Primary CTA Link</label>
                <Input 
                  value={data.primary_cta_link}
                  onChange={(e) => setData({...data, primary_cta_link: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Secondary CTA Text</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Input 
                    value={data.secondary_cta_text_en}
                    onChange={(e) => setData({...data, secondary_cta_text_en: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Input 
                    value={data.secondary_cta_text_fr}
                    onChange={(e) => setData({...data, secondary_cta_text_fr: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Input 
                    value={data.secondary_cta_text_ar}
                    onChange={(e) => setData({...data, secondary_cta_text_ar: e.target.value})}
                    dir="rtl"
                    className="bg-white/5 border-white/10 focus:border-blue-500 text-right"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
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