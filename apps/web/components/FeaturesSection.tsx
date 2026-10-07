import { Activity, Globe, Link2, Terminal } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Real-time analytics",
      description: "Watch clicks arrive in real time and understand how your links are performing.",
      icon: Activity,
    },
    {
      title: "Know your audience",
      description: "Understand where your traffic comes from with location, device, and referrer insights.",
      icon: Globe,
    },
    {
      title: "Simple link management",
      description: "Create, organize, and manage all your short links from one clean dashboard.",
      icon: Link2,
    },
    {
      title: "Built for developers",
      description: "Fast, simple infrastructure designed for modern applications and developer workflows.",
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold tracking-wide uppercase">
          Key Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-neutral-950">
          More than a short link.
        </h2>
        <p className="text-neutral-600 text-sm sm:text-base">
          LinkLytics gives you the context behind every click.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-700 mb-5 group-hover:scale-105 transition-transform">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2 font-display">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
