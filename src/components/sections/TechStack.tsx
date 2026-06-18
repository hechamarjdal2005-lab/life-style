"use client";

import { motion } from "framer-motion";

interface TechItem {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  is_active: boolean;
}

interface TechStackProps {
  data: TechItem[];
}

export function TechStack({ data }: TechStackProps) {
  // Filter only active technologies and ensure uniqueness by name
  const activeTech = Array.from(
    new Map(data.filter(tech => tech.is_active).map(item => [item.name, item])).values()
  );

  if (activeTech.length === 0) return null;

  // Duplicate items twice (3 sets total) to ensure there's enough content to scroll seamlessly
  // even on very wide screens. The animation moves -50% of the total width.
  const displayItems = [...activeTech, ...activeTech];

  return (
    <section id="tech-stack" className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Our <span className="text-blue-500">Tech Stack</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Technologies we use to build premium digital experiences.
          </motion.p>
        </div>

        {/* Infinite Marquee Container */}
        <div className="relative mt-20 w-full overflow-hidden">
          {/* Gradient Masks for Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#0F172A] via-[#0F172A]/80 to-transparent z-20 pointer-events-none" />

          {/* Scrolling Row */}
          <div className="flex w-max animate-marquee whitespace-nowrap gap-12 md:gap-16 py-4 hover:[animation-play-state:paused]">
            {displayItems.map((item, idx) => (
              <TechCard key={`${item.id}-${idx}`} tech={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="inline-flex items-center justify-center w-56 md:w-64 h-32 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 transition-all duration-500 hover:bg-white/[0.08] hover:border-blue-500/40 hover:scale-105 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 flex items-center justify-center filter group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">
          <img 
            src={tech.logo_url} 
            alt={tech.name} 
            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100 scale-110" 
          />
        </div>
        <span className="text-white/40 text-xl font-bold tracking-tight group-hover:text-white transition-colors">
          {tech.name}
        </span>
      </div>
    </div>
  );
}
