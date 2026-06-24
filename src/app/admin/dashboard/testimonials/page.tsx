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
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTestimonials() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order");
    if (data) setTestimonials(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const client_name_en = formData.get("client_name_en") as string;
    const client_name_fr = formData.get("client_name_fr") as string;
    const client_name_ar = formData.get("client_name_ar") as string;
    const client_role_en = formData.get("client_role_en") as string;
    const client_role_fr = formData.get("client_role_fr") as string;
    const client_role_ar = formData.get("client_role_ar") as string;
    const content_en = formData.get("content_en") as string;
    const content_fr = formData.get("content_fr") as string;
    const content_ar = formData.get("content_ar") as string;

    const testimonialData = {
      client_name: client_name_en,
      client_name_en,
      client_name_fr,
      client_name_ar,
      client_role: client_role_en,
      client_role_en,
      client_role_fr,
      client_role_ar,
      content: content_en,
      content_en,
      content_fr,
      content_ar,
      rating: parseInt(formData.get("rating") as string) || 5,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingTestimonial?.id) {
        const { error } = await supabase.from("testimonials").update(testimonialData).eq("id", editingTestimonial.id);
        if (error) throw error;
        toast.success("Testimonial updated");
      } else {
        const { error } = await supabase.from("testimonials").insert([testimonialData]);
        if (error) throw error;
        toast.success("Testimonial added");
      }
      setIsEditOpen(false);
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) {
      toast.success("Testimonial removed");
      fetchTestimonials();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Testimonials</h2>
        <Button onClick={() => { setEditingTestimonial(null); setIsEditOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Add Testimonial
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Client (EN)</TableHead>
                <TableHead className="text-slate-400">Client (FR)</TableHead>
                <TableHead className="text-slate-400">Client (AR)</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Rating</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t.id} className="border-white/10">
                  <TableCell className="font-bold">{t.client_name_en || t.client_name}</TableCell>
                  <TableCell className="text-slate-400">{t.client_name_fr || "-"}</TableCell>
                  <TableCell className="text-slate-400" dir="rtl">{t.client_name_ar || "-"}</TableCell>
                  <TableCell className="text-slate-400">{t.client_role_en || t.client_role}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingTestimonial(t); setIsEditOpen(true); }} className="hover:bg-white/10">
                      <Pencil size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteTestimonial(t.id)} className="hover:bg-red-500/20 text-red-500">
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
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Client Name</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Input name="client_name_en" defaultValue={editingTestimonial?.client_name_en || editingTestimonial?.client_name} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Input name="client_name_fr" defaultValue={editingTestimonial?.client_name_fr} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Input name="client_name_ar" defaultValue={editingTestimonial?.client_name_ar} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Client Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Input name="client_role_en" defaultValue={editingTestimonial?.client_role_en || editingTestimonial?.client_role} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Input name="client_role_fr" defaultValue={editingTestimonial?.client_role_fr} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Input name="client_role_ar" defaultValue={editingTestimonial?.client_role_ar} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Textarea name="content_en" defaultValue={editingTestimonial?.content_en || editingTestimonial?.content} required className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Textarea name="content_fr" defaultValue={editingTestimonial?.content_fr} className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Textarea name="content_ar" defaultValue={editingTestimonial?.content_ar} dir="rtl" className="bg-white/5 border-white/10 min-h-[100px] text-right" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Rating (1-5)</label>
                  <Input type="number" name="rating" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Display Order</label>
                  <Input type="number" name="display_order" defaultValue={editingTestimonial?.display_order || 0} className="bg-white/5 border-white/10" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-white/5 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
