"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
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
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]/95" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="mb-8 md:mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-blue-400 backdrop-blur-md shadow-xl"
            >
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span>Digital Innovation Studio</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-balance text-4xl font-black tracking-tight leading-[1.15] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem]"
            >
              Transforming Ideas Into{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                  Exceptional Digital Products
                </span>
                <span className="absolute -bottom-1 md:-bottom-2 left-0 h-1 md:h-1.5 w-1/3 rounded-full bg-blue-600/30 blur-sm" />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-8 md:mt-10 max-w-2xl text-pretty text-sm md:text-base lg:text-lg leading-relaxed text-slate-300/80"
            >
              We craft high-performance digital experiences and scalable platforms 
              that help ambitious brands grow, engage, and lead their markets.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 md:mt-14 flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="#contact"
                className="group relative inline-flex h-14 md:h-16 w-full items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 md:px-10 text-base md:text-lg font-bold text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] active:scale-95 sm:w-auto"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#portfolio"
                className="inline-flex h-14 md:h-16 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 md:px-10 text-base md:text-lg font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 sm:w-auto"
              >
                View Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
    </section>
  );
}
