"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ContentMap = Record<string, { en: string; fr: string; ar: string }>;

const cache = new Map<string, ContentMap>();

export function useSectionContent(section: string) {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache.has(section)) {
      setContent(cache.get(section)!);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase
      .from("section_content")
      .select("key, value_en, value_fr, value_ar")
      .eq("section", section)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching section content:", error);
          setLoading(false);
          return;
        }
        const map: ContentMap = {};
        for (const row of data) {
          map[row.key] = {
            en: row.value_en,
            fr: row.value_fr,
            ar: row.value_ar,
          };
        }
        cache.set(section, map);
        setContent(map);
        setLoading(false);
      });
  }, [section]);

  const t = (key: string): string => content[key]?.[language] ?? content[key]?.en ?? key;

  return { content, loading, t };
}
