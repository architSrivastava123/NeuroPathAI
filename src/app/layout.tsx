import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import LearningCopilot from "@/components/copilot/LearningCopilot";

export const metadata: Metadata = {
  title: "NeuroPath AI | AI-Powered Personalized Learning Intelligence Platform",
  description: "Closed-loop AI learning path recommendation engine with DAG skill graphs, confidence-weighted mastery, and adaptive replanning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-teal-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <LearningCopilot pageContext="global" />
      </body>
    </html>
  );
}
