"use client";

import { useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesProps {
  data: Service[];
}

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

export function Services({ data }: ServicesProps) {
  const reduced = useReducedMotion();

  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 bg-blue-600/5";
      case 5:
        return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 bg-indigo-600/5";
      case 1:
      case 4:
        return "md:col-span-2 md:row-span-1";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div variants={headerVariants}>
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              Our Expertise
            </span>
          </motion.div>
          <motion.h2
            variants={headerVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Solutions that <span className="text-blue-500">Scale</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We combine strategic thinking with engineering excellence to build digital products that define categories.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min md:auto-rows-[200px]"
        >
          {data.map((service, i) => {
            const IconComponent =
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (LucideIcons as any)[service.icon] ?? LucideIcons.Code;
            const isFeatured = i === 0 || i === 5;

            return (
              <motion.div key={service.id} variants={cardVariants} className={getBentoClasses(i)}>
                <ServiceCard
                  service={service}
                  isFeatured={isFeatured}
                  IconComponent={IconComponent}
                  reduced={!!reduced}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  isFeatured,
  IconComponent,
  reduced,
}: {
  service: Service;
  isFeatured: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IconComponent: any;
  reduced: boolean;
}) {
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
          spotRef.current.style.background = `radial-gradient(500px circle at ${clientX - rect.left}px ${clientY - rect.top}px, rgba(59,130,246,0.1), transparent 40%)`;
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

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduced ? {} : { y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group relative h-full p-6 md:p-8 rounded-[2rem] border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all duration-400 flex flex-col justify-between",
        "hover:border-blue-500/35 hover:shadow-[0_0_50px_rgba(59,130,246,0.09)]",
        !isFeatured ? "bg-white/[0.02]" : ""
      )}
    >
      {/* Cursor spotlight */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {isFeatured && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
      )}

      <div className="relative z-10">
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-2xl mb-6 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3",
            isFeatured
              ? "w-16 h-16 bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              : "w-12 h-12 bg-white/[0.05] border border-white/[0.08] text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300"
          )}
        >
          <IconComponent size={isFeatured ? 32 : 24} aria-hidden="true" />
        </div>

        <h3
          className={cn(
            "font-bold text-white transition-colors duration-300 group-hover:text-blue-400",
            isFeatured ? "text-2xl md:text-3xl mb-4" : "text-xl mb-3"
          )}
        >
          {service.title}
        </h3>

        <p
          className={cn(
            "text-slate-400 leading-relaxed",
            isFeatured ? "text-lg md:text-xl line-clamp-4" : "text-sm line-clamp-3"
          )}
        >
          {service.description}
        </p>
      </div>

      <div className="relative z-10 flex justify-end mt-4">
        <div className="p-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
          <LucideIcons.ArrowUpRight size={20} aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}
