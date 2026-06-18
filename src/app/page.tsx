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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string | null;
  cv_url: string | null;
  is_founder: boolean;
  display_order: number;
}

export default async function Home() {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [
    { data: foundersData },
    { data: visionData },
    { data: servicesData },
    { data: techData },
    { data: projectsData },
    { data: processData },
  ] = await Promise.all([
    supabase.from("founders").select("*").order("display_order"),
    supabase.from("founders_vision").select("*").single(),
    supabase.from("services").select("*").order("display_order"),
    supabase.from("tech_stack").select("*").order("display_order"),
    supabase.from("projects").select("*, images:project_images(*)").order("display_order"),
    supabase.from("process_steps").select("*").order("display_order"),
  ]);

  return (
    <main className="bg-[#0F172A] min-h-screen selection:bg-blue-500/30">
      <Navbar />
      
      <Hero />
      
      <div className="relative z-10">
        {foundersData && (
          <About 
            founders={foundersData} 
            vision={visionData ? { title: visionData.title, content: visionData.content } : {
              title: "A partnership built around strategy, design, and execution.",
              content: "H&M Studio is shaped by two founders who combine product thinking, engineering discipline, and a sharp visual standard. Together, they turn ambitious ideas into scalable digital platforms."
            }}
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
