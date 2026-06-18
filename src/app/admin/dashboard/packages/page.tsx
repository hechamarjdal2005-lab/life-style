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
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Package } from "@/lib/packages";

export default function AdminPackages() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);

  // Dynamic lists for features and freebies
  const [features, setFeatures] = useState<string[]>([]);
  const [freebies, setFreebies] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("order_index");
    if (data) setPackages(data);
    setLoading(false);
  }

  const openEdit = (pkg: Partial<Package> | null) => {
    setEditingPackage(pkg);
    setFeatures(pkg?.features || []);
    setFreebies(pkg?.freebies || []);
    setIsEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const packageData = {
      title: formData.get("title") as string,
      tagline: formData.get("tagline") as string,
      price: formData.get("price") as string,
      currency: formData.get("currency") as string || "MAD",
      is_popular: formData.get("is_popular") === "on",
      icon_name: formData.get("icon_name") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      features: features.filter(f => f.trim() !== ""),
      freebies: freebies.filter(f => f.trim() !== ""),
    };

    try {
      if (editingPackage?.id) {
        const { error } = await supabase
          .from("packages")
          .update(packageData)
          .eq("id", editingPackage.id);
        if (error) throw error;
        toast.success("Package updated");
      } else {
        const { error } = await supabase
          .from("packages")
          .insert([packageData]);
        if (error) throw error;
        toast.success("Package created");
      }
      setIsEditOpen(false);
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (!error) {
      toast.success("Package deleted");
      fetchPackages();
    } else {
      toast.error(error.message);
    }
  };

  const addFeature = () => setFeatures([...features, ""]);
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const addFreebie = () => setFreebies([...freebies, ""]);
  const updateFreebie = (index: number, value: string) => {
    const newFreebies = [...freebies];
    newFreebies[index] = value;
    setFreebies(newFreebies);
  };
  const removeFreebie = (index: number) => setFreebies(freebies.filter((_, i) => i !== index));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Packages</h2>
          <p className="text-slate-400 mt-1">Manage pricing plans and offerings.</p>
        </div>
        <Button onClick={() => openEdit(null)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Add Package
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Title</TableHead>
                <TableHead className="text-slate-400">Price</TableHead>
                <TableHead className="text-slate-400">Popular</TableHead>
                <TableHead className="text-slate-400">Order</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold">{pkg.title}</TableCell>
                  <TableCell className="text-blue-400 font-medium">{pkg.price}</TableCell>
                  <TableCell>
                    {pkg.is_popular ? (
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                        Popular
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>{pkg.order_index}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(pkg)} className="hover:bg-white/10">
                      <Pencil size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deletePackage(pkg.id)} className="hover:bg-red-500/20 text-red-500">
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    No packages found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Edit Package" : "Add Package"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Title</Label>
                <Input name="title" defaultValue={editingPackage?.title} required className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Icon (Lucide name)</Label>
                <Input name="icon_name" defaultValue={editingPackage?.icon_name || ""} placeholder="Globe, Briefcase, etc." className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Tagline</Label>
                <Input name="tagline" defaultValue={editingPackage?.tagline || ""} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Price Display</Label>
                <Input name="price" defaultValue={editingPackage?.price} required placeholder="from 2,500 MAD" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Display Order</Label>
                <Input type="number" name="order_index" defaultValue={editingPackage?.order_index || 0} className="bg-white/5 border-white/10" />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch name="is_popular" id="is_popular" defaultChecked={editingPackage?.is_popular} />
                <Label htmlFor="is_popular">Highlight as Most Popular</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Features</Label>
                <Button type="button" size="sm" variant="outline" onClick={addFeature} className="h-7 text-xs border-white/10 hover:bg-white/5">
                  <Plus size={14} className="mr-1" /> Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={feature} 
                      onChange={(e) => updateFeature(index, e.target.value)} 
                      placeholder="Enter feature..." 
                      className="bg-white/5 border-white/10"
                    />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFeature(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Freebies (Included for Free)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addFreebie} className="h-7 text-xs border-white/10 hover:bg-white/5">
                  <Plus size={14} className="mr-1" /> Add Freebie
                </Button>
              </div>
              <div className="space-y-2">
                {freebies.map((freebie, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={freebie} 
                      onChange={(e) => updateFreebie(index, e.target.value)} 
                      placeholder="Enter freebie..." 
                      className="bg-white/5 border-white/10"
                    />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFreebie(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Package</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
