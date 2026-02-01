"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass-surface"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 
            flex items-center justify-center shadow-lg shadow-indigo-500/25 
            group-hover:shadow-indigo-500/40 transition-shadow"
          >
            <svg
              className="w-6 h-6 text-white"
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
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="#templates"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Templates
          </a>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-slate-300 hover:text-white transition-colors text-sm font-medium">
            Sign In
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full 
            text-white font-medium text-sm shadow-lg shadow-indigo-500/20 
            hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
