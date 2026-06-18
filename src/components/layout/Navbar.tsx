"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-500",
          "bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isScrolled ? "py-2 md:py-2.5 max-w-4xl bg-slate-950/80 border-white/20 shadow-blue-500/5" : ""
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-base md:text-lg font-bold text-white tracking-tighter">
            H&M <span className="text-blue-500">STUDIO</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            className="hidden sm:flex rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
          >
            Let's Talk <ArrowRight className="ml-2 w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>

          {/* Mobile Toggle */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10 rounded-full w-9 h-9"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-slate-950/95 border-l-white/10 backdrop-blur-2xl text-white w-[85vw] sm:max-w-sm">
              <SheetHeader className="text-left px-4">
                <SheetTitle className="text-2xl font-bold text-white tracking-tighter">
                  H&M<span className="text-blue-500">STUDIO</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-12 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-2xl font-semibold text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button className="mt-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-lg">
                  Let's Talk
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </header>
  );
}
