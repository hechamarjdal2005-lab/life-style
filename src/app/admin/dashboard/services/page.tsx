"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminServices() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");
    if (error) toast.error(error.message);
    if (data) setServices(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const serviceData = {
      title: formData.get("title") as string,
      title_en: (formData.get("title_en") as string) || (formData.get("title") as string),
      title_fr: formData.get("title_fr") as string,
      title_ar: formData.get("title_ar") as string,
      description: (formData.get("description") as string) || (formData.get("description_en") as string),
      description_en: formData.get("description_en") as string,
      description_fr: formData.get("description_fr") as string,
      description_ar: formData.get("description_ar") as string,
      icon: formData.get("icon") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingService?.id) {
        const { error } = await supabase.from("services").update(serviceData).eq("id", editingService.id);
        if (error) throw error;
        toast.success("Service updated");
      } else {
        const { error } = await supabase.from("services").insert([serviceData]);
        if (error) throw error;
        toast.success("Service created");
      }
      setIsEditOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Service deleted");
      fetchServices();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Services</h2>
        <Button onClick={() => { setEditingService(null); setIsEditOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Add Service
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Title (EN)</TableHead>
                <TableHead className="text-slate-400">Title (FR)</TableHead>
                <TableHead className="text-slate-400">Title (AR)</TableHead>
                <TableHead className="text-slate-400">Icon</TableHead>
                <TableHead className="text-slate-400">Order</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    No services found. Click "Add Service" to start.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id} className="border-white/10">
                    <TableCell className="font-bold">{service.title_en || service.title}</TableCell>
                    <TableCell className="text-slate-400">{service.title_fr || "-"}</TableCell>
                    <TableCell className="text-slate-400" dir="rtl">{service.title_ar || "-"}</TableCell>
                    <TableCell className="text-slate-400">{service.icon}</TableCell>
                    <TableCell>{service.display_order}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingService(service); setIsEditOpen(true); }} className="hover:bg-white/10 text-slate-400 hover:text-white">
                        <Pencil size={18} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteService(service.id)} className="hover:bg-red-500/20 text-red-500">
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-slate-400">Icon (Lucide name)</Label>
              <Input name="icon" defaultValue={editingService?.icon} placeholder="Code, Smartphone, Cloud" className="bg-white/5 border-white/10" />
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Title</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Input name="title_en" defaultValue={editingService?.title_en || editingService?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Input name="title_fr" defaultValue={editingService?.title_fr} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Input name="title_ar" defaultValue={editingService?.title_ar} dir="rtl" className="bg-white/5 border-white/10" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Description</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Textarea name="description_en" defaultValue={editingService?.description_en || editingService?.description} required className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Textarea name="description_fr" defaultValue={editingService?.description_fr} className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Textarea name="description_ar" defaultValue={editingService?.description_ar} dir="rtl" className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Display Order</label>
                  <Input type="number" name="display_order" defaultValue={editingService?.display_order || 0} className="bg-white/5 border-white/10" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-white/5 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
