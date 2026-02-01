"use client";

import React from "react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.3), transparent), linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating orbs for creative effect */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span className="text-sm text-slate-300">AI-Powered Video Creation</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Ideas Into{" "}
          <span className="gradient-text">Stunning Videos</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Give us your messy documents and rough ideas. We&apos;ll give you
          polished, scroll-stopping content in{" "}
          <span className="text-indigo-400 font-semibold">60 seconds</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full 
            text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 
            hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Start Creating Free
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <button
            className="px-8 py-4 rounded-full text-white font-medium text-lg 
            border border-white/20 hover:bg-white/5 hover:border-white/30 
            transition-all duration-300"
          >
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm mb-4">
            Trusted by creative marketers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["TikTok", "Instagram", "YouTube", "LinkedIn"].map((platform) => (
              <span
                key={platform}
                className="text-slate-600 font-medium hover:text-slate-400 transition-colors"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
