"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProjects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .order("display_order");
    
    if (data) setProjects(data);
    setLoading(false);
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const projectData = {
      title: formData.get("title_en"),
      title_en: formData.get("title_en"),
      title_fr: formData.get("title_fr"),
      title_ar: formData.get("title_ar"),
      slug: formData.get("slug"),
      description: formData.get("description_en"),
      description_en: formData.get("description_en"),
      description_fr: formData.get("description_fr"),
      description_ar: formData.get("description_ar"),
      live_link: formData.get("live_link"),
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()),
    };

    try {
      if (editingProject?.id) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);
        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);
        if (error) throw error;
        toast.success("Project created");
      }
      setIsEditOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure? This will delete the project and all its images.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  // Gallery Management
  const openGallery = async (project: any) => {
    setEditingProject(project);
    setGalleryImages(project.images || []);
    setIsGalleryOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${editingProject.slug}-${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const { data: newImage, error: dbError } = await supabase
        .from('project_images')
        .insert([{
          project_id: editingProject.id,
          image_url: publicUrl,
          alt_text: editingProject.title,
          display_order: galleryImages.length + 1
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setGalleryImages([...galleryImages, newImage]);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    const { error } = await supabase.from("project_images").delete().eq("id", imageId);
    if (!error) {
      setGalleryImages(galleryImages.filter(img => img.id !== imageId));
      toast.success("Image removed");
    }
  };

  const setAsCover = async (imageId: string) => {
    try {
      await supabase
        .from("project_images")
        .update({ is_cover: false })
        .eq("project_id", editingProject.id);
      
      await supabase
        .from("project_images")
        .update({ is_cover: true })
        .eq("id", imageId);
      
      setGalleryImages(galleryImages.map(img => ({
        ...img,
        is_cover: img.id === imageId
      })));
      toast.success("Cover image updated");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Projects Portfolio</h2>
        <Button onClick={() => { setEditingProject(null); setIsEditOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> New Project
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Project</TableHead>
                <TableHead className="text-slate-400">Slug</TableHead>
                <TableHead className="text-slate-400">Tags</TableHead>
                <TableHead className="text-slate-400">Images</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="border-white/10">
                  <TableCell className="font-bold">{project.title_en || project.title}</TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs">{project.slug}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {project.tags?.slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">{t}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openGallery(project)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                      <ImageIcon size={16} className="mr-2" /> {project.images?.length || 0}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingProject(project); setIsEditOpen(true); }} className="hover:bg-white/10">
                      <Pencil size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteProject(project.id)} className="hover:bg-red-500/20 text-red-500">
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProject} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Title</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Input name="title_en" defaultValue={editingProject?.title_en || editingProject?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Input name="title_fr" defaultValue={editingProject?.title_fr || ""} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Input name="title_ar" defaultValue={editingProject?.title_ar || ""} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Slug</label>
                <Input name="slug" defaultValue={editingProject?.slug} required className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Description</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Textarea name="description_en" defaultValue={editingProject?.description_en || editingProject?.description} required className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Textarea name="description_fr" defaultValue={editingProject?.description_fr || ""} className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Textarea name="description_ar" defaultValue={editingProject?.description_ar || ""} dir="rtl" className="bg-white/5 border-white/10 min-h-[100px] text-right" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Tags (comma separated)</label>
              <Input name="tags" defaultValue={editingProject?.tags?.join(", ")} placeholder="Next.js, UI/UX, SaaS" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Live Link</label>
              <Input name="live_link" defaultValue={editingProject?.live_link} placeholder="https://..." className="bg-white/5 border-white/10" />
            </div>
            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Gallery: {editingProject?.title_en || editingProject?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 pt-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {uploading ? (
                <Loader2 className="animate-spin mx-auto mb-2" />
              ) : (
                <ImageIcon className="mx-auto mb-2 text-slate-500" />
              )}
              <p className="text-sm text-slate-400">
                {uploading ? "Uploading..." : "Click or drag to upload new project image"}
              </p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden group border border-white/5">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant={img.is_cover ? "default" : "secondary"} 
                      className={img.is_cover ? "bg-blue-600" : "bg-white/20"}
                      onClick={() => setAsCover(img.id)}
                    >
                      {img.is_cover ? "Cover" : "Set Cover"}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8"
                      onClick={() => deleteImage(img.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  {img.is_cover && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Cover</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}