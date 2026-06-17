"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FileText, 
  Upload,
  ExternalLink,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string | null;
  cv_url: string | null;
  is_founder: boolean;
  display_order: number;
}

export default function AdminTeam() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isUploading, setIsUploading] = useState<{ image: boolean; pdf: boolean }>({ image: false, pdf: false });

  const supabase = createClient();

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("team")
        .select("*")
        .order("display_order");
      if (error) throw error;
      setTeam(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const memberData = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      avatar_url: editingMember?.avatar_url || null,
      cv_url: editingMember?.cv_url || null,
      is_founder: editingMember?.is_founder || false,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingMember?.id) {
        const { error } = await supabase.from("team").update(memberData).eq("id", editingMember.id);
        if (error) throw error;
        toast.success("Team member updated successfully");
      } else {
        const { error } = await supabase.from("team").insert([memberData]);
        if (error) throw error;
        toast.success("Team member added successfully");
      }
      setIsEditOpen(false);
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message);
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
      const folder = type === 'image' ? 'team' : 'cv';
      const url = await uploadFile(file, bucket, folder);
      
      setEditingMember(prev => ({
        ...prev,
        [type === 'image' ? 'avatar_url' : 'cv_url']: url
      }));
      
      toast.success(`${type === 'image' ? 'Avatar' : 'CV'} uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      const { error } = await supabase.from("team").delete().eq("id", id);
      if (error) throw error;
      toast.success("Member removed");
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-slate-400 animate-pulse">Loading team data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Team Management</h2>
          <p className="text-slate-400 mt-1">Manage your agency founders and team members.</p>
        </div>
        <Button 
          onClick={() => { setEditingMember({ is_founder: false, display_order: 0 }); setIsEditOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} className="mr-2" /> Add Team Member
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-16">Photo</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Founder Status</TableHead>
                  <TableHead className="text-slate-400">Display Order</TableHead>
                  <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No team members found. Click "Add Team Member" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  team.map((member) => (
                    <TableRow key={member.id} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                      <TableCell>
                        <Avatar className="w-10 h-10 border border-white/10">
                          <AvatarImage src={member.avatar_url || ''} className="object-cover" />
                          <AvatarFallback className="bg-slate-800 text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-semibold text-white">{member.name}</TableCell>
                      <TableCell className="text-slate-400">{member.role}</TableCell>
                      <TableCell>
                        {member.is_founder ? (
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 font-bold">
                            Founder
                          </Badge>
                        ) : (
                          <span className="text-slate-600 text-sm">Member</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-slate-400">
                          {member.display_order}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => { setEditingMember(member); setIsEditOpen(true); }} 
                            className="hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => deleteMember(member.id)} 
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingMember?.id ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Full Name</Label>
                  <Input 
                    name="name" 
                    defaultValue={editingMember?.name} 
                    required 
                    placeholder="e.g. Hecham M."
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-400">Professional Role</Label>
                  <Input 
                    name="role" 
                    defaultValue={editingMember?.role} 
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
                    defaultValue={editingMember?.display_order || 0} 
                    className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5">
                    <Label className="text-white">Founder Status</Label>
                    <p className="text-xs text-slate-500">Toggle if this person is a founder.</p>
                  </div>
                  <Switch 
                    checked={editingMember?.is_founder || false}
                    onCheckedChange={(checked) => setEditingMember(prev => ({ ...prev, is_founder: checked }))}
                  />
                </div>
              </div>

              {/* Right Column: Uploads & Previews */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Profile Photo</Label>
                  <div className="relative group rounded-2xl border-2 border-dashed border-white/10 p-4 hover:border-blue-500/50 transition-colors bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-3">
                      {editingMember?.avatar_url ? (
                        <div className="relative">
                          <img 
                            src={editingMember.avatar_url} 
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
                      <div className={`p-2 rounded-lg ${editingMember?.cv_url ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {editingMember?.cv_url ? "CV_Portfolio.pdf" : "No CV uploaded"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {isUploading.pdf ? "Uploading..." : "Click to select file"}
                        </p>
                      </div>
                      {editingMember?.cv_url && (
                        <a 
                          href={editingMember.cv_url} 
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
              <Label className="text-slate-400">Professional Biography</Label>
              <Textarea 
                name="bio" 
                defaultValue={editingMember?.bio} 
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
                  editingMember?.id ? "Update Member" : "Add Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
