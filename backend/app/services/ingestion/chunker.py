"""
Text chunking service for creating RAG-ready segments.

Uses semantic chunking with configurable chunk size and overlap.
"""

from typing import List
import re

from app.logging_config import logger


# Chunking configuration
CHUNK_SIZE = 500  # Target characters per chunk
CHUNK_OVERLAP = 50  # Overlap between chunks for context continuity
MIN_CHUNK_SIZE = 100  # Minimum chunk size to avoid tiny fragments


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """
    Split text into overlapping chunks for embedding.

    Uses paragraph boundaries when possible, falls back to sentence
    boundaries, and finally character splitting for long blocks.

    Args:
        text: Full text to chunk
        chunk_size: Target characters per chunk
        overlap: Characters to overlap between chunks

    Returns:
        List of text chunks
    """
    logger.info(f"Starting text chunking: {len(text)} characters, chunk_size={chunk_size}, overlap={overlap}")

    if not text or not text.strip():
        logger.warning("Empty text provided for chunking")
        return []

    # Clean and normalize text
    text = normalize_text(text)
    logger.debug(f"Normalized text length: {len(text)}")

    # First, split by paragraphs (double newlines)
    paragraphs = re.split(r'\n\s*\n', text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]
    logger.debug(f"Split into {len(paragraphs)} paragraphs")

    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        # If paragraph fits in current chunk, add it
        if len(current_chunk) + len(paragraph) + 1 <= chunk_size:
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph
        else:
            # Save current chunk if it meets minimum size
            if len(current_chunk) >= MIN_CHUNK_SIZE:
                chunks.append(current_chunk)
                # Start new chunk with overlap from previous
                overlap_text = get_overlap_text(current_chunk, overlap)
                current_chunk = overlap_text + "\n\n" + paragraph if overlap_text else paragraph
            else:
                # Current chunk too small, try to extend it
                if current_chunk:
                    current_chunk += "\n\n" + paragraph
                else:
                    current_chunk = paragraph

            # If paragraph itself is too long, split by sentences
            if len(current_chunk) > chunk_size * 1.5:
                sentence_chunks = split_long_paragraph(current_chunk, chunk_size, overlap)
                if len(sentence_chunks) > 1:
                    chunks.extend(sentence_chunks[:-1])
                    current_chunk = sentence_chunks[-1]

    # Don't forget the last chunk
    if current_chunk and len(current_chunk) >= MIN_CHUNK_SIZE:
        chunks.append(current_chunk)
    elif current_chunk and chunks:
        # Append small final chunk to previous
        chunks[-1] += "\n\n" + current_chunk

    logger.info(f"Chunking complete: created {len(chunks)} chunks")
    for i, chunk in enumerate(chunks[:3]):  # Log first 3 chunks
        logger.debug(f"Chunk {i}: {len(chunk)} chars, preview: '{chunk[:50]}...'")

    return chunks


def split_long_paragraph(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Split a long paragraph by sentences."""
    logger.debug(f"Splitting long paragraph: {len(text)} chars")

    # Split by sentence boundaries
    sentences = re.split(r'(?<=[.!?])\s+', text)

    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 <= chunk_size:
            if current_chunk:
                current_chunk += " " + sentence
            else:
                current_chunk = sentence
        else:
            if current_chunk:
                chunks.append(current_chunk)
                overlap_text = get_overlap_text(current_chunk, overlap)
                current_chunk = overlap_text + " " + sentence if overlap_text else sentence
            else:
                # Single sentence too long, split by words
                current_chunk = sentence

    if current_chunk:
        chunks.append(current_chunk)

    logger.debug(f"Split into {len(chunks)} sentence-based chunks")
    return chunks


def get_overlap_text(text: str, overlap: int) -> str:
    """Get the last 'overlap' characters of text, breaking at word boundary."""
    if len(text) <= overlap:
        return text

    # Get last 'overlap' characters
    overlap_section = text[-overlap:]

    # Find first word boundary to avoid cutting words
    space_idx = overlap_section.find(' ')
    if space_idx > 0:
        return overlap_section[space_idx + 1:]

    return overlap_section


def normalize_text(text: str) -> str:
    """Normalize text by cleaning whitespace and special characters."""
    # Replace multiple whitespace with single space
    text = re.sub(r'[ \t]+', ' ', text)
    # Replace multiple newlines with double newline
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove leading/trailing whitespace from lines
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    return text.strip()
