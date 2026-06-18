"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  FileText, 
  Upload,
  ExternalLink,
  Save,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
  cv_url: string | null;
  display_order: number;
}

interface Vision {
  id: string;
  title: string;
  content: string;
}

export default function AdminFounders() {
  const [loading, setLoading] = useState(true);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [vision, setVision] = useState<Vision | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Partial<Founder> | null>(null);
  const [isUploading, setIsUploading] = useState<{ image: boolean; pdf: boolean }>({ image: false, pdf: false });
  const [isSavingVision, setIsSavingVision] = useState(false);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [foundersRes, visionRes] = await Promise.all([
        supabase.from("founders").select("*").order("display_order"),
        supabase.from("founders_vision").select("*").single()
      ]);

      if (foundersRes.error) throw foundersRes.error;
      setFounders(foundersRes.data || []);
      
      if (visionRes.data) {
        setVision(visionRes.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveFounder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const founderData = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      photo_url: editingFounder?.photo_url || null,
      cv_url: editingFounder?.cv_url || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingFounder?.id) {
        const { error } = await supabase.from("founders").update(founderData).eq("id", editingFounder.id);
        if (error) throw error;
        toast.success("Founder updated successfully");
      } else {
        const { error } = await supabase.from("founders").insert([founderData]);
        if (error) throw error;
        toast.success("Founder added successfully");
      }
      setIsEditOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveVision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingVision(true);
    const formData = new FormData(e.currentTarget);
    
    const visionData = {
      title: formData.get("vision_title") as string,
      content: formData.get("vision_content") as string,
    };

    try {
      if (vision?.id) {
        const { error } = await supabase.from("founders_vision").update(visionData).eq("id", vision.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("founders_vision").insert([visionData]);
        if (error) throw error;
      }
      toast.success("Vision updated successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingVision(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsUploading(prev => ({ ...prev, [type]: true }));
    try {
      const bucket = 'uploads';
      const folder = type === 'image' ? 'founders' : 'cv';
      const url = await uploadFile(file, bucket, folder);
      
      setEditingFounder(prev => ({
        ...prev,
        [type === 'image' ? 'photo_url' : 'cv_url']: url
      }));
      
      toast.success(`${type === 'image' ? 'Photo' : 'CV'} uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const deleteFounder = async (id: string) => {
    if (!confirm("Are you sure you want to remove this founder?")) return;
    try {
      const { error } = await supabase.from("founders").delete().eq("id", id);
      if (error) throw error;
      toast.success("Founder removed");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-slate-400 animate-pulse">Loading founders data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Founders Management</h2>
          <p className="text-slate-400 mt-1">Manage your agency founders and their shared vision.</p>
        </div>
        <Button 
          onClick={() => { setEditingFounder({ display_order: 0 }); setIsEditOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} className="mr-2" /> Add Founder
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Founders List */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10 text-white overflow-hidden backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="w-5 h-5 text-blue-400" />
                Founders List
              </CardTitle>
              <CardDescription className="text-slate-400">
                The founders will be displayed on the About section of the public site.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-400 w-16 pl-6">Photo</TableHead>
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Display Order</TableHead>
                      <TableHead className="text-right text-slate-400 pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {founders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                          No founders found. Click "Add Founder" to start.
                        </TableCell>
                      </TableRow>
                    ) : (
                      founders.map((founder) => (
                        <TableRow key={founder.id} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                          <TableCell className="pl-6">
                            <Avatar className="w-10 h-10 border border-white/10">
                              <AvatarImage src={founder.photo_url || ''} className="object-cover" />
                              <AvatarFallback className="bg-slate-800 text-xs">
                                {founder.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-semibold text-white">{founder.name}</TableCell>
                          <TableCell className="text-slate-400">{founder.role}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-white/10 text-slate-400">
                              {founder.display_order}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => { setEditingFounder(founder); setIsEditOpen(true); }} 
                                className="hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              >
                                <Pencil size={18} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => deleteFounder(founder.id)} 
                                className="hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-colors"
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
        </div>

        {/* Vision Management */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                Founders Vision
              </CardTitle>
              <CardDescription className="text-slate-400">
                This content appears in the center card between the two founders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveVision} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Vision Title</Label>
                  <Input 
                    name="vision_title" 
                    defaultValue={vision?.title} 
                    required 
                    placeholder="e.g. A partnership built around strategy..."
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Vision Content</Label>
                  <Textarea 
                    name="vision_content" 
                    defaultValue={vision?.content} 
                    required 
                    placeholder="Describe the founders' combined vision..."
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 min-h-[150px] resize-none" 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isSavingVision}
                >
                  {isSavingVision ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Vision
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingFounder?.id ? "Edit Founder" : "Add New Founder"}
            </DialogTitle>
          </DialogHeader>
          
          <form key={editingFounder?.id || "new"} onSubmit={handleSaveFounder} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Full Name</Label>
                  <Input 
                    name="name" 
                    defaultValue={editingFounder?.name} 
                    required 
                    placeholder="e.g. Hecham M."
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-400">Professional Role</Label>
                  <Input 
                    name="role" 
                    defaultValue={editingFounder?.role} 
                    required 
                    placeholder="e.g. Lead Engineer"
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Display Order</Label>
                  <Input 
                    type="number" 
                    name="display_order" 
                    defaultValue={editingFounder?.display_order || 0} 
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>
              </div>

              {/* Right Column: Uploads & Previews */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Founder Photo</Label>
                  <div className="relative group rounded-2xl border-2 border-dashed border-white/10 p-4 hover:border-blue-500/50 transition-colors bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-3">
                      {editingFounder?.photo_url ? (
                        <div className="relative">
                          <img 
                            src={editingFounder.photo_url} 
                            alt="Preview" 
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500/20"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-xs font-medium text-slate-400">
                          {isUploading.image ? "Uploading..." : "Click to upload image"}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading.image}
                    />
                  </div>
                </div>

                {/* CV Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Curriculum Vitae (PDF)</Label>
                  <div className="relative group rounded-xl border border-white/10 p-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${editingFounder?.cv_url ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {editingFounder?.cv_url ? "CV_Portfolio.pdf" : "No CV uploaded"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {isUploading.pdf ? "Uploading..." : "Click to select file"}
                        </p>
                      </div>
                      {editingFounder?.cv_url && (
                        <a 
                          href={editingFounder.cv_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading.pdf}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio - Full Width */}
            <div className="space-y-2">
              <Label className="text-slate-400">Founder Biography</Label>
              <Textarea 
                name="bio" 
                defaultValue={editingFounder?.bio} 
                required 
                placeholder="Write a brief professional background..."
                className="bg-white/5 border-white/10 focus:border-blue-500/50 min-h-[120px] resize-none" 
              />
            </div>

            <DialogFooter className="pt-6 border-t border-white/5 gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" 
                disabled={isUploading.image || isUploading.pdf}
              >
                {isUploading.image || isUploading.pdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  editingFounder?.id ? "Update Founder" : "Add Founder"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
