"""
Video rendering API routes.

Endpoints:
- POST /render-video: Start a new render job
- GET /render-status/{render_id}: Get render job status
- GET /videos/{filename}: Serve rendered videos
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.api.schemas.render import (
    RenderRequest,
    RenderResponse,
    RenderStatus,
    RenderStatusResponse,
)
from app.config import settings
from app.logging_config import logger
from app.services.render.orchestrator import render_orchestrator

router = APIRouter()


@router.post("/render-video", response_model=RenderResponse)
async def start_video_render(request: RenderRequest):
    """
    Start rendering a video from a storyboard.

    The rendering process:
    1. Generates images for each scene using Gemini API
    2. Generates TTS audio for narration using ElevenLabs
    3. Composes the final video using Remotion

    Returns a render_id that can be used to poll for status.
    """
    logger.info(f"Render request received: {request.storyboard.title}")

    try:
        render_id = await render_orchestrator.start_render(
            storyboard=request.storyboard,
            include_audio=request.include_audio,
        )

        return RenderResponse(
            render_id=render_id,
            status=RenderStatus.PENDING,
            progress=0.0,
            message=f"Render job started. Poll /api/render-status/{render_id} for updates.",
        )

    except Exception as e:
        logger.error(f"Failed to start render: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start render: {str(e)}",
        )


@router.get("/render-status/{render_id}", response_model=RenderResponse)
async def get_render_status(render_id: str):
    """
    Get the current status of a render job.

    Poll this endpoint to track render progress.
    """
    job = render_orchestrator.get_job(render_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail=f"Render job '{render_id}' not found",
        )

    return RenderResponse(
        render_id=render_id,
        status=job["status"],
        progress=job["progress"],
        message=job["detailed_progress"].phase if job.get("detailed_progress") else "",
        video_url=job.get("video_url"),
        scene_assets=job.get("scene_assets"),
        detailed_progress=job.get("detailed_progress"),
        error=job.get("error"),
    )


@router.get("/render-status-light/{render_id}", response_model=RenderStatusResponse)
async def get_render_status_light(render_id: str):
    """
    Get lightweight status for polling (smaller payload).
    """
    status = render_orchestrator.get_job_status(render_id)

    if not status:
        raise HTTPException(
            status_code=404,
            detail=f"Render job '{render_id}' not found",
        )

    return RenderStatusResponse(**status)


@router.get("/videos/{filename}")
async def serve_video(filename: str):
    """
    Serve a rendered video file.

    Videos are served with proper content-type for browser playback.
    """
    # Security: prevent directory traversal
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    video_path = settings.videos_output_path / filename

    if not video_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Video '{filename}' not found",
        )

    logger.debug(f"Serving video: {video_path}")

    return FileResponse(
        path=video_path,
        media_type="video/mp4",
        filename=filename,
    )


@router.get("/render-assets/{render_id}/{asset_type}/{filename}")
async def serve_render_asset(render_id: str, asset_type: str, filename: str):
    """
    Serve intermediate render assets (images, audio).

    Useful for debugging and previewing individual scenes.
    """
    # Security: validate inputs
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    if asset_type not in ("images", "audio"):
        raise HTTPException(status_code=400, detail="Invalid asset type")

    if asset_type == "images":
        asset_path = settings.images_output_path / render_id / filename
        media_type = "image/png"
    else:
        asset_path = settings.audio_output_path / render_id / filename
        media_type = "audio/mpeg"

    if not asset_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Asset not found: {asset_type}/{render_id}/{filename}",
        )

    return FileResponse(
        path=asset_path,
        media_type=media_type,
        filename=filename,
    )
