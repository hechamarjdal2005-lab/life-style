"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, Expand, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  return (
    <section id="portfolio" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Selected <span className="text-blue-500">Works</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-xl"
            >
              Explore our latest projects where we've helped businesses transform their vision into high-impact digital reality.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {data.map((project, i) => {
            const coverImage = project.images?.find(img => img.is_cover) || project.images?.[0];
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 mb-8 cursor-pointer"
                     onClick={() => setSelectedProject(project)}>
                  <img
                    src={coverImage?.image_url || "/placeholder.jpg"}
                    alt={coverImage?.alt_text || project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                      <Expand className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2">
                  <div className="flex gap-2 mb-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-blue-600/10 text-blue-400 border-none font-medium px-4 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-lg mb-6 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex gap-6">
                    <Button 
                      variant="link" 
                      className="text-white hover:text-blue-500 p-0 h-auto font-semibold flex items-center gap-2 group/btn"
                      onClick={() => setSelectedProject(project)}
                    >
                      View Details <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    {project.live_link && (
                      <a 
                        href={project.live_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl bg-[#0F172A]/95 border-white/10 backdrop-blur-xl p-0 overflow-hidden outline-none">
          {selectedProject && (
            <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[80vh]">
              {/* Left: Gallery */}
              <div className="flex-1 bg-black/20 flex items-center justify-center p-4 relative group">
                <Carousel className="w-full max-w-4xl">
                  <CarouselContent>
                    {selectedProject.images?.map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="aspect-[16/10] relative rounded-xl overflow-hidden shadow-2xl">
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-white/5 border-white/10 text-white hover:bg-white/20" />
                  <CarouselNext className="right-4 bg-white/5 border-white/10 text-white hover:bg-white/20" />
                </Carousel>
              </div>

              {/* Right: Info */}
              <div className="w-full lg:w-[400px] border-l border-white/10 p-10 flex flex-col justify-between bg-[#0F172A]">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                    {selectedProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 text-slate-300 border-white/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedProject.live_link && (
                    <a
                      href={selectedProject.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 px-6 text-lg font-bold text-white transition-colors hover:bg-blue-700"
                    >
                      Visit Live Platform <ExternalLink size={20} className="ml-2" />
                    </a>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 text-white hover:bg-white/5 h-14 rounded-2xl font-bold text-lg"
                    onClick={() => setSelectedProject(null)}
                  >
                    Close Project
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
