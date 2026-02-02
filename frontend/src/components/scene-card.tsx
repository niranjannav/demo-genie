"use client";

import React from "react";

interface SceneCardProps {
  sceneNumber: number;
  title: string;
  description: string;
  duration: string;
  imageUrl?: string;
  isLeft?: boolean;
}

// Scene colors: amber, green, red based on scene context
const sceneStyles = [
  { bg: "bg-[#E8EDE8]", text: "text-[#4A5D4A]", border: "border-[#4A5D4A]" }, // Scene 1 - green (hook)
  { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#D97706]" }, // Scene 2 - amber (problem)
  { bg: "bg-[#E8EDE8]", text: "text-[#4A5D4A]", border: "border-[#4A5D4A]" }, // Scene 3 - green (solution)
  { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#D97706]" }, // Scene 4 - amber (magic)
  { bg: "bg-[#E8EDE8]", text: "text-[#4A5D4A]", border: "border-[#4A5D4A]" }, // Scene 5 - green (trust)
  { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#DC2626]" }, // Scene 6 - red (CTA)
];

export function SceneCard({
  sceneNumber,
  title,
  description,
  duration,
  isLeft = true,
}: SceneCardProps) {
  const style = sceneStyles[(sceneNumber - 1) % sceneStyles.length];

  return (
    <div
      className={`scene-card relative flex items-center gap-8 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Scene number badge */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
        w-12 h-12 rounded-full bg-white ${style.border} border-2
        flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}
      >
        <span className={`${style.text} font-bold text-lg`}>{sceneNumber}</span>
      </div>

      {/* Card content */}
      <div
        className={`w-[calc(50%-3rem)] ${
          isLeft ? "text-right pr-8" : "text-left pl-8"
        }`}
      >
        <div
          className={`bg-white rounded-2xl p-6 border border-[#E5E4E0] 
          shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] 
          transition-all duration-300 ${
            isLeft ? "ml-auto" : "mr-auto"
          } max-w-md`}
        >
          {/* Duration badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
            ${style.bg} ${style.text} text-xs font-medium mb-4 border ${style.border}/30`}
          >
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {duration}
          </div>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{title}</h3>
          <p className="text-[#4A4A4A] text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Spacer for the other side */}
      <div className="w-[calc(50%-3rem)]" />
    </div>
  );
}
