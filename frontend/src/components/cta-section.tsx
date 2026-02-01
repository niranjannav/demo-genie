"use client";

import React from "react";

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99, 102, 241, 0.2), transparent)",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl p-12 md:p-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(168, 85, 247, 0.1) 100%)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

          {/* Border gradient */}
          <div className="absolute inset-0 rounded-3xl border border-white/10" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Create?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who are creating stunning videos
              in minutes, not days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full 
                text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 
                hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
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

              <span className="text-slate-400 text-sm">
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
    <footer className="py-12 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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
            <span className="text-xl font-bold text-white">NeuroReel</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © 2024 NeuroReel Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
