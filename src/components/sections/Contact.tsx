"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Github as GithubIcon, Linkedin as LinkedinIcon, Twitter as TwitterIcon } from "@/components/ui/icons";
import { Send, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([values]);
      if (error) throw error;
      
      setIsSuccess(true);
      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Let's build something <span className="text-blue-500">Extraordinary</span> together.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-12">
              Have a project in mind or just want to say hi? We'd love to hear from you. 
              Our team usually responds within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Mail size={20} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Email Us</div>
                  <div className="text-lg">hello@hmstudio.com</div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10 text-slate-400 hover:text-white">
                  <GithubIcon size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10 text-slate-400 hover:text-white">
                  <LinkedinIcon size={20} />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 size={64} className="text-green-500 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-slate-400 mb-8">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Inquiry" className="bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project..." 
                            className="bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold transition-all">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send size={18} className="ml-2" />
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
