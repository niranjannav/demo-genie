"""
Gemini API client for image generation.

Uses Google's Gemini 2.0 Flash model with image generation capabilities.
"""

import asyncio
import base64
from pathlib import Path
from typing import List, Optional

import httpx

from app.config import settings
from app.logging_config import logger

# Gemini API endpoint for image generation
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"


class GeminiImageGenerator:
    """Generate images using Google's Gemini API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.gemini_api_key
        if not self.api_key:
            logger.warning("Gemini API key not configured")

    def _get_headers(self) -> dict:
        """Get request headers with API key."""
        return {
            "Content-Type": "application/json",
        }

    def _get_url(self) -> str:
        """Get API URL with key."""
        return f"{GEMINI_API_URL}?key={self.api_key}"

    async def generate_image(
        self,
        prompt: str,
        style_hint: str = "high quality digital illustration",
        aspect_ratio: str = "9:16",  # Vertical for TikTok/Reels
    ) -> bytes:
        """
        Generate a single image from a text prompt.

        Args:
            prompt: Visual description for the image
            style_hint: Additional style guidance
            aspect_ratio: Image aspect ratio (9:16 for vertical video)

        Returns:
            PNG image as bytes

        Raises:
            RuntimeError: If image generation fails
        """
        if not self.api_key:
            raise RuntimeError("Gemini API key not configured")

        # Enhance prompt with style hint and video context
        full_prompt = f"{style_hint}, suitable for short-form video content: {prompt}"

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"],
            }
        }

        logger.info(f"Generating image with prompt: {prompt[:100]}...")

        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                response = await client.post(
                    self._get_url(),
                    headers=self._get_headers(),
                    json=payload
                )

                if response.status_code != 200:
                    error_detail = response.text[:500]
                    logger.error(f"Gemini API error {response.status_code}: {error_detail}")
                    raise RuntimeError(f"Gemini API error: {response.status_code}")

                data = response.json()

                # Extract image from response
                candidates = data.get("candidates", [])
                if not candidates:
                    raise RuntimeError("No candidates in Gemini response")

                parts = candidates[0].get("content", {}).get("parts", [])

                # Find the image part
                for part in parts:
                    if "inlineData" in part:
                        image_data = part["inlineData"].get("data")
                        if image_data:
                            logger.info("Image generated successfully")
                            return base64.b64decode(image_data)

                raise RuntimeError("No image data in Gemini response")

        except httpx.TimeoutException:
            logger.error("Gemini API request timed out")
            raise RuntimeError("Image generation timed out")
        except Exception as e:
            logger.error(f"Image generation failed: {type(e).__name__}: {e}")
            raise

    async def generate_scene_images(
        self,
        scenes: List[dict],
        output_dir: Path,
        render_id: str,
        max_concurrent: int = 3,
    ) -> List[dict]:
        """
        Generate images for all scenes in parallel.

        Args:
            scenes: List of scene dictionaries with visual_prompt
            output_dir: Directory to save images
            render_id: Unique render job ID
            max_concurrent: Max concurrent API requests

        Returns:
            List of results with scene_number, image_path, and success status
        """
        output_dir.mkdir(parents=True, exist_ok=True)
        semaphore = asyncio.Semaphore(max_concurrent)

        # Style hints based on visual type
        style_hints = {
            "kinetic_title": "bold modern typography design, title card style",
            "split_screen": "comparison infographic layout, clean design",
            "bullet_list": "clean infographic with visual elements",
            "image_focus": "detailed high quality illustration, cinematic",
            "text_overlay": "atmospheric background image with space for text overlay",
            "diagram": "educational diagram, clear labels and icons",
        }

        async def generate_single(scene: dict) -> dict:
            """Generate image for a single scene."""
            async with semaphore:
                scene_num = scene["scene_number"]
                visual_type = scene.get("visual_type", "image_focus")
                visual_prompt = scene.get("visual_prompt", "")

                if not visual_prompt:
                    logger.warning(f"Scene {scene_num} has no visual prompt, using script")
                    visual_prompt = scene.get("script", "educational content")[:200]

                style = style_hints.get(visual_type, "high quality digital illustration")

                try:
                    image_bytes = await self.generate_image(
                        prompt=visual_prompt,
                        style_hint=style,
                    )

                    image_path = output_dir / f"scene-{scene_num}.png"
                    image_path.write_bytes(image_bytes)

                    logger.info(f"Scene {scene_num} image saved: {image_path}")

                    return {
                        "scene_number": scene_num,
                        "image_path": str(image_path),
                        "success": True,
                    }

                except Exception as e:
                    logger.error(f"Failed to generate image for scene {scene_num}: {e}")
                    return {
                        "scene_number": scene_num,
                        "image_path": None,
                        "success": False,
                        "error": str(e),
                    }

        # Generate all images concurrently
        tasks = [generate_single(scene) for scene in scenes]
        results = await asyncio.gather(*tasks)

        successful = sum(1 for r in results if r.get("success"))
        logger.info(f"Generated {successful}/{len(scenes)} images for render {render_id}")

        return results


# Singleton instance
gemini_generator = GeminiImageGenerator()
