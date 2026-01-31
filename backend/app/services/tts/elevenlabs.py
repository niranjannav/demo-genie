"""
ElevenLabs TTS client for voice generation.

Generates natural-sounding voiceovers for video narration.
"""

import asyncio
from pathlib import Path
from typing import List, Optional

import httpx

from app.config import settings
from app.logging_config import logger

# ElevenLabs API endpoint
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

# Default voice IDs (ElevenLabs pre-made voices)
DEFAULT_VOICES = {
    "rachel": "21m00Tcm4TlvDq8ikWAM",  # American female, warm
    "drew": "29vD33N1CtxCmqQRPOHJ",    # American male, confident
    "clyde": "2EiwWnXFnvU5JabPnv8n",   # American male, deep
    "domi": "AZnzlk1XvdvUeBnXmlld",    # American female, expressive
    "bella": "EXAVITQu4vr4xnSDxMaL",   # American female, soft
}


class ElevenLabsTTS:
    """Generate speech using ElevenLabs API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.elevenlabs_api_key
        if not self.api_key:
            logger.warning("ElevenLabs API key not configured")

    def _get_headers(self) -> dict:
        """Get request headers with API key."""
        return {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
        }

    async def generate_speech(
        self,
        text: str,
        voice_id: str = "rachel",
        model_id: str = "eleven_turbo_v2_5",
        output_format: str = "mp3_44100_128",
    ) -> tuple[bytes, int]:
        """
        Generate speech audio from text.

        Args:
            text: Text to convert to speech
            voice_id: Voice name or ID (default: rachel)
            model_id: ElevenLabs model (turbo_v2_5 is fast and cost-effective)
            output_format: Audio format (mp3_44100_128 for good quality)

        Returns:
            Tuple of (audio bytes, duration in milliseconds)

        Raises:
            RuntimeError: If TTS generation fails
        """
        if not self.api_key:
            raise RuntimeError("ElevenLabs API key not configured")

        # Resolve voice name to ID
        resolved_voice_id = DEFAULT_VOICES.get(voice_id.lower(), voice_id)

        url = f"{ELEVENLABS_API_URL}/text-to-speech/{resolved_voice_id}"

        payload = {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.0,
                "use_speaker_boost": True,
            }
        }

        params = {"output_format": output_format}

        logger.info(f"Generating TTS for text: {text[:50]}...")

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    url,
                    headers=self._get_headers(),
                    json=payload,
                    params=params,
                )

                if response.status_code != 200:
                    error_detail = response.text[:500]
                    logger.error(f"ElevenLabs API error {response.status_code}: {error_detail}")
                    raise RuntimeError(f"ElevenLabs API error: {response.status_code}")

                audio_bytes = response.content

                # Estimate duration from audio size (rough estimate for MP3)
                # MP3 at 128kbps: ~16KB per second
                estimated_duration_ms = int((len(audio_bytes) / 16000) * 1000)

                logger.info(f"TTS generated: {len(audio_bytes)} bytes, ~{estimated_duration_ms}ms")

                return audio_bytes, estimated_duration_ms

        except httpx.TimeoutException:
            logger.error("ElevenLabs API request timed out")
            raise RuntimeError("TTS generation timed out")
        except Exception as e:
            logger.error(f"TTS generation failed: {type(e).__name__}: {e}")
            raise

    async def generate_scene_audio(
        self,
        scenes: List[dict],
        output_dir: Path,
        render_id: str,
        voice_id: str = "rachel",
        max_concurrent: int = 3,
    ) -> List[dict]:
        """
        Generate audio for all scenes in parallel.

        Args:
            scenes: List of scene dictionaries with script text
            output_dir: Directory to save audio files
            render_id: Unique render job ID
            voice_id: Voice to use for all scenes
            max_concurrent: Max concurrent API requests

        Returns:
            List of results with scene_number, audio_path, duration, and success status
        """
        output_dir.mkdir(parents=True, exist_ok=True)
        semaphore = asyncio.Semaphore(max_concurrent)

        async def generate_single(scene: dict) -> dict:
            """Generate audio for a single scene."""
            async with semaphore:
                scene_num = scene["scene_number"]
                script = scene.get("script", "")

                if not script:
                    logger.warning(f"Scene {scene_num} has no script, skipping TTS")
                    return {
                        "scene_number": scene_num,
                        "audio_path": None,
                        "audio_duration_ms": 0,
                        "success": True,  # Not an error, just no audio needed
                    }

                try:
                    audio_bytes, duration_ms = await self.generate_speech(
                        text=script,
                        voice_id=voice_id,
                    )

                    audio_path = output_dir / f"scene-{scene_num}.mp3"
                    audio_path.write_bytes(audio_bytes)

                    logger.info(f"Scene {scene_num} audio saved: {audio_path} ({duration_ms}ms)")

                    return {
                        "scene_number": scene_num,
                        "audio_path": str(audio_path),
                        "audio_duration_ms": duration_ms,
                        "success": True,
                    }

                except Exception as e:
                    logger.error(f"Failed to generate audio for scene {scene_num}: {e}")
                    return {
                        "scene_number": scene_num,
                        "audio_path": None,
                        "audio_duration_ms": 0,
                        "success": False,
                        "error": str(e),
                    }

        # Generate all audio concurrently
        tasks = [generate_single(scene) for scene in scenes]
        results = await asyncio.gather(*tasks)

        successful = sum(1 for r in results if r.get("success"))
        logger.info(f"Generated {successful}/{len(scenes)} audio clips for render {render_id}")

        return results


# Singleton instance
tts_generator = ElevenLabsTTS()
