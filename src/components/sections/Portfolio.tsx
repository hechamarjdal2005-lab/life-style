"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, ArrowUpRight, X } from "lucide-react";
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
import { useSectionContent } from "@/hooks/useSectionContent";

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

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Portfolio({ data }: PortfolioProps) {
  const { t } = useSectionContent("portfolio");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            {t("badge")}
          </motion.div>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.08 } } }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("titlePrefix")} <br className="hidden sm:block" />
            <span className="text-blue-500">{t("titleHighlight")}</span>
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.16 } } }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {data.map((project) => {
            const coverImage =
              project.images?.find((img) => img.is_cover) ||
              project.images?.[0];

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={reduced ? {} : { y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-[2.5rem] overflow-hidden border border-white/[0.08] bg-slate-900 cursor-pointer aspect-[4/3] md:aspect-video"
              >
                <img
                  src={coverImage?.image_url || "/placeholder.jpg"}
                  alt={coverImage?.alt_text || project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap gap-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-white transition-colors duration-400 group-hover:text-blue-400">
                      {project.title}
                    </h3>

                    <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-400 delay-100">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400">
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-[95%] sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-[#0F172A] border-white/10 p-0 overflow-hidden outline-none rounded-[2rem] shadow-2xl">
          {selectedProject && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] lg:max-h-[85vh]">
              <div className="flex-1 bg-black/40 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden min-h-[300px] lg:min-h-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                <Carousel className="w-full h-full flex items-center justify-center relative z-10">
                  <CarouselContent className="h-full">
                    {selectedProject.images?.map((image) => (
                      <CarouselItem key={image.id} className="h-full flex items-center justify-center">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 max-h-full">
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-auto max-h-[50vh] lg:max-h-[70vh] object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
                  <CarouselNext className="hidden sm:flex -right-4 lg:-right-6 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
                </Carousel>
              </div>

              <div className="w-full lg:w-[400px] xl:w-[450px] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col bg-[#0F172A] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar">
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => setSelectedProject(null)}
                      aria-label="Close project details"
                      className="p-2.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 lg:hidden"
                    >
                      <X size={24} />
                    </button>
                    {selectedProject.live_link && (
                      <a
                        href={selectedProject.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-bold text-sm ml-auto"
                      >
                        {t("visitSite")} <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {selectedProject.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-white/5 text-slate-300 border-white/10 px-3 py-1 rounded-full font-medium text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-8" />

                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="p-6 bg-[#0F172A]/80 backdrop-blur-md border-t border-white/5">
                  <Button
                    className="w-full bg-white text-black hover:bg-slate-200 h-14 rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-xl"
                    onClick={() => setSelectedProject(null)}
                  >
                    {t("backToPortfolio")}
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
