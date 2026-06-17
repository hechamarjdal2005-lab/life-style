"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Loader2, 
  Image as ImageIcon, 
  Upload,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechItem {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminTechStack() {
  const [loading, setLoading] = useState(true);
  const [techStack, setTechStack] = useState<TechItem[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<TechItem> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const fetchTechStack = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tech_stack")
        .select("*")
        .order("display_order");
      if (error) throw error;
      setTechStack(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTechStack();
  }, [fetchTechStack]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const techData = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      logo_url: editingTech?.logo_url || "",
      is_active: editingTech?.is_active ?? true,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    if (!techData.logo_url) {
      toast.error("Please upload a logo");
      return;
    }

    try {
      if (editingTech?.id) {
        const { error } = await supabase.from("tech_stack").update(techData).eq("id", editingTech.id);
        if (error) throw error;
        toast.success("Technology updated successfully");
      } else {
        const { error } = await supabase.from("tech_stack").insert([techData]);
        if (error) throw error;
        toast.success("Technology added successfully");
      }
      setIsEditOpen(false);
      fetchTechStack();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'uploads', 'tech-stack');
      setEditingTech(prev => ({ ...prev, logo_url: url }));
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteTech = async (id: string) => {
    if (!confirm("Are you sure you want to remove this technology?")) return;
    try {
      const { error } = await supabase.from("tech_stack").delete().eq("id", id);
      if (error) throw error;
      toast.success("Technology removed");
      fetchTechStack();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tech_stack")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchTechStack();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-slate-400 animate-pulse">Loading tech stack...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Tech Stack Management</h2>
          <p className="text-slate-400 mt-1">Manage the technologies displayed on your public site.</p>
        </div>
        <Button 
          onClick={() => { setEditingTech({ is_active: true, display_order: 0, category: 'web' }); setIsEditOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} className="mr-2" /> Add Technology
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-24 pl-6">Logo</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-right text-slate-400 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techStack.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No technologies found. Click "Add Technology" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  techStack.map((tech) => (
                    <TableRow key={tech.id} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                      <TableCell className="pl-6">
                        <div className="w-12 h-12 rounded-lg bg-white/5 p-2 flex items-center justify-center border border-white/10">
                          <img src={tech.logo_url} alt={tech.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-white">{tech.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-blue-500/20 text-blue-400 bg-blue-500/5">
                          {tech.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">{tech.display_order}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => toggleStatus(tech.id, tech.is_active)}
                          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                          {tech.is_active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              <CheckCircle2 size={12} className="mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                              <XCircle size={12} className="mr-1" /> Inactive
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => { setEditingTech(tech); setIsEditOpen(true); }} 
                            className="hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => deleteTech(tech.id)} 
                            className="hover:bg-red-500/20 text-red-400 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingTech?.id ? "Edit Technology" : "Add New Technology"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Technology Name</Label>
                  <Input 
                    name="name" 
                    defaultValue={editingTech?.name} 
                    required 
                    placeholder="e.g. Next.js"
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Category</Label>
                  <Input 
                    name="category" 
                    defaultValue={editingTech?.category || 'web'} 
                    required 
                    placeholder="e.g. Frontend, Backend, Mobile"
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Display Order</Label>
                  <Input 
                    type="number" 
                    name="display_order" 
                    defaultValue={editingTech?.display_order || 0} 
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Technology Logo</Label>
                <div className="relative group rounded-xl border-2 border-dashed border-white/10 p-6 hover:border-blue-500/50 transition-colors bg-white/[0.02] flex flex-col items-center gap-4">
                  {editingTech?.logo_url ? (
                    <div className="relative w-20 h-20 bg-white/5 rounded-lg p-3 flex items-center justify-center border border-white/10">
                      <img src={editingTech.logo_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">
                      {isUploading ? "Uploading..." : "Click to upload logo"}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">SVG, PNG, JPG up to 2MB</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <Label className="text-white">Active Status</Label>
                  <p className="text-xs text-slate-500">Enable to show on the public website.</p>
                </div>
                <Switch 
                  checked={editingTech?.is_active ?? true}
                  onCheckedChange={(checked) => setEditingTech(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-white/5 gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  editingTech?.id ? "Update Tech" : "Add Tech"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
