"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Github as GithubIcon, Linkedin as LinkedinIcon } from "@/components/ui/icons";
import { Send, Mail, CheckCircle2, MessageSquare, User, AtSign, Tag } from "lucide-react";
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
import { useSectionContent } from "@/hooks/useSectionContent";

export function Contact() {
  const { t } = useSectionContent("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, t("nameError")),
    email: z.string().email(t("emailError")),
    subject: z.string().min(5, t("subjectError")),
    message: z.string().min(10, t("messageError")),
  }), [t]);

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
      toast.success(t("successToast"));
      form.reset();
    } catch (error) {
      toast.error(t("errorToast"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl rounded-full"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          x: [0, -10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[10%] w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-3xl rounded-full"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            {t("badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          >
            {t("titlePrefix")} <br />
            <span className="text-blue-500">{t("titleHighlight")}</span> {t("titleSuffix")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8 md:py-12"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={32} className="md:size-[40px] text-green-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{t("successTitle")}</h3>
                <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-10 max-w-sm mx-auto">
                  {t("successMessage")}
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  variant="outline" 
                  className="rounded-2xl border-white/10 text-white hover:bg-white/10 px-8 h-12 md:h-14 font-bold w-full sm:w-auto"
                >
                  {t("sendAnother")}
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-slate-400 flex items-center gap-2 text-sm">
                            <User size={14} className="text-blue-500" /> {t("fullName")}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("namePlaceholder")}
                              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all px-5 md:px-6" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-slate-400 flex items-center gap-2 text-sm">
                            <AtSign size={14} className="text-blue-500" /> {t("emailAddress")}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("emailPlaceholder")}
                              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all px-5 md:px-6" 
                              {...field} 
                            />
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
                      <FormItem className="space-y-3">
                        <FormLabel className="text-slate-400 flex items-center gap-2 text-sm">
                          <Tag size={14} className="text-blue-500" /> {t("projectSubject")}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("subjectPlaceholder")}
                            className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all px-5 md:px-6" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-slate-400 flex items-center gap-2 text-sm">
                          <MessageSquare size={14} className="text-blue-500" /> {t("projectDetails")}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("detailsPlaceholder")}
                            className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[150px] md:min-h-[180px] rounded-2xl md:rounded-3xl p-5 md:p-6 resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] group"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <AtSign size={24} />
                      </motion.div>
                    ) : (
                      <>
                        {t("submitButton")}
                        <Send size={20} className="ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12"
        >
          <a 
            href="mailto:hello@hmstudio.com" 
            className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
              <Mail size={20} className="group-hover:text-white text-blue-500" />
            </div>
            <span className="font-medium">{t("emailUs")}</span>
          </a>
          
          <div className="flex gap-4">
            {[
              { icon: GithubIcon, href: "#" },
              { icon: LinkedinIcon, href: "#" }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.href}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
