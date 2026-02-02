import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroReel Studio | AI-Powered Video Creation",
  description: "Transform your ideas into stunning short-form videos in seconds. NeuroReel Studio uses AI to create professional TikTok and Reel-style content.",
  keywords: ["AI video", "content creation", "marketing", "TikTok", "Reels", "video editor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
