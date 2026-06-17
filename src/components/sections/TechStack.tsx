"use client";

import { motion } from "framer-motion";

interface Tech {
  id: string;
  name: string;
  category: string;
}

interface TechStackProps {
  data: Tech[];
}

export function TechStack({ data }: TechStackProps) {
  const categories = Array.from(new Set(data.map(t => t.category)));

  return (
    <section className="py-24 bg-[#0F172A] border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-blue-500">Tech Stack</span>
          </h2 >
          <p className="text-slate-400 max-w-2xl mx-auto">
            We use the latest and most powerful technologies to build robust, scalable, and high-performance digital solutions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {data.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center group"
            >
              <div className="text-xl md:text-2xl font-bold text-slate-500 group-hover:text-blue-500 transition-colors">
                {tech.name}
              </div>
              <div className="h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-300 rounded-full mt-2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
