"use client";

import React, { useEffect, useRef, useState } from "react";
import { SceneCard } from "./scene-card";

interface Scene {
  id: number;
  title: string;
  description: string;
  duration: string;
}

const demoScenes: Scene[] = [
  {
    id: 1,
    title: "Hook Your Audience",
    description:
      "Start with a bold statement or intriguing question that grabs attention in the first 3 seconds.",
    duration: "0-3s",
  },
  {
    id: 2,
    title: "Introduce the Problem",
    description:
      "Present a relatable pain point that your audience experiences. Make them feel understood.",
    duration: "3-10s",
  },
  {
    id: 3,
    title: "Reveal the Solution",
    description:
      "Introduce your product or concept as the answer to their problem with visual flair.",
    duration: "10-25s",
  },
  {
    id: 4,
    title: "Show the Magic",
    description:
      "Demonstrate key features or benefits with engaging visuals and kinetic typography.",
    duration: "25-45s",
  },
  {
    id: 5,
    title: "Build Trust",
    description:
      "Add social proof, statistics, or testimonials to reinforce credibility.",
    duration: "45-55s",
  },
  {
    id: 6,
    title: "Call to Action",
    description:
      "End with a clear, compelling next step. Tell them exactly what to do next.",
    duration: "55-60s",
  },
];

export function StoryboardTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = timelineRef.current.offsetHeight;

      // Calculate how much of the timeline is visible/scrolled
      const scrolled = windowHeight - rect.top;
      const totalScrollable = elementHeight + windowHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative py-24 px-4" ref={timelineRef}>
      {/* Section header */}
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Your Story, Scene by Scene
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Every great video follows a narrative arc. Our AI crafts each scene
          to take your audience on a journey.
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Animated timeline connector */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
          {/* Background line */}
          <div className="absolute inset-0 bg-slate-700/50" />
          {/* Progress line */}
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-orange-500 origin-top transition-transform duration-100"
            style={{ transform: `scaleY(${scrollProgress})` }}
          />
        </div>

        {/* Scene cards */}
        <div className="relative space-y-24">
          {demoScenes.map((scene, index) => (
            <SceneCard
              key={scene.id}
              sceneNumber={scene.id}
              title={scene.title}
              description={scene.description}
              duration={scene.duration}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>

        {/* End marker */}
        <div className="relative mt-24 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg animate-pulse-glow">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
