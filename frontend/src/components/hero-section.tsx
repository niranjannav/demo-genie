"use client";

import React from "react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF9F6]">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(#E5E4E0 1px, transparent 1px), 
                           linear-gradient(90deg, #E5E4E0 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8EDE8] border border-[#4A5D4A]/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A5D4A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A5D4A]"></span>
          </span>
          <span className="text-sm text-[#4A5D4A] font-medium">AI-Powered Video Creation</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
          Transform Ideas Into{" "}
          <span className="text-[#4A5D4A]">Stunning Videos</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-[#4A4A4A] mb-10 max-w-3xl mx-auto leading-relaxed">
          Give us your messy documents and rough ideas. We&apos;ll give you
          polished, scroll-stopping content in{" "}
          <span className="text-[#D97706] font-semibold">60 seconds</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="group px-8 py-4 bg-[#1A1A1A] rounded-full 
            text-white font-semibold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
            hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300"
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
            className="px-8 py-4 rounded-full text-[#1A1A1A] font-medium text-lg 
            border border-[#2D2D2D] hover:bg-[#F5F5F0] 
            transition-all duration-300"
          >
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-16 pt-8 border-t border-[#E5E4E0]">
          <p className="text-[#7A7A7A] text-sm mb-4">
            Trusted by creative marketers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["TikTok", "Instagram", "YouTube", "LinkedIn"].map((platform) => (
              <span
                key={platform}
                className="text-[#9A9A9A] font-medium hover:text-[#4A4A4A] transition-colors"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-[#7A7A7A]">
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
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
