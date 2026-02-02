"use client";

import React from "react";

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#F5F5F0]">
      <div className="relative max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl p-12 md:p-16 overflow-hidden bg-white border border-[#E5E4E0] shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        >
          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
              Ready to Create?
            </h2>
            <p className="text-xl text-[#4A4A4A] mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who are creating stunning videos
              in minutes, not days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="group px-8 py-4 bg-[#1A1A1A] rounded-full 
                text-white font-semibold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
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

              <span className="text-[#7A7A7A] text-sm">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[#E5E4E0] bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">NeuroReel</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#4A4A4A]">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">
              Templates
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-[#7A7A7A]">
            © 2024 NeuroReel Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
