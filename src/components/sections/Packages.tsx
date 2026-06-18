"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Gift, Code2, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap, type Package } from "@/lib/packages";
import { createClient } from "@/lib/supabase/client";

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
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div variants={headerVariants}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              Our Packages
            </span>
          </motion.div>
          <motion.h2
            variants={headerVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Packages built to{" "}
            <span className="text-blue-500">scale</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Every offering is crafted to deliver measurable results — pick the
            one that fits your vision and budget.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-400 animate-pulse">Loading amazing packages...</p>
          </div>
        ) : (
          <motion.div
            variants={sectionVariants}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        )}
      </div>
    </section>
  );
}

function PackCard({ pack, reduced }: { pack: Package; reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

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
    `Hello H&M Studio, I'm interested in the ${pack.title} package (${pack.price}).`
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
        "bg-white/[0.03] border-white/[0.06]",
        "hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]",
        pack.is_popular &&
          "border-blue-500/40 shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_0_40px_rgba(59,130,246,0.10)]"
      )}
    >
      {/* Cursor spotlight */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      />

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Most Popular badge */}
      {pack.is_popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            Most Popular
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-7">
        {/* Icon */}
        <div
          className={cn(
            "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110",
            pack.is_popular
              ? "bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-[0_0_24px_rgba(59,130,246,0.4)]"
              : "bg-white/[0.06] border border-white/[0.08] text-blue-400"
          )}
        >
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </div>

        {/* Title & tagline */}
        <h3 className="text-xl font-bold text-white mb-1 tracking-tight group-hover:text-blue-300 transition-colors duration-300">
          {pack.title}
        </h3>
        {pack.tagline && (
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            {pack.tagline}
          </p>
        )}

        {/* Price */}
        <p className="text-2xl font-black text-blue-400 mb-5 tracking-tight">
          {pack.price}
        </p>

        {/* Features */}
        <ul
          className="space-y-2.5 mb-5"
          aria-label={`${pack.title} features`}
        >
          {pack.features.map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-2.5 text-sm text-slate-300"
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

        {/* Freebies block */}
        {pack.freebies && pack.freebies.length > 0 && (
          <div className="flex-1 mb-5">
            <div className="border-t border-white/[0.06] pt-4 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Included for Free
              </p>
            </div>
            <div
              className="rounded-xl bg-blue-500/[0.04] border border-blue-400/10 p-3 space-y-2.5"
              aria-label={`${pack.title} free bonuses`}
            >
              {pack.freebies.map((freebie) => (
                <div key={freebie} className="flex items-center gap-2.5">
                  <Gift
                    size={13}
                    className="text-emerald-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-slate-300 flex-1 leading-snug">
                    {freebie}
                  </span>
                  <span className="flex-shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                    FREE
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="border-t border-white/[0.06] pt-5 mt-auto">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${pack.title} via WhatsApp`}
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
            Order via WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
