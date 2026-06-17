import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { Portfolio } from "@/components/sections/Portfolio";
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
  ] = await Promise.all([
    supabase.from("team").select("*").eq("is_founder", true).order("display_order"),
    supabase.from("founders_vision").select("*").single(),
    supabase.from("services").select("*").order("display_order"),
    supabase.from("technologies").select("*").order("display_order"),
    supabase.from("projects").select("*, images:project_images(*)").order("display_order"),
  ]);

  return (
    <main className="bg-[#0F172A] min-h-screen selection:bg-blue-500/30">
      <Navbar />
      
      <Hero />
      
      <div className="relative z-10">
        {foundersData && (
          <About 
            founders={foundersData as TeamMember[]} 
            vision={visionData ? { title: visionData.title, content: visionData.content } : {
              title: "A partnership built around strategy, design, and execution.",
              content: "H&M Studio is shaped by two founders who combine product thinking, engineering discipline, and a sharp visual standard. Together, they turn ambitious ideas into scalable digital platforms."
            }}
          />
        )}

        {servicesData && <Services data={servicesData} />}
        
        {techData && <TechStack data={techData} />}
        
        {projectsData && <Portfolio data={projectsData} />}

        {/* Process Section */}
        <section id="process" className="py-32 bg-[#0F172A] relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">How We <span className="text-blue-500">Create</span></h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">A meticulous, battle-tested approach to delivering excellence at every stage of the lifecycle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
              {[
                { step: "01", title: "Discover", desc: "Immersion into your business goals, user personas, and market landscape." },
                { step: "02", title: "Design", desc: "Translating insights into intuitive, high-fidelity prototypes and premium UI." },
                { step: "03", title: "Develop", desc: "Engineering scalable, high-performance systems with clean, modern code." },
                { step: "04", title: "Deploy", desc: "Comprehensive QA, stress testing, and a seamless, zero-downtime launch." },
                { step: "05", title: "Scale", desc: "Continuous monitoring, optimization, and strategic growth partnership." }
              ].map((p, i) => (
                <div key={i} className="group">
                  <div className="text-6xl font-black text-white/5 mb-6 group-hover:text-blue-500/20 transition-colors duration-500">{p.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </div>
      <Footer />
    </main>
  );
}
