import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").single();
  return {
    title: settings?.seo_title || "H&M Studio | Premium Digital Agency",
    description: settings?.seo_description || "Transforming Ideas Into Exceptional Digital Products.",
    openGraph: {
      images: [settings?.og_image || ""],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className="antialiased selection:bg-blue-500/30 selection:text-white">
        <TooltipProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
