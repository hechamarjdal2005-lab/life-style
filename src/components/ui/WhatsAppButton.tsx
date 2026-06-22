"use client";

import { motion, useReducedMotion } from "framer-motion";

export function WhatsAppButton() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href="https://wa.me/212687337434"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center"
      initial={reduced ? false : { opacity: 0, scale: 0.85, y: 12 }}
      animate={reduced ? {} : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.8 }}
      whileHover={reduced ? {} : { scale: 1.05 }}
      whileTap={reduced ? {} : { scale: 0.95 }}
    >
      <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 blur-md animate-pulse-slow" aria-hidden="true" />

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.35)] ring-1 ring-white/10 transition-all duration-300 group-hover:shadow-[0_12px_36px_rgba(37,211,102,0.45)]">
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="h-7 w-7 fill-white"
        >
          <path d="M16 3C9.4 3 4 8.4 4 15c0 2.2.6 4.3 1.7 6.2L4 29l8.1-1.7c1.8 1 3.8 1.5 5.9 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.8 1 1-4.7-.3-.5C5.3 17.4 4.8 16.2 4.8 15 4.8 10.1 9 6 16 6s11.2 4.1 11.2 9c0 4.9-4.2 9.8-11.2 9.8zm5.8-7.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4s-.7-1.6-1-2.2c-.3-.6-.6-.5-.7-.5h-.6c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 2s.8 2.4.9 2.6c.1.2 1.7 2.6 4.1 3.7.6.3 1 .4 1.4.6.6.2 1.2.2 1.6.1.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.2.2-1.3 0-.1-.2-.2-.5-.4z" />
        </svg>
      </span>

      <span className="pointer-events-none absolute right-full mr-3 rounded-full border border-white/10 bg-[#0F172A]/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
        Chat with us
      </span>
    </motion.a>
  );
}
