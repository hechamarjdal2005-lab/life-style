"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Packages", href: "#packages" },
  { name: "Projects", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 md:p-6 pointer-events-none"
      role="banner"
    >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-label="Main navigation"
        className={cn(
          "pointer-events-auto w-full max-w-5xl transition-all duration-500",
          "bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          // Pill on md+, softly-rounded glass on mobile
          "rounded-2xl md:rounded-full",
          // Mobile: two stacked rows; desktop: single row
          "flex flex-col md:flex-row md:items-center md:justify-between",
          "px-4 py-3 md:px-6 md:py-3",
          isScrolled && "bg-slate-950/80 border-white/20 md:max-w-4xl"
        )}
      >
        {/* ── Row 1 (always visible): Logo + mobile CTA ── */}
        <div className="flex items-center justify-between md:justify-start md:flex-shrink-0">
          <Link
            href="/"
            aria-label="H&M Studio — go to top"
            className="text-base md:text-lg font-bold text-white tracking-tighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            H&M <span className="text-blue-500">STUDIO</span>
          </Link>

          {/* CTA visible only on mobile (md+ CTA is at end of row below) */}
          <Link
            href="#contact"
            aria-label="Get in touch — scroll to contact"
            className="md:hidden inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 h-8 text-xs transition-all hover:shadow-[0_0_16px_rgba(37,99,235,0.4)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Let's Talk
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Row 2 on mobile / centre+right on desktop: links + CTA ── */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/[0.06] md:mt-0 md:pt-0 md:border-0 md:flex-1 md:justify-center md:gap-6 lg:gap-8">
          {/* Nav links */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-7 flex-wrap md:flex-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-[10px] sm:text-[11px] md:text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-0.5 py-0.5"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="#contact"
            aria-label="Get in touch — scroll to contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 lg:px-6 h-9 lg:h-10 text-xs lg:text-sm transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex-shrink-0 ml-4"
          >
            Let's Talk
            <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" aria-hidden="true" />
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
