import Link from "next/link";
import { Github, Linkedin, Twitter } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter mb-6 block">
              H&M<span className="text-blue-500">STUDIO</span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              World-class digital agency specializing in premium web and mobile experiences.
              Transforming ideas into exceptional digital products.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#services" className="text-slate-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#portfolio" className="text-slate-400 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="#process" className="text-slate-400 hover:text-white transition-colors">Process</Link></li>
              <li><Link href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Connect</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                <Github size={20} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} H&M Studio. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-slate-500 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
