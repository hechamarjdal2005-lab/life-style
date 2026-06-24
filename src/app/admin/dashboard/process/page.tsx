"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
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
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  display_order: number;
}

export default function AdminProcess() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<ProcessStep> | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("process_steps")
        .select("*")
        .order("display_order");
      if (error) throw error;
      setSteps(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const stepData = {
      step_number: formData.get("step_number") as string,
      title: (formData.get("title_en") as string) || (formData.get("title") as string),
      title_en: formData.get("title_en") as string,
      title_fr: formData.get("title_fr") as string,
      title_ar: formData.get("title_ar") as string,
      description: (formData.get("description_en") as string) || (formData.get("description") as string),
      description_en: formData.get("description_en") as string,
      description_fr: formData.get("description_fr") as string,
      description_ar: formData.get("description_ar") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingStep?.id) {
        const { error } = await supabase.from("process_steps").update(stepData).eq("id", editingStep.id);
        if (error) throw error;
        toast.success("Step updated successfully");
      } else {
        const { error } = await supabase.from("process_steps").insert([stepData]);
        if (error) throw error;
        toast.success("Step added successfully");
      }
      setIsEditOpen(false);
      fetchSteps();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStep = async (id: string) => {
    if (!confirm("Are you sure you want to remove this process step?")) return;
    try {
      const { error } = await supabase.from("process_steps").delete().eq("id", id);
      if (error) throw error;
      toast.success("Step removed");
      fetchSteps();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-slate-400 animate-pulse">Loading process steps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Process Management</h2>
          <p className="text-slate-400 mt-1">Manage the steps of your &quot;How We Create&quot; section.</p>
        </div>
        <Button 
          onClick={() => { setEditingStep({ display_order: steps.length + 1 }); setIsEditOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} className="mr-2" /> Add Step
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-24 pl-6">Step #</TableHead>
                  <TableHead className="text-slate-400">Title (EN)</TableHead>
                  <TableHead className="text-slate-400">Title (FR)</TableHead>
                  <TableHead className="text-slate-400">Title (AR)</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-right text-slate-400 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No steps found. Click &quot;Add Step&quot; to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  steps.map((step) => (
                    <TableRow key={step.id} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                      <TableCell className="pl-6 font-mono text-blue-400">{step.step_number}</TableCell>
                      <TableCell className="font-semibold text-white">{step.title_en || step.title}</TableCell>
                      <TableCell className="text-slate-400">{step.title_fr || "-"}</TableCell>
                      <TableCell className="text-slate-400" dir="rtl">{step.title_ar || "-"}</TableCell>
                      <TableCell className="text-slate-400">{step.display_order}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => { setEditingStep(step); setIsEditOpen(true); }} 
                            className="hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => deleteStep(step.id)} 
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
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingStep?.id ? "Edit Process Step" : "Add New Process Step"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Step Identifier (e.g. 01)</Label>
                <Input 
                  name="step_number" 
                  defaultValue={editingStep?.step_number} 
                  required 
                  placeholder="01"
                  className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Display Order</Label>
                <Input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingStep?.display_order || 0} 
                  className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Title</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Input name="title_en" defaultValue={editingStep?.title_en || editingStep?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Input name="title_fr" defaultValue={editingStep?.title_fr} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Input name="title_ar" defaultValue={editingStep?.title_ar} dir="rtl" className="bg-white/5 border-white/10" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Description</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">English</label>
                  <Textarea name="description_en" defaultValue={editingStep?.description_en || editingStep?.description} required className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">French</label>
                  <Textarea name="description_fr" defaultValue={editingStep?.description_fr} className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">Arabic</label>
                  <Textarea name="description_ar" defaultValue={editingStep?.description_ar} dir="rtl" className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
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
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {saving ? "Saving..." : editingStep?.id ? "Update Step" : "Add Step"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
