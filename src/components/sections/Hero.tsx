"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#020617] text-white"
    >
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
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>
      </div>

      <div className="absolute inset-0 -z-10 bg-[#020617]/72" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.34),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.68)_42%,rgba(2,6,23,0.94)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(96,165,250,0.08),transparent_45%,rgba(14,165,233,0.04))]" />
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <div className="relative z-10 flex min-h-[100svh] items-center">
        <div className="container mx-auto px-6 py-28 sm:px-8 lg:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mx-auto flex max-w-5xl flex-col items-center text-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium tracking-[0.18em] text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span>Digital Agency • Web &amp; Mobile Experts</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="max-w-5xl text-balance text-5xl font-black tracking-[-0.05em] leading-[0.92] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.25rem]"
            >
              Transforming Ideas Into{" "}
              <span className="bg-gradient-to-r from-sky-200 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Exceptional Digital Products
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-3xl text-pretty text-base leading-8 text-slate-300/90 sm:text-lg md:text-xl lg:text-2xl"
            >
              We craft high-performance digital experiences, scalable web platforms,
              and innovative mobile applications that help ambitious brands grow,
              engage, and lead their markets.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            >
              <Link
                href="#contact"
                className="group inline-flex h-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500 px-8 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_20px_60px_rgba(14,165,233,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_24px_70px_rgba(14,165,233,0.36)] active:translate-y-0"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#portfolio"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/8 px-8 text-base font-semibold text-white shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/12 hover:text-white active:translate-y-0"
              >
                View Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020617] to-transparent" />
    </section>
  );
}
