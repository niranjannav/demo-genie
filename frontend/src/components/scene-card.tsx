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

const sceneColors = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-purple-500",
  "from-purple-500 to-fuchsia-500",
  "from-fuchsia-500 to-pink-500",
  "from-pink-500 to-rose-500",
  "from-rose-500 to-orange-500",
];

export function SceneCard({
  sceneNumber,
  title,
  description,
  duration,
  imageUrl,
  isLeft = true,
}: SceneCardProps) {
  const colorClass = sceneColors[(sceneNumber - 1) % sceneColors.length];

  return (
    <div
      className={`scene-card relative flex items-center gap-8 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Scene number badge */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
        w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} 
        flex items-center justify-center shadow-lg animate-pulse-glow`}
      >
        <span className="text-white font-bold text-lg">{sceneNumber}</span>
      </div>

      {/* Card content */}
      <div
        className={`w-[calc(50%-3rem)] ${
          isLeft ? "text-right pr-8" : "text-left pl-8"
        }`}
      >
        <div
          className={`glass-surface rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 ${
            isLeft ? "ml-auto" : "mr-auto"
          } max-w-md`}
        >
          {/* Duration badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
            bg-gradient-to-r ${colorClass} text-white text-xs font-medium mb-4`}
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

          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

          {/* Visual hint */}
          {imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden bg-slate-800/50 aspect-video flex items-center justify-center">
              <div className={`w-full h-full bg-gradient-to-br ${colorClass} opacity-20`} />
            </div>
          )}
        </div>
      </div>

      {/* Spacer for the other side */}
      <div className="w-[calc(50%-3rem)]" />
    </div>
  );
}
