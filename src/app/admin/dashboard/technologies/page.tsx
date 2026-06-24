"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminTechnologies() {
  const [loading, setLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTechs();
  }, []);

  async function fetchTechs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("display_order");
    if (data) setTechs(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const techData = {
      name: formData.get("name_en"),
      name_en: formData.get("name_en"),
      name_fr: formData.get("name_fr"),
      name_ar: formData.get("name_ar"),
      category: formData.get("category_en"),
      category_en: formData.get("category_en"),
      category_fr: formData.get("category_fr"),
      category_ar: formData.get("category_ar"),
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingTech?.id) {
        const { error } = await supabase.from("technologies").update(techData).eq("id", editingTech.id);
        if (error) throw error;
        toast.success("Technology updated");
      } else {
        const { error } = await supabase.from("technologies").insert([techData]);
        if (error) throw error;
        toast.success("Technology added");
      }
      setIsEditOpen(false);
      fetchTechs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteTech = async (id: string) => {
    if (!confirm("Delete this technology?")) return;
    const { error } = await supabase.from("technologies").delete().eq("id", id);
    if (!error) {
      toast.success("Technology removed");
      fetchTechs();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tech Stack</h2>
        <Button onClick={() => { setEditingTech(null); setIsEditOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Add Tech
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Category</TableHead>
                <TableHead className="text-slate-400">Order</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techs.map((tech) => (
                <TableRow key={tech.id} className="border-white/10">
                  <TableCell className="font-bold">{tech.name}</TableCell>
                  <TableCell className="text-slate-400">{tech.category}</TableCell>
                  <TableCell>{tech.display_order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingTech(tech); setIsEditOpen(true); }} className="hover:bg-white/10">
                      <Pencil size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteTech(tech.id)} className="hover:bg-red-500/20 text-red-500">
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingTech ? "Edit Technology" : "Add Technology"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="border-t border-white/10 pt-4">
              <label className="text-sm font-medium text-slate-400 mb-3 block">Name</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">EN</label>
                  <Input name="name_en" defaultValue={editingTech?.name_en || editingTech?.name || ''} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">FR</label>
                  <Input name="name_fr" defaultValue={editingTech?.name_fr || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">AR</label>
                  <Input name="name_ar" defaultValue={editingTech?.name_ar || ''} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <label className="text-sm font-medium text-slate-400 mb-3 block">Category</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">EN</label>
                  <Input name="category_en" defaultValue={editingTech?.category_en || editingTech?.category || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">FR</label>
                  <Input name="category_fr" defaultValue={editingTech?.category_fr || ''} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">AR</label>
                  <Input name="category_ar" defaultValue={editingTech?.category_ar || ''} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Display Order</label>
              <Input type="number" name="display_order" defaultValue={editingTech?.display_order || 0} className="bg-white/5 border-white/10" />
            </div>
            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
