"""
Schemas for video rendering API.
"""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .storyboard import Storyboard


class RenderStatus(str, Enum):
    """Status of a render job."""
    PENDING = "pending"
    GENERATING_IMAGES = "generating_images"
    GENERATING_AUDIO = "generating_audio"
    RENDERING_VIDEO = "rendering_video"
    COMPLETED = "completed"
    FAILED = "failed"


class RenderQuality(str, Enum):
    """Video render quality presets."""
    LOW = "low"       # 720p, faster
    MEDIUM = "medium"  # 1080p
    HIGH = "high"     # 1080p, higher bitrate


class RenderRequest(BaseModel):
    """Request to render a video from a storyboard."""
    storyboard: Storyboard
    quality: RenderQuality = RenderQuality.HIGH
    include_audio: bool = True  # Whether to generate TTS narration


class SceneAsset(BaseModel):
    """Generated assets for a single scene."""
    scene_number: int
    image_path: Optional[str] = None
    audio_path: Optional[str] = None
    audio_duration_ms: Optional[int] = None  # Actual TTS duration


class RenderProgress(BaseModel):
    """Detailed progress information for a render job."""
    phase: str  # Current phase description
    images_completed: int = 0
    images_total: int = 0
    audio_completed: int = 0
    audio_total: int = 0
    video_progress: float = 0.0  # 0-100 for video encoding


class RenderResponse(BaseModel):
    """Response for render status and completion."""
    render_id: str
    status: RenderStatus
    progress: float = Field(ge=0, le=100, description="Overall progress 0-100")
    message: str
    video_url: Optional[str] = None
    scene_assets: Optional[List[SceneAsset]] = None
    detailed_progress: Optional[RenderProgress] = None
    error: Optional[str] = None


class RenderStatusResponse(BaseModel):
    """Lightweight status response for polling."""
    render_id: str
    status: RenderStatus
    progress: float
    video_url: Optional[str] = None
    error: Optional[str] = None
