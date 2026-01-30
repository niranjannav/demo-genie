from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class VideoStyle(str, Enum):
    EXPLAINER = "explainer"
    TUTORIAL = "tutorial"
    SUMMARY = "summary"


class VisualType(str, Enum):
    KINETIC_TITLE = "kinetic_title"
    SPLIT_SCREEN = "split_screen"
    BULLET_LIST = "bullet_list"
    IMAGE_FOCUS = "image_focus"
    TEXT_OVERLAY = "text_overlay"
    DIAGRAM = "diagram"


class Transition(str, Enum):
    FADE = "fade"
    SLIDE = "slide"
    ZOOM = "zoom"
    CUT = "cut"
    WIPE = "wipe"


class Scene(BaseModel):
    """A single scene in the storyboard."""

    scene_number: int = Field(..., ge=1, le=10)
    duration_seconds: float = Field(..., ge=3, le=30)
    script: str = Field(..., min_length=10, max_length=500)
    visual_type: VisualType
    visual_prompt: str = Field(..., min_length=10, max_length=300)
    transition: Transition = Transition.FADE
    key_points: Optional[List[str]] = None


class Storyboard(BaseModel):
    """Complete storyboard for a video."""

    title: str = Field(..., min_length=5, max_length=100)
    style: VideoStyle
    total_duration: float = Field(..., ge=30, le=90)
    target_audience: Optional[str] = None
    scenes: List[Scene] = Field(..., min_length=3, max_length=8)

    def model_post_init(self, __context):
        # Validate total duration matches sum of scene durations
        calculated_duration = sum(scene.duration_seconds for scene in self.scenes)
        # Allow some tolerance for rounding
        if abs(calculated_duration - self.total_duration) > 1:
            # Update total_duration to match actual scene durations
            object.__setattr__(self, 'total_duration', calculated_duration)


class GenerateRequest(BaseModel):
    """Request to generate a storyboard."""

    file_id: str
    prompt: str = Field(..., min_length=10, max_length=500)
    style: VideoStyle = VideoStyle.EXPLAINER


class GenerateResponse(BaseModel):
    """Response with generated storyboard."""

    file_id: str
    storyboard: Storyboard
    context_chunks_used: int
    message: str
