"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Gift, Code2, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap, type Package } from "@/lib/packages";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSectionContent } from "@/hooks/useSectionContent";

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Packages() {
  const { language } = useLanguage();
  const { t } = useSectionContent("packages");
  const reduced = useReducedMotion();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .order("order_index");
        
        if (error) throw error;
        if (data) setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [supabase]);

  return (
    <section
      id="packages"
      className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden"
    >
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div variants={headerVariants}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              {t("badge")}
            </span>
          </motion.div>
          <motion.h2
            variants={headerVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("titlePrefix")}{" "}
            <span className="text-blue-500">{t("titleHighlight")}</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-400 animate-pulse">{t("loading")}</p>
          </div>
        ) : (
          <>
            <div className="md:hidden relative w-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F172A] to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none z-10" />

              <div className="flex w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4">
                {packages.map((pack) => (
                  <div
                    key={pack.id}
                    className="mx-4 w-[85vw] min-w-[320px] max-w-[380px] shrink-0 snap-center"
                  >
                    <PackCard pack={pack} reduced={!!reduced} mobile />
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              variants={sectionVariants}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {packages.map((pack, i) => (
                <motion.div
                  key={pack.id}
                  variants={cardVariants}
                className={cn(
                  packages.length % 3 === 1 &&
                    i === packages.length - 1 &&
                    "lg:col-start-2"
                )}
              >
                <PackCard pack={pack} reduced={!!reduced} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function PackCard({
  pack,
  reduced,
  mobile,
}: {
  pack: Package;
  reduced: boolean;
  mobile?: boolean;
}) {
  const { language } = useLanguage();
  const { t } = useSectionContent("packages");
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  const packTitle = (pack as any)[`title_${language}`] || pack.title;
  const packTagline = (pack as any)[`tagline_${language}`] || pack.tagline;
  const features = (pack as any)[`features_${language}`] || pack.features || [];
  const freebies = (pack as any)[`freebies_${language}`] || pack.freebies || [];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const { clientX, clientY } = e;
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        if (spotRef.current && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          spotRef.current.style.background = `radial-gradient(500px circle at ${clientX - rect.left}px ${clientY - rect.top}px, rgba(59,130,246,0.10), transparent 40%)`;
        }
        ticking.current = false;
      });
    },
    [reduced]
  );

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) {
      spotRef.current.style.background = "transparent";
    }
  }, []);

  const Icon = pack.icon_name ? (iconMap[pack.icon_name] || Globe) : Globe;

  const whatsappHref = `https://wa.me/212687337434?text=${encodeURIComponent(
    `Hello H&M Studio, I'm interested in the ${packTitle} package (${pack.price}).`
  )}`;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduced ? {} : { y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300",
        mobile ? "min-h-[34rem] md:h-full p-0" : "",
        "bg-white/[0.03] border-white/[0.06]",
        "hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]",
        pack.is_popular &&
          "border-blue-500/40 shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_0_40px_rgba(59,130,246,0.10)]"
      )}
    >
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {pack.is_popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            {t("mostPopular")}
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-5 pb-8 md:p-7">
        <div
          className={cn(
            "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110",
            mobile ? "mb-4 w-11 h-11" : "",
            pack.is_popular
              ? "bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-[0_0_24px_rgba(59,130,246,0.4)]"
              : "bg-white/[0.06] border border-white/[0.08] text-blue-400"
          )}
        >
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </div>

        <h3 className={cn(
          "text-xl font-bold text-white mb-1 tracking-tight group-hover:text-blue-300 transition-colors duration-300",
          mobile ? "min-h-[3.5rem]" : ""
        )}>
          {packTitle}
        </h3>
        {packTagline && (
          <p className={cn(
            "text-slate-400 text-sm md:text-sm mb-4 leading-relaxed",
            mobile ? "text-[15px] line-clamp-2" : ""
          )}>
            {packTagline}
          </p>
        )}

        <p className="text-2xl font-black text-blue-400 mb-5 tracking-tight">
          {pack.price}
        </p>

        <ul
          className={cn(
            "space-y-2.5 mb-5",
            mobile ? "space-y-3" : ""
          )}
          aria-label={`${packTitle} features`}
        >
          {features.map((feat: string) => (
            <li
              key={feat}
              className={cn(
                "flex items-start gap-2.5 text-slate-300",
                mobile ? "gap-3 text-[15px]" : "text-sm"
              )}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/25"
              >
                <Check size={9} className="text-blue-400 stroke-[3]" />
              </span>
              {feat}
            </li>
          ))}
        </ul>

        {freebies.length > 0 && (
          <div className={cn("flex-1 mb-5", mobile ? "min-h-0" : "")}>
            <div className="border-t border-white/[0.06] pt-4 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                {t("includedForFree")}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl bg-blue-500/[0.04] border border-blue-400/10 p-3 space-y-2.5",
                mobile ? "space-y-3 p-4" : ""
              )}
              aria-label={`${packTitle} free bonuses`}
            >
              {freebies.map((freebie: string) => (
                <div key={freebie} className={cn("flex items-center gap-2.5", mobile ? "gap-3" : "")}>
                  <Gift
                    size={13}
                    className="text-emerald-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className={cn("text-sm text-slate-300 flex-1 leading-snug", mobile ? "text-[15px]" : "")}>
                    {freebie}
                  </span>
                  <span className="flex-shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                    {t("free")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-5 mt-6 md:mt-auto">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${packTitle} via WhatsApp`}
            className={cn(
              "group/link inline-flex items-center gap-2.5 w-full px-4 py-3 rounded-xl",
              "border border-white/[0.08] bg-white/[0.03] text-slate-300 text-sm font-medium",
              "transition-all duration-300",
              "hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            )}
          >
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] group-hover/link:border-blue-500/40 group-hover/link:bg-blue-500/15 transition-all duration-300">
              <Code2
                size={14}
                className="text-blue-400"
                aria-hidden="true"
              />
            </span>
            {t("orderViaWhatsApp")}
          </a>
        </div>
      </div>
    </motion.div>
  );
}