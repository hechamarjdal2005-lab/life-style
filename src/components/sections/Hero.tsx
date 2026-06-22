"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#020617] text-white"
    >
      {/* Video Background */}
      <div className="absolute inset-0 -z-20">
        <motion.video
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]/95" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.15] [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

      {/* Slowly drifting glow — disabled for reduced motion */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute -z-10 top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none"
          animate={{ x: [0, 40, -30, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 w-full">
          <motion.div
            variants={containerVariants}
            initial={reduced ? false : "hidden"}
            animate="show"
            className="flex max-w-4xl flex-col items-start text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-400 backdrop-blur-md shadow-xl"
            >
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>Digital Innovation Studio</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={containerVariants}
              className="max-w-5xl text-balance text-3xl font-black uppercase tracking-[-0.04em] leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl"
            >
              <motion.span variants={wordVariants} className="block">
                Transforming Ideas
              </motion.span>
              <motion.span variants={wordVariants} className="block">
                Into
              </motion.span>
              <motion.span variants={wordVariants} className="block">
                <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-sky-400 bg-clip-text text-transparent">
                  Exceptional Digital Products
                </span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 md:mt-8 max-w-xl text-pretty text-base md:text-lg leading-relaxed text-slate-300/80"
            >
              We craft high-performance digital experiences and scalable platforms
              that help ambitious brands grow, engage, and lead their markets.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 md:mt-10 flex w-full flex-col items-start gap-4 sm:flex-row"
            >
              <Link
                href="#contact"
                className="group relative inline-flex h-12 md:h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 md:px-10 text-sm md:text-base font-bold text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] active:scale-95"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <Link
                href="#portfolio"
                className="inline-flex h-12 md:h-14 w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 md:px-10 text-sm md:text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                View Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
    </section>
  );
}
