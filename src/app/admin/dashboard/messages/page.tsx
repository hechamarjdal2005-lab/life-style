"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete message");
    } else {
      toast.success("Message deleted");
      setMessages(messages.filter(m => m.id !== id));
    }
  }

  async function markAsRead(id: string) {
    const { error } = await supabase.from("contact_messages").update({ status: 'read' }).eq("id", id);
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Contact Messages</h2>
        <Button onClick={fetchMessages} variant="outline" className="border-white/10 text-white hover:bg-white/5">
          Refresh
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Subject</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{msg.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
                  <TableCell>
                    <Badge variant={msg.status === 'unread' ? 'default' : 'secondary'} className={msg.status === 'unread' ? 'bg-blue-600' : 'bg-slate-700'}>
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-white/10 text-slate-400 hover:text-white"
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'unread') markAsRead(msg.id);
                      }}
                    >
                      <Eye size={18} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-red-500/20 text-slate-400 hover:text-red-500"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="text-slate-400">
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 leading-relaxed whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedMessage(null)} className="border-white/10 text-white hover:bg-white/10">
                Close
              </Button>
              <a href={`mailto:${selectedMessage?.email}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2">
                Reply via Email
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
