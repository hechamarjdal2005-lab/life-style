"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSectionContent } from "@/hooks/useSectionContent";

interface Founder {
  id: string;
  name: string;
  name_en?: string;
  name_fr?: string;
  name_ar?: string;
  role: string;
  role_en?: string;
  role_fr?: string;
  role_ar?: string;
  bio: string;
  bio_en?: string;
  bio_fr?: string;
  bio_ar?: string;
  photo_url: string | null;
  cv_url: string | null;
  display_order: number;
}

interface AboutProps {
  founders: Founder[];
}

export function About({ founders }: AboutProps) {
  const { language } = useLanguage();
  const { t } = useSectionContent("about");
  const reduced = useReducedMotion();

  const displayFounders = [...founders].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#0F172A] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6"
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{t("badge")}</span>
          </motion.div>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="text-3xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("title")} <span className="text-blue-500">{t("titleHighlight")}</span>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {displayFounders.map((founder, index) => (
            <FounderCard key={founder.id} founder={founder} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderCard({ founder, index }: { founder?: Founder; index: number }) {
  const { language } = useLanguage();
  const { t } = useSectionContent("about");
  const reduced = useReducedMotion();
  if (!founder) return null;

  const name = (founder as any)[`name_${language}`] || founder.name;
  const role = (founder as any)[`role_${language}`] || founder.role;
  const bio = (founder as any)[`bio_${language}`] || founder.bio;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {founder.photo_url ? (
            <img
              src={founder.photo_url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/10">
                {name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            {role}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-4">
            {bio}
          </p>
          
          {founder.cv_url && (
            <a
              href={founder.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm md:text-base font-semibold transition-all duration-300 hover:bg-blue-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              {t("downloadCv")}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
