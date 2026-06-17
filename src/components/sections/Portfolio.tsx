"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight, Expand, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_cover: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_link: string;
  images: ProjectImage[];
}

interface PortfolioProps {
  data: Project[];
}

export function Portfolio({ data }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Helper to determine masonry grid spans based on index
  const getMasonryClasses = (index: number) => {
    const pattern = [
      "md:col-span-4 md:row-span-2", // Large Featured
      "md:col-span-2 md:row-span-1", // Small
      "md:col-span-2 md:row-span-2", // Tall
      "md:col-span-4 md:row-span-1", // Wide
      "md:col-span-3 md:row-span-1", // Balanced
      "md:col-span-3 md:row-span-1", // Balanced
    ];
    return pattern[index % pattern.length];
  };

  return (
    <section id="portfolio" className="py-32 bg-[#0F172A] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            Our Portfolio
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          >
            Digital products that <br />
            <span className="text-blue-500">define industries.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed"
          >
            A curated selection of our latest work, blending cutting-edge technology with world-class design.
          </motion.p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-min md:auto-rows-[300px]">
          {data.map((project, i) => {
            const coverImage = project.images?.find(img => img.is_cover) || project.images?.[0];
            const masonryClass = getMasonryClasses(i);
            const isLarge = i % 6 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-900 cursor-pointer min-h-[350px] md:min-h-0",
                  masonryClass
                )}
              >
                {/* Image */}
                <img
                  src={coverImage?.image_url || "/placeholder.jpg"}
                  alt={coverImage?.alt_text || project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} className="bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className={cn(
                      "font-bold text-white transition-all duration-500 group-hover:text-blue-400",
                      isLarge ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                    )}>
                      {project.title}
                    </h3>
                    
                    <p className={cn(
                      "text-slate-300 line-clamp-2 transition-all duration-500 delay-150 opacity-0 group-hover:opacity-100",
                      isLarge ? "text-lg md:text-xl max-w-xl" : "text-sm md:text-base max-w-md"
                    )}>
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Decorative Arrow */}
                <div className="absolute top-8 right-8 md:top-12 md:right-12 p-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                  <ArrowUpRight size={24} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-7xl bg-[#0F172A] border-white/10 p-0 overflow-hidden outline-none">
          {selectedProject && (
            <div className="flex flex-col lg:flex-row min-h-[90vh] lg:h-[85vh]">
              {/* Left: Gallery */}
              <div className="flex-1 bg-black/40 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Modal Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
                
                <Carousel className="w-full max-w-5xl relative z-10">
                  <CarouselContent>
                    {selectedProject.images?.map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="aspect-[16/10] relative rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5">
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
                  <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
                </Carousel>
              </div>

              {/* Right: Info */}
              <div className="w-full lg:w-[450px] border-l border-white/10 p-12 flex flex-col justify-between bg-[#0F172A] relative">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                    <div className="flex gap-2">
                      {selectedProject.live_link && (
                        <a 
                          href={selectedProject.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter leading-tight">
                    {selectedProject.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {selectedProject.tags.map(tag => (
                      <Badge key={tag} className="bg-white/5 text-slate-300 border-white/10 px-4 py-1.5 rounded-full font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-10" />
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-white text-black hover:bg-slate-200 h-16 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
                    onClick={() => setSelectedProject(null)}
                  >
                    Back to Portfolio
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
