"""
Director Agent for generating video storyboards.

Uses Claude 3 Haiku for cost-effective, high-quality storyboard generation.
"""

import json
import re
from typing import List

import anthropic

from app.config import settings
from app.api.schemas.storyboard import Storyboard, Scene, VisualType, Transition, VideoStyle


SYSTEM_PROMPT = """You are an expert video storyboard director specializing in short-form educational content.
Your task is to create compelling 60-second video storyboards that transform document content into engaging visual narratives.

You must output ONLY valid JSON matching this exact schema:
{
  "title": "string (5-100 chars)",
  "style": "explainer|tutorial|summary",
  "total_duration": number (30-90 seconds),
  "target_audience": "string (optional)",
  "scenes": [
    {
      "scene_number": number (1-8),
      "duration_seconds": number (5-20),
      "script": "string (narration text, 10-100 words)",
      "visual_type": "kinetic_title|split_screen|bullet_list|image_focus|text_overlay|diagram",
      "visual_prompt": "string (image generation prompt, 10-100 words)",
      "transition": "fade|slide|zoom|cut|wipe",
      "key_points": ["optional", "array", "of", "points"]
    }
  ]
}

Guidelines:
1. Create 4-6 scenes for a 60-second video
2. Each scene should be 10-15 seconds
3. Scripts should be concise and conversational (speak naturally)
4. Visual prompts should be specific and descriptive for AI image generation
5. Start with an attention-grabbing opening (kinetic_title)
6. End with a summary or call-to-action
7. Use varied visual types for engagement
8. Match the style to the user's request (explainer, tutorial, or summary)

Output ONLY the JSON object, no markdown code blocks or additional text."""


async def generate_storyboard(
    context: List[str],
    prompt: str,
    style: str,
) -> Storyboard:
    """
    Generate a video storyboard using RAG context and LLM.

    Args:
        context: List of relevant text chunks from the document
        prompt: User's description of the video they want
        style: Video style (explainer, tutorial, summary)

    Returns:
        Validated Storyboard object
    """
    # Build the user message with context
    context_text = "\n\n---\n\n".join(context)

    user_message = f"""Based on the following document content, create a video storyboard.

DOCUMENT CONTENT:
{context_text}

USER REQUEST: {prompt}

VIDEO STYLE: {style}

Generate a complete storyboard JSON for a 60-second {style} video that addresses the user's request using the document content."""

    # Call Claude API
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    # Extract the response text
    response_text = response.content[0].text

    # Parse and validate the storyboard
    storyboard = parse_storyboard_json(response_text, style)

    return storyboard


def parse_storyboard_json(text: str, style: str) -> Storyboard:
    """
    Parse and validate the LLM's JSON response into a Storyboard.

    Handles common LLM output issues like markdown code blocks.
    """
    # Remove markdown code blocks if present
    text = text.strip()
    if text.startswith("```"):
        # Remove opening code block
        text = re.sub(r'^```(?:json)?\s*\n?', '', text)
        # Remove closing code block
        text = re.sub(r'\n?```\s*$', '', text)

    # Try to parse JSON
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        # Try to extract JSON from the text
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            try:
                data = json.loads(json_match.group())
            except json.JSONDecodeError:
                raise ValueError(f"Failed to parse storyboard JSON: {e}")
        else:
            raise ValueError(f"No valid JSON found in response: {e}")

    # Ensure style matches request
    data["style"] = style

    # Validate and fix scenes
    if "scenes" not in data or not data["scenes"]:
        raise ValueError("Storyboard must contain scenes")

    validated_scenes = []
    for i, scene in enumerate(data["scenes"]):
        # Ensure required fields
        scene["scene_number"] = scene.get("scene_number", i + 1)

        # Validate visual_type
        visual_type = scene.get("visual_type", "text_overlay")
        if visual_type not in [v.value for v in VisualType]:
            scene["visual_type"] = "text_overlay"

        # Validate transition
        transition = scene.get("transition", "fade")
        if transition not in [t.value for t in Transition]:
            scene["transition"] = "fade"

        # Ensure duration is reasonable
        duration = scene.get("duration_seconds", 10)
        scene["duration_seconds"] = max(5, min(20, float(duration)))

        # Ensure script and visual_prompt exist
        if not scene.get("script"):
            scene["script"] = "Content from the document..."
        if not scene.get("visual_prompt"):
            scene["visual_prompt"] = "Educational visual representing the content"

        validated_scenes.append(scene)

    data["scenes"] = validated_scenes

    # Calculate total duration
    total_duration = sum(s["duration_seconds"] for s in validated_scenes)
    data["total_duration"] = total_duration

    # Ensure title exists
    if not data.get("title"):
        data["title"] = "Educational Video"

    # Create and validate Storyboard
    try:
        storyboard = Storyboard(**data)
    except Exception as e:
        raise ValueError(f"Failed to validate storyboard: {e}")

    return storyboard
