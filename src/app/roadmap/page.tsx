"use client";

import { useEffect, useState } from "react";
import { RoadmapPlan } from "@/types";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import { RefreshCw, Map } from "lucide-react";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch("/api/roadmap");
      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading personalized learning trajectory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoadmapTimeline initialRoadmap={roadmap} />
    </div>
  );
}
