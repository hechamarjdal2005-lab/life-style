"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSectionContent } from "@/hooks/useSectionContent";

interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  title_en?: string;
  title_fr?: string;
  title_ar?: string;
  description: string;
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
}

interface ProcessProps {
  data: ProcessStep[];
}

export function Process({ data }: ProcessProps) {
  const { language } = useLanguage();
  const { t } = useSectionContent("process");
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const localized = data.map((step) => ({
    ...step,
    title: step[`title_${language}` as keyof ProcessStep] || step.title,
    description: step[`description_${language}` as keyof ProcessStep] || step.description,
  }));

  return (
    <section id="process" ref={containerRef} className="py-20 md:py-32 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            {t("badge")}
          </motion.div>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight"
          >
            {t("titlePrefix")} <span className="text-blue-500">{t("titleHighlight")}</span>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          
          <motion.div 
            style={{ scaleY }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-blue-400 to-indigo-500 -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />

          <div className="space-y-16 md:space-y-32">
            {localized.map((step, i) => {
              const isEven = i % 2 === 0;
              
              return (
                <div key={step.id} className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-20">
                    <motion.div
                      initial={reduced ? false : { scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0F172A] border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-pulse" />
                    </motion.div>
                  </div>

                  <div className={cn(
                    "flex flex-col md:flex-row items-start md:items-center w-full",
                    isEven ? "md:flex-row-reverse" : ""
                  )}>
                    <div className={cn(
                      "w-full md:w-[45%] pl-12 md:pl-0 group",
                      isEven ? "md:pl-12" : "md:pr-12 md:text-right"
                    )}>
                      <motion.div
                        initial={reduced ? false : { opacity: 0, x: isEven ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]"
                      >
                        <div className={cn(
                          "text-4xl md:text-6xl font-black text-white/5 mb-4 md:mb-6 transition-colors duration-500 group-hover:text-blue-500/10 font-mono",
                          !isEven && "md:text-right"
                        )}>
                          {step.step_number}
                        </div>
                        <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-blue-400 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-xs md:text-base">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>

                    <div className="hidden md:block md:w-[45%]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
