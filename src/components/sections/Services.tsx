"use client";

import { motion } from "framer-motion";
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

export function Services({ data }: ServicesProps) {
  // Helper to determine Bento Grid spans based on index
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0: // Main Featured (e.g. Web Dev)
        return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 bg-blue-600/5";
      case 5: // Secondary Featured (e.g. AI)
        return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 bg-indigo-600/5";
      case 1: // Wide
      case 4: // Wide
        return "md:col-span-2 md:row-span-1";
      default: // Square
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <section id="services" className="py-32 bg-[#0F172A] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            Our Expertise
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          >
            Solutions that <span className="text-blue-500">Scale</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We combine strategic thinking with engineering excellence to build digital products that define categories.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min md:auto-rows-[200px]">
          {data.map((service, i) => {
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Code;
            const bentoClass = getBentoClasses(i);
            const isFeatured = i === 0 || i === 5;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "group relative p-6 md:p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col justify-between",
                  bentoClass,
                  !isFeatured ? "bg-white/[0.02]" : ""
                )}
              >
                {/* Background Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Featured Pattern Overlay */}
                {isFeatured && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />
                )}

                <div className="relative z-10">
                  <div className={cn(
                    "inline-flex items-center justify-center rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    isFeatured 
                      ? "w-16 h-16 bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]" 
                      : "w-12 h-12 bg-white/5 border border-white/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300"
                  )}>
                    <IconComponent size={isFeatured ? 32 : 24} />
                  </div>
                  
                  <h3 className={cn(
                    "font-bold text-white transition-colors group-hover:text-blue-400",
                    isFeatured ? "text-2xl md:text-3xl mb-4" : "text-xl mb-3"
                  )}>
                    {service.title}
                  </h3>
                  
                  <p className={cn(
                    "text-slate-400 leading-relaxed",
                    isFeatured ? "text-lg md:text-xl line-clamp-4" : "text-sm line-clamp-3"
                  )}>
                    {service.description}
                  </p>
                </div>

                {/* Bottom Decorative Arrow */}
                <div className="relative z-10 flex justify-end mt-4">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <LucideIcons.ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
