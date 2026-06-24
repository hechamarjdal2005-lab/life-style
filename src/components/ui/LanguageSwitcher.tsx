"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-white/5 rounded-full border border-white/10 p-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-200",
            language === lang.code
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
