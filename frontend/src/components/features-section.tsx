"use client";

import React from "react";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: "Drop Any Document",
    description:
      "Upload PDFs, presentations, or raw text. Our AI extracts the story hidden in your content.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "AI Director",
    description:
      "Our intelligent director crafts the perfect storyboard, choosing visuals, pacing, and transitions.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Auto-Generated Assets",
    description:
      "AI creates stunning visuals, kinetic typography, and natural voiceovers for each scene.",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    title: "Intuitive Editor",
    description:
      "Fine-tune every scene with our visual editor. No video editing experience required.",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21M4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20Z"
        />
      </svg>
    ),
    title: "Platform-Ready Export",
    description:
      "Export in perfect formats for TikTok, Reels, Shorts, or LinkedIn. One click, any platform.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Cost-Effective",
    description:
      "Professional quality at a fraction of the cost. Less than $0.10 per video at scale.",
    gradient: "from-rose-500 to-orange-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-4">
            Why NeuroReel
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="gradient-text-accent">Go Viral</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From raw idea to polished video in minutes, not days. Our AI handles
            the heavy lifting so you can focus on your message.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl glass-surface hover:border-indigo-500/30 
              transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} 
                flex items-center justify-center text-white mb-4 
                group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
