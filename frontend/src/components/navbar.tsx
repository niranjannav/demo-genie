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
          ? "py-3 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E4E0] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-10 h-10 rounded-xl bg-[#1A1A1A] 
            flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
            group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-shadow"
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
          <span className="text-xl font-bold text-[#1A1A1A]">NeuroReel</span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors text-sm font-medium"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="#templates"
            className="text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors text-sm font-medium"
          >
            Templates
          </a>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors text-sm font-medium">
            Sign In
          </button>
          <button
            className="px-5 py-2.5 bg-[#1A1A1A] rounded-full 
            text-white font-medium text-sm shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
