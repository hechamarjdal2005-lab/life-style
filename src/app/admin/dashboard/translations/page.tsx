"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SECTIONS = [
  "navbar",
  "hero",
  "about",
  "services",
  "techstack",
  "packages",
  "portfolio",
  "process",
  "contact",
  "footer",
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
];

export default function AdminTranslations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [entries, setEntries] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("section_content")
        .select("*")
        .eq("section", activeSection)
        .order("key");
      if (error) throw error;
      setEntries(data || []);

      const fd: Record<string, Record<string, string>> = {};
      for (const row of data || []) {
        fd[row.key] = {
          en: row.value_en || "",
          fr: row.value_fr || "",
          ar: row.value_ar || "",
        };
      }
      setFormData(fd);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [activeSection, supabase]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(formData).map(([key, values]) => ({
        section: activeSection,
        key,
        value_en: values.en,
        value_fr: values.fr,
        value_ar: values.ar,
      }));

      for (const update of updates) {
        const existing = entries.find((e) => e.key === update.key);
        if (existing) {
          await supabase
            .from("section_content")
            .update({
              value_en: update.value_en,
              value_fr: update.value_fr,
              value_ar: update.value_ar,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("section_content").insert([update]);
        }
      }

      toast.success("Translations saved successfully!");
      fetchEntries();
    } catch (error: any) {
      toast.error(error.message || "Failed to save translations");
    } finally {
      setSaving(false);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            Translations
          </h2>
          <p className="text-slate-400 mt-1">
            Edit all visible text in English, French, and Arabic.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 px-8 h-12 shadow-lg shadow-blue-500/20"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeSection === section
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-xl capitalize">{activeSection} Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {entries.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No translatable keys found for this section.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.key}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono text-blue-400 font-bold uppercase tracking-wider">
                    {entry.key}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.code} className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {lang.label}
                      </label>
                      {entry.key.toLowerCase().includes("description") ||
                      entry.key.toLowerCase().includes("subtitle") ||
                      entry.key.toLowerCase().includes("successmessage") ||
                      entry.key.toLowerCase().includes("message") ||
                      entry.key.toLowerCase().includes("placeholder") ||
                      entry.key.toLowerCase().includes("details") ? (
                        <Textarea
                          value={formData[entry.key]?.[lang.code] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [entry.key]: {
                                ...prev[entry.key],
                                [lang.code]: e.target.value,
                              },
                            }))
                          }
                          className="bg-slate-900/50 border-white/10 focus:border-blue-500 min-h-[80px] text-sm"
                          dir={lang.code === "ar" ? "rtl" : "ltr"}
                        />
                      ) : (
                        <Input
                          value={formData[entry.key]?.[lang.code] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [entry.key]: {
                                ...prev[entry.key],
                                [lang.code]: e.target.value,
                              },
                            }))
                          }
                          className="bg-slate-900/50 border-white/10 focus:border-blue-500 text-sm"
                          dir={lang.code === "ar" ? "rtl" : "ltr"}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
