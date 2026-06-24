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

  const [featuresEn, setFeaturesEn] = useState<string[]>([]);
  const [featuresFr, setFeaturesFr] = useState<string[]>([]);
  const [featuresAr, setFeaturesAr] = useState<string[]>([]);
  const [freebiesEn, setFreebiesEn] = useState<string[]>([]);
  const [freebiesFr, setFreebiesFr] = useState<string[]>([]);
  const [freebiesAr, setFreebiesAr] = useState<string[]>([]);

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
    setFeaturesEn(pkg?.features_en || pkg?.features || []);
    setFeaturesFr(pkg?.features_fr || []);
    setFeaturesAr(pkg?.features_ar || []);
    setFreebiesEn(pkg?.freebies_en || pkg?.freebies || []);
    setFreebiesFr(pkg?.freebies_fr || []);
    setFreebiesAr(pkg?.freebies_ar || []);
    setIsEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const packageData = {
      title: formData.get("title_en") as string,
      title_en: formData.get("title_en") as string,
      title_fr: formData.get("title_fr") as string,
      title_ar: formData.get("title_ar") as string,
      tagline: formData.get("tagline_en") as string,
      tagline_en: formData.get("tagline_en") as string,
      tagline_fr: formData.get("tagline_fr") as string,
      tagline_ar: formData.get("tagline_ar") as string,
      price: formData.get("price") as string,
      currency: formData.get("currency") as string || "MAD",
      is_popular: formData.get("is_popular") === "on",
      icon_name: formData.get("icon_name") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      features: featuresEn.filter(f => f.trim() !== ""),
      features_en: featuresEn.filter(f => f.trim() !== ""),
      features_fr: featuresFr.filter(f => f.trim() !== ""),
      features_ar: featuresAr.filter(f => f.trim() !== ""),
      freebies: freebiesEn.filter(f => f.trim() !== ""),
      freebies_en: freebiesEn.filter(f => f.trim() !== ""),
      freebies_fr: freebiesFr.filter(f => f.trim() !== ""),
      freebies_ar: freebiesAr.filter(f => f.trim() !== ""),
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

  const addFeatureEn = () => setFeaturesEn([...featuresEn, ""]);
  const updateFeatureEn = (index: number, value: string) => {
    const newFeatures = [...featuresEn];
    newFeatures[index] = value;
    setFeaturesEn(newFeatures);
  };
  const removeFeatureEn = (index: number) => setFeaturesEn(featuresEn.filter((_, i) => i !== index));

  const addFeatureFr = () => setFeaturesFr([...featuresFr, ""]);
  const updateFeatureFr = (index: number, value: string) => {
    const newFeatures = [...featuresFr];
    newFeatures[index] = value;
    setFeaturesFr(newFeatures);
  };
  const removeFeatureFr = (index: number) => setFeaturesFr(featuresFr.filter((_, i) => i !== index));

  const addFeatureAr = () => setFeaturesAr([...featuresAr, ""]);
  const updateFeatureAr = (index: number, value: string) => {
    const newFeatures = [...featuresAr];
    newFeatures[index] = value;
    setFeaturesAr(newFeatures);
  };
  const removeFeatureAr = (index: number) => setFeaturesAr(featuresAr.filter((_, i) => i !== index));

  const addFreebieEn = () => setFreebiesEn([...freebiesEn, ""]);
  const updateFreebieEn = (index: number, value: string) => {
    const newFreebies = [...freebiesEn];
    newFreebies[index] = value;
    setFreebiesEn(newFreebies);
  };
  const removeFreebieEn = (index: number) => setFreebiesEn(freebiesEn.filter((_, i) => i !== index));

  const addFreebieFr = () => setFreebiesFr([...freebiesFr, ""]);
  const updateFreebieFr = (index: number, value: string) => {
    const newFreebies = [...freebiesFr];
    newFreebies[index] = value;
    setFreebiesFr(newFreebies);
  };
  const removeFreebieFr = (index: number) => setFreebiesFr(freebiesFr.filter((_, i) => i !== index));

  const addFreebieAr = () => setFreebiesAr([...freebiesAr, ""]);
  const updateFreebieAr = (index: number, value: string) => {
    const newFreebies = [...freebiesAr];
    newFreebies[index] = value;
    setFreebiesAr(newFreebies);
  };
  const removeFreebieAr = (index: number) => setFreebiesAr(freebiesAr.filter((_, i) => i !== index));

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
                  <TableCell className="font-bold">{pkg.title_en || pkg.title}</TableCell>
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
            <div className="space-y-2">
              <Label className="text-slate-400">Title</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Input name="title_en" defaultValue={editingPackage?.title_en || editingPackage?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Input name="title_fr" defaultValue={editingPackage?.title_fr || ""} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Input name="title_ar" defaultValue={editingPackage?.title_ar || ""} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Icon (Lucide name)</Label>
                <Input name="icon_name" defaultValue={editingPackage?.icon_name || ""} placeholder="Globe, Briefcase, etc." className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Price Display</Label>
                <Input name="price" defaultValue={editingPackage?.price} required placeholder="from 2,500 MAD" className="bg-white/5 border-white/10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Tagline</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">EN</span>
                  <Input name="tagline_en" defaultValue={editingPackage?.tagline_en || editingPackage?.tagline || ""} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">FR</span>
                  <Input name="tagline_fr" defaultValue={editingPackage?.tagline_fr || ""} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">AR</span>
                  <Input name="tagline_ar" defaultValue={editingPackage?.tagline_ar || ""} dir="rtl" className="bg-white/5 border-white/10 text-right" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Display Order</Label>
                <Input type="number" name="order_index" defaultValue={editingPackage?.order_index || 0} className="bg-white/5 border-white/10" />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch name="is_popular" id="is_popular" defaultChecked={editingPackage?.is_popular} />
                <Label htmlFor="is_popular">Highlight as Most Popular</Label>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <Label className="text-slate-400 text-base">Features</Label>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">EN</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFeatureEn} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {featuresEn.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={feature} onChange={(e) => updateFeatureEn(index, e.target.value)} placeholder="Enter feature..." className="bg-white/5 border-white/10" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFeatureEn(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">FR</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFeatureFr} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {featuresFr.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={feature} onChange={(e) => updateFeatureFr(index, e.target.value)} placeholder="Entrez la fonctionnalité..." className="bg-white/5 border-white/10" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFeatureFr(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AR</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFeatureAr} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {featuresAr.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={feature} onChange={(e) => updateFeatureAr(index, e.target.value)} placeholder="أدخل الميزة..." dir="rtl" className="bg-white/5 border-white/10 text-right" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFeatureAr(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <Label className="text-slate-400 text-base">Freebies (Included for Free)</Label>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">EN</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFreebieEn} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {freebiesEn.map((freebie, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={freebie} onChange={(e) => updateFreebieEn(index, e.target.value)} placeholder="Enter freebie..." className="bg-white/5 border-white/10" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFreebieEn(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">FR</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFreebieFr} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {freebiesFr.map((freebie, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={freebie} onChange={(e) => updateFreebieFr(index, e.target.value)} placeholder="Entrez le bonus..." className="bg-white/5 border-white/10" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFreebieFr(index)} className="text-slate-500 hover:text-red-500">
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AR</span>
                  <Button type="button" size="sm" variant="outline" onClick={addFreebieAr} className="h-7 text-xs border-white/10 hover:bg-white/5">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                {freebiesAr.map((freebie, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={freebie} onChange={(e) => updateFreebieAr(index, e.target.value)} placeholder="أدخل الهدية..." dir="rtl" className="bg-white/5 border-white/10 text-right" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeFreebieAr(index)} className="text-slate-500 hover:text-red-500">
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