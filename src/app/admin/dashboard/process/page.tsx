"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
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
  Save,
  Layers,
  MoveUp,
  MoveDown
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
  description: string;
  display_order: number;
}

export default function AdminProcess() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<ProcessStep> | null>(null);

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
    const formData = new FormData(e.currentTarget);
    
    const stepData = {
      step_number: formData.get("step_number") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
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
          <p className="text-slate-400 mt-1">Manage the steps of your "How We Create" section.</p>
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
                  <TableHead className="text-slate-400">Title</TableHead>
                  <TableHead className="text-slate-400">Description</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-right text-slate-400 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                      No steps found. Click "Add Step" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  steps.map((step) => (
                    <TableRow key={step.id} className="border-white/10 hover:bg-white/[0.02] transition-colors">
                      <TableCell className="pl-6 font-mono text-blue-400">{step.step_number}</TableCell>
                      <TableCell className="font-semibold text-white">{step.title}</TableCell>
                      <TableCell className="text-slate-400 max-w-md truncate">{step.description}</TableCell>
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
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingStep?.id ? "Edit Process Step" : "Add New Process Step"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label className="text-slate-400">Title</Label>
                <Input 
                  name="title" 
                  defaultValue={editingStep?.title} 
                  required 
                  placeholder="e.g. Discover"
                  className="bg-white/5 border-white/10 focus:border-blue-500/50" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Description</Label>
                <Textarea 
                  name="description" 
                  defaultValue={editingStep?.description} 
                  required 
                  placeholder="Describe this step in the process..."
                  className="bg-white/5 border-white/10 focus:border-blue-500/50 min-h-[120px] resize-none" 
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
              >
                {editingStep?.id ? "Update Step" : "Add Step"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
