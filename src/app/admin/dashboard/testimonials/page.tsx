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
    const testimonialData = {
      client_name: formData.get("client_name"),
      client_role: formData.get("client_role"),
      content: formData.get("content"),
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
                <TableHead className="text-slate-400">Client</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Rating</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t.id} className="border-white/10">
                  <TableCell className="font-bold">{t.client_name}</TableCell>
                  <TableCell className="text-slate-400">{t.client_role}</TableCell>
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
        <DialogContent className="bg-[#0F172A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Client Name</label>
                <Input name="client_name" defaultValue={editingTestimonial?.client_name} required className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Client Role</label>
                <Input name="client_role" defaultValue={editingTestimonial?.client_role} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Content</label>
              <Textarea name="content" defaultValue={editingTestimonial?.content} required className="bg-white/5 border-white/10 min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Rating (1-5)</label>
                <Input type="number" name="rating" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Display Order</label>
                <Input type="number" name="display_order" defaultValue={editingTestimonial?.display_order || 0} className="bg-white/5 border-white/10" />
              </div>
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
