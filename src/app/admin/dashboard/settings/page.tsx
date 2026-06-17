"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Globe, Mail, MapPin, Phone } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({
    site_name: "",
    seo_title: "",
    seo_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: settings, error } = await supabase.from("site_settings").select("*").single();
      if (settings) {
        // Normalize null values to empty strings to avoid "controlled input" warnings
        const normalizedData = { ...settings };
        Object.keys(normalizedData).forEach((key) => {
          if (normalizedData[key] === null) {
            normalizedData[key] = "";
          }
        });
        setData(normalizedData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").update(data).eq("id", data.id);
      if (error) throw error;
      toast.success("Settings updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Site Settings</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} className="text-blue-500" /> SEO & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Site Name</label>
                <Input value={data.site_name} onChange={e => setData({...data, site_name: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">SEO Title</label>
                <Input value={data.seo_title} onChange={e => setData({...data, seo_title: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">SEO Description</label>
              <Input value={data.seo_description} onChange={e => setData({...data, seo_description: e.target.value})} className="bg-white/5 border-white/10" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-cyan-500" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Contact Email</label>
                <Input value={data.contact_email} onChange={e => setData({...data, contact_email: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Contact Phone</label>
                <Input value={data.contact_phone} onChange={e => setData({...data, contact_phone: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Address</label>
              <Input value={data.address} onChange={e => setData({...data, address: e.target.value})} className="bg-white/5 border-white/10" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 px-8 h-12">
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
