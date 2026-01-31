/**
 * Remotion Render Server
 *
 * Express server that accepts render requests from the Python backend
 * and uses Remotion to compose videos.
 */

import express from "express";
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { RenderRequest } from "../src/types/storyboard";

const app = express();
app.use(express.json({ limit: "100mb" }));

const PORT = process.env.PORT || 3001;
const FPS = 30;

// Cache the bundle location
let bundleLocation: string | null = null;

async function getBundleLocation(): Promise<string> {
  if (bundleLocation) {
    return bundleLocation;
  }

  console.log("Bundling Remotion project...");
  const entryPoint = path.resolve(__dirname, "../src/index.ts");

  bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log(`Bundle created at: ${bundleLocation}`);
  return bundleLocation;
}

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "remotion-renderer",
    bundled: bundleLocation !== null,
  });
});

/**
 * Render video endpoint
 */
app.post("/render", async (req, res) => {
  const startTime = Date.now();
  const request = req.body as RenderRequest;

  const {
    render_id,
    storyboard,
    scene_assets,
    output_path,
    fps = FPS,
    width = 1080,
    height = 1920,
  } = request;

  console.log(`\n=== Starting render: ${render_id} ===`);
  console.log(`Title: ${storyboard.title}`);
  console.log(`Scenes: ${storyboard.scenes.length}`);
  console.log(`Output: ${output_path}`);

  try {
    // Ensure output directory exists
    const outputDir = path.dirname(output_path);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get or create bundle
    const serveUrl = await getBundleLocation();

    // Calculate total duration
    const totalDurationSeconds = storyboard.scenes.reduce(
      (sum, scene) => sum + scene.duration_seconds,
      0
    );
    const durationInFrames = Math.round(totalDurationSeconds * fps);

    console.log(`Duration: ${totalDurationSeconds}s (${durationInFrames} frames)`);

    // Prepare input props
    const inputProps = {
      storyboard,
      sceneAssets: scene_assets,
    };

    // Select composition with overrides
    console.log("Selecting composition...");
    const composition = await selectComposition({
      serveUrl,
      id: "NeuroReelVideo",
      inputProps,
    });

    // Override composition settings
    composition.durationInFrames = durationInFrames;
    composition.fps = fps;
    composition.width = width;
    composition.height = height;

    console.log(`Composition ready: ${composition.width}x${composition.height} @ ${composition.fps}fps`);

    // Render the video
    console.log("Rendering video...");
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: output_path,
      inputProps,
      // Video quality settings
      videoBitrate: "8M", // Good quality for social media
      audioBitrate: "192k",
      // Performance settings
      concurrency: 2,
      // Progress logging
      onProgress: ({ progress }) => {
        const percent = Math.round(progress * 100);
        if (percent % 10 === 0) {
          console.log(`Render progress: ${percent}%`);
        }
      },
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n=== Render complete: ${render_id} (${duration}s) ===`);

    // Verify output exists
    if (!fs.existsSync(output_path)) {
      throw new Error("Output file was not created");
    }

    const stats = fs.statSync(output_path);
    console.log(`Output size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    res.json({
      success: true,
      render_id,
      output_path,
      duration_seconds: parseFloat(duration),
      file_size_bytes: stats.size,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Render failed: ${errorMessage}`);

    res.status(500).json({
      success: false,
      render_id,
      error: errorMessage,
    });
  }
});

/**
 * Preview endpoint - returns composition info without rendering
 */
app.post("/preview", async (req, res) => {
  const { storyboard } = req.body;

  try {
    const totalDuration = storyboard.scenes.reduce(
      (sum: number, scene: any) => sum + scene.duration_seconds,
      0
    );

    res.json({
      title: storyboard.title,
      scenes: storyboard.scenes.length,
      total_duration_seconds: totalDuration,
      total_frames: Math.round(totalDuration * FPS),
      fps: FPS,
      resolution: "1080x1920",
    });

  } catch (error) {
    res.status(400).json({
      error: "Invalid storyboard data",
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n========================================`);
  console.log(`  Remotion Render Server`);
  console.log(`  Port: ${PORT}`);
  console.log(`  FPS: ${FPS}`);
  console.log(`  Resolution: 1080x1920 (vertical)`);
  console.log(`========================================\n`);

  // Pre-bundle on startup for faster first render
  console.log("Pre-bundling for faster first render...");
  try {
    await getBundleLocation();
    console.log("Pre-bundle complete. Server ready!\n");
  } catch (error) {
    console.error("Warning: Pre-bundle failed. Will bundle on first request.");
    console.error(error);
  }
});
