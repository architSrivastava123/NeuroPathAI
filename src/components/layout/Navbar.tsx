"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  LayoutDashboard, 
  Map, 
  Network, 
  CheckCircle2, 
  Sliders, 
  BookOpen, 
  Code2, 
  Flame,
  Bot
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/skills", label: "Skill Graph", icon: Network },
    { href: "/assessments", label: "Assessments", icon: CheckCircle2 },
    { href: "/projects", label: "Project Studio", icon: Code2 },
    { href: "/resources", label: "Resource Hub", icon: BookOpen },
    { href: "/simulator", label: "What-If Simulator", icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                NeuroPath AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Learning Intelligence
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-300">12 Day Streak</span>
            <span className="text-[10px] text-teal-400 font-bold ml-1 bg-teal-500/10 px-1.5 py-0.5 rounded">94% Consistency</span>
          </div>

          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 text-teal-200 border border-teal-500/30 text-xs font-semibold transition-all"
          >
            <Bot className="h-3.5 w-3.5 text-teal-400" />
            <span>AI Onboarding</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
