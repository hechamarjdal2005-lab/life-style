"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href="https://wa.me/212687337434"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={[
        // Mobile-only: hidden on md+
        "md:hidden",
        "fixed right-5 z-[60]",
        // Size & shape — 56px = good thumb target
        "flex items-center justify-center w-14 h-14 rounded-full",
        // WhatsApp green
        "bg-[#25D366] text-white",
        // Shadow with green glow
        "shadow-[0_4px_24px_rgba(37,211,102,0.45)]",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]",
        "active:scale-95 transition-transform",
      ].join(" ")}
      // Safe-area-aware bottom offset
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 320, damping: 22 }}
      whileTap={reduced ? {} : { scale: 0.9 }}
    >
      <MessageCircle size={26} strokeWidth={2} aria-hidden="true" />
    </motion.a>
  );
}
