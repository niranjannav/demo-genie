"""
Render orchestrator - coordinates the video rendering pipeline.

Flow:
1. Generate images for each scene (Gemini)
2. Generate TTS audio for each scene (ElevenLabs)
3. Call Remotion service to compose final video
4. Track status throughout the process
"""

import asyncio
import uuid
from pathlib import Path
from typing import Dict, Optional

import httpx

from app.api.schemas.render import (
    RenderProgress,
    RenderStatus,
    SceneAsset,
)
from app.api.schemas.storyboard import Storyboard
from app.config import settings
from app.logging_config import logger
from app.services.image_gen.gemini import gemini_generator
from app.services.tts.elevenlabs import tts_generator


# In-memory job storage (replace with Redis/DB for production)
render_jobs: Dict[str, dict] = {}


class RenderOrchestrator:
    """Orchestrates the video rendering pipeline."""

    def __init__(self):
        self.images_dir = settings.images_output_path
        self.audio_dir = settings.audio_output_path
        self.videos_dir = settings.videos_output_path
        self.remotion_url = settings.remotion_service_url

    def generate_render_id(self) -> str:
        """Generate a unique render job ID."""
        return str(uuid.uuid4())[:8]

    async def start_render(
        self,
        storyboard: Storyboard,
        include_audio: bool = True,
    ) -> str:
        """
        Start a new render job.

        Args:
            storyboard: The storyboard to render
            include_audio: Whether to generate TTS audio

        Returns:
            render_id for tracking the job
        """
        render_id = self.generate_render_id()

        # Initialize job state
        render_jobs[render_id] = {
            "status": RenderStatus.PENDING,
            "progress": 0.0,
            "storyboard": storyboard.model_dump(),
            "include_audio": include_audio,
            "scene_assets": [],
            "video_url": None,
            "error": None,
            "detailed_progress": RenderProgress(
                phase="Initializing",
                images_total=len(storyboard.scenes),
                audio_total=len(storyboard.scenes) if include_audio else 0,
            ),
        }

        logger.info(f"Starting render job {render_id}: {storyboard.title}")

        # Start the render pipeline in background
        asyncio.create_task(self._execute_render(render_id, storyboard, include_audio))

        return render_id

    async def _execute_render(
        self,
        render_id: str,
        storyboard: Storyboard,
        include_audio: bool,
    ):
        """Execute the full render pipeline."""
        job = render_jobs[render_id]
        scenes = [s.model_dump() for s in storyboard.scenes]

        try:
            # Phase 1: Generate images
            job["status"] = RenderStatus.GENERATING_IMAGES
            job["detailed_progress"].phase = "Generating images"
            job["progress"] = 5.0

            image_output_dir = self.images_dir / render_id
            image_results = await gemini_generator.generate_scene_images(
                scenes=scenes,
                output_dir=image_output_dir,
                render_id=render_id,
            )

            # Check for failures
            image_failures = [r for r in image_results if not r.get("success")]
            if len(image_failures) == len(scenes):
                raise RuntimeError("All image generations failed")

            job["detailed_progress"].images_completed = sum(
                1 for r in image_results if r.get("success")
            )
            job["progress"] = 35.0

            # Phase 2: Generate audio (if requested)
            audio_results = []
            if include_audio:
                job["status"] = RenderStatus.GENERATING_AUDIO
                job["detailed_progress"].phase = "Generating voiceover"

                audio_output_dir = self.audio_dir / render_id
                audio_results = await tts_generator.generate_scene_audio(
                    scenes=scenes,
                    output_dir=audio_output_dir,
                    render_id=render_id,
                )

                job["detailed_progress"].audio_completed = sum(
                    1 for r in audio_results if r.get("success")
                )

            job["progress"] = 60.0

            # Combine image and audio results into scene assets
            scene_assets = []
            for i, scene in enumerate(scenes):
                scene_num = scene["scene_number"]

                image_result = next(
                    (r for r in image_results if r["scene_number"] == scene_num),
                    {"image_path": None}
                )
                audio_result = next(
                    (r for r in audio_results if r["scene_number"] == scene_num),
                    {"audio_path": None, "audio_duration_ms": None}
                )

                scene_assets.append(SceneAsset(
                    scene_number=scene_num,
                    image_path=image_result.get("image_path"),
                    audio_path=audio_result.get("audio_path"),
                    audio_duration_ms=audio_result.get("audio_duration_ms"),
                ))

            job["scene_assets"] = scene_assets

            # Phase 3: Render video with Remotion
            job["status"] = RenderStatus.RENDERING_VIDEO
            job["detailed_progress"].phase = "Composing video"
            job["progress"] = 70.0

            video_path = await self._call_remotion_render(
                render_id=render_id,
                storyboard=storyboard.model_dump(),
                scene_assets=[a.model_dump() for a in scene_assets],
            )

            # Success!
            job["status"] = RenderStatus.COMPLETED
            job["video_url"] = f"/api/videos/{render_id}.mp4"
            job["progress"] = 100.0
            job["detailed_progress"].phase = "Complete"
            job["detailed_progress"].video_progress = 100.0

            logger.info(f"Render {render_id} completed: {video_path}")

        except Exception as e:
            logger.error(f"Render {render_id} failed: {type(e).__name__}: {e}")
            job["status"] = RenderStatus.FAILED
            job["error"] = str(e)
            job["detailed_progress"].phase = f"Failed: {str(e)[:100]}"

    async def _call_remotion_render(
        self,
        render_id: str,
        storyboard: dict,
        scene_assets: list,
    ) -> str:
        """
        Call the Remotion render service.

        Args:
            render_id: Unique render job ID
            storyboard: Storyboard data
            scene_assets: List of scene assets with image/audio paths

        Returns:
            Path to the rendered video file
        """
        video_output = self.videos_dir / f"{render_id}.mp4"

        payload = {
            "render_id": render_id,
            "storyboard": storyboard,
            "scene_assets": scene_assets,
            "output_path": str(video_output),
            "fps": 30,
            "width": 1080,
            "height": 1920,  # Vertical video
        }

        logger.info(f"Calling Remotion service for render {render_id}")

        try:
            async with httpx.AsyncClient(timeout=600.0) as client:
                response = await client.post(
                    f"{self.remotion_url}/render",
                    json=payload,
                )

                if response.status_code != 200:
                    error_detail = response.text[:500]
                    logger.error(f"Remotion service error: {error_detail}")
                    raise RuntimeError(f"Remotion render failed: {response.status_code}")

                result = response.json()
                if not result.get("success"):
                    raise RuntimeError(result.get("error", "Unknown Remotion error"))

                return str(video_output)

        except httpx.ConnectError:
            logger.error("Cannot connect to Remotion service")
            raise RuntimeError(
                f"Cannot connect to Remotion service at {self.remotion_url}. "
                "Make sure the Remotion render server is running."
            )

    def get_job(self, render_id: str) -> Optional[dict]:
        """Get the current state of a render job."""
        return render_jobs.get(render_id)

    def get_job_status(self, render_id: str) -> Optional[dict]:
        """Get lightweight status for a render job."""
        job = render_jobs.get(render_id)
        if not job:
            return None

        return {
            "render_id": render_id,
            "status": job["status"],
            "progress": job["progress"],
            "video_url": job.get("video_url"),
            "error": job.get("error"),
        }


# Singleton instance
render_orchestrator = RenderOrchestrator()
