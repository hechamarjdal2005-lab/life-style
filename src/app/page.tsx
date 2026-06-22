import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { Portfolio } from "@/components/sections/Portfolio";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [
    { data: foundersData },
    { data: servicesData },
    { data: techData },
    { data: projectsData },
    { data: processData },
  ] = await Promise.all([
    supabase
      .from("founders")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("services").select("*").order("display_order"),
    supabase.from("tech_stack").select("*").order("display_order"),
    supabase.from("projects").select("*, images:project_images(*)").order("display_order"),
    supabase.from("process_steps").select("*").order("display_order"),
  ]);

  return (
    <main className="bg-[#0F172A] min-h-screen selection:bg-blue-500/30">
      <Navbar />
      
      <Hero />
      <WhatsAppButton />
      
      <div className="relative z-10">
        {foundersData && (
          <About 
            founders={foundersData} 
          />
        )}

        {servicesData && <Services data={servicesData} />}

        <Packages />

        {techData && <TechStack data={techData} />}

        {projectsData && <Portfolio data={projectsData} />}

        {/* Process Section */}
        {processData && <Process data={processData} />}

        <Contact />
      </div>
      <Footer />
    </main>
  );
}
