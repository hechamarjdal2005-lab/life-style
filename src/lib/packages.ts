import {
  Globe,
  Briefcase,
  LayoutGrid,
  PenTool,
  Palette,
  Workflow,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Globe,
  Briefcase,
  LayoutGrid,
  PenTool,
  Palette,
  Workflow,
  Smartphone,
};

export type Package = {
  id: string;
  title: string;
  tagline: string | null;
  price: string;
  currency: string;
  features: string[];
  freebies: string[];
  is_popular: boolean;
  icon_name: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

// Keep the old Pack type for backward compatibility until frontend is updated
export type Pack = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  price: string;
  features: string[];
  freebies: string[];
  highlighted?: boolean;
};

export const packages: Pack[] = [
  {
    id: "simple-website",
    icon: Globe,
    title: "Simple Website",
    tagline: "Clean one-page presence.",
    price: "from 2,500 MAD",
    features: [
      "Responsive design",
      "Up to 5 sections",
      "Contact form",
      "Basic SEO",
      "1 month support",
    ],
    freebies: [
      "Free domain (1 year)",
      "Free SSL certificate",
      "Free deployment",
    ],
  },
  {
    id: "professional-website",
    icon: Briefcase,
    title: "Professional Website",
    tagline: "Multi-page business site.",
    price: "from 6,000 MAD",
    features: [
      "Up to 10 pages",
      "CMS / editable content",
      "Advanced SEO",
      "Analytics setup",
      "3 months support",
    ],
    freebies: [
      "Free domain + hosting (1 year)",
      "Free logo refresh",
      "Free Google Business setup",
    ],
    highlighted: true,
  },
  {
    id: "portfolio",
    icon: LayoutGrid,
    title: "Portfolio",
    tagline: "Showcase your work beautifully.",
    price: "from 3,500 MAD",
    features: [
      "Project gallery",
      "Smooth animations",
      "Dark/light mode",
      "Fast performance",
      "1 month support",
    ],
    freebies: [
      "Free custom favicon",
      "Free social links integration",
      "Free deployment",
    ],
  },
  {
    id: "logo-design",
    icon: PenTool,
    title: "Logo Design",
    tagline: "A memorable mark.",
    price: "from 1,200 MAD",
    features: [
      "3 concepts",
      "Unlimited revisions",
      "Source files (SVG/AI)",
      "Color + mono versions",
      "Full ownership",
    ],
    freebies: [
      "Free favicon export",
      "Free social media kit",
      "Free business card design",
    ],
  },
  {
    id: "branding",
    icon: Palette,
    title: "Branding",
    tagline: "Complete brand identity.",
    price: "from 4,000 MAD",
    features: [
      "Logo suite",
      "Color system",
      "Typography",
      "Brand guidelines PDF",
      "Social templates",
    ],
    freebies: [
      "Free social starter pack",
      "Free email signature",
      "Free brand mockups",
    ],
  },
  {
    id: "generation-system",
    icon: Workflow,
    title: "Generation System",
    tagline: "Automated content/ops engine.",
    price: "from 8,000 MAD",
    features: [
      "Custom workflows",
      "API integrations",
      "Dashboard",
      "Scalable backend",
      "Priority support",
    ],
    freebies: [
      "Free 1 month maintenance",
      "Free admin training session",
      "Free documentation",
    ],
  },
  {
    id: "mobile-app",
    icon: Smartphone,
    title: "Mobile App",
    tagline: "iOS + Android, one codebase.",
    price: "from 12,000 MAD",
    features: [
      "Cross-platform",
      "Native performance",
      "Push notifications",
      "Backend + auth",
      "App store deployment",
    ],
    freebies: [
      "Free app icon + splash design",
      "Free 1 month maintenance",
      "Free store listing assets",
    ],
  },
];
