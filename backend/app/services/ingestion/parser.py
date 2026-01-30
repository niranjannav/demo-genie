"""
Document parsing service using Unstructured library.

Supports: PDF, PPTX, DOCX, and images (PNG, JPG)
"""

from pathlib import Path
from typing import List, Dict, Any

from app.logging_config import logger


def parse_document(file_path: str, file_type: str) -> List[Dict[str, Any]]:
    """
    Parse a document into structured elements.

    Args:
        file_path: Path to the document file
        file_type: Type of file (pdf, pptx, docx, png, jpg, jpeg)

    Returns:
        List of parsed elements with type and text content
    """
    logger.info(f"Starting document parsing: {file_path} (type: {file_type})")

    path = Path(file_path)

    if not path.exists():
        logger.error(f"File not found: {file_path}")
        raise FileNotFoundError(f"File not found: {file_path}")

    logger.debug(f"File exists, size: {path.stat().st_size} bytes")

    # Import here to catch import errors
    try:
        from unstructured.partition.auto import partition
        logger.debug("Successfully imported unstructured.partition.auto")
    except ImportError as e:
        logger.error(f"Failed to import unstructured: {e}")
        raise ImportError(f"Unstructured library not properly installed: {e}")

    # Use 'fast' strategy which doesn't require extra dependencies
    # 'hi_res' requires pdf2image, pytesseract, poppler, etc.
    strategy = "fast"
    logger.info(f"Using parsing strategy: {strategy}")

    # Parse the document
    try:
        logger.debug(f"Calling partition() on {path}")
        elements = partition(
            filename=str(path),
            strategy=strategy,
        )
        logger.info(f"Successfully parsed document, got {len(elements)} elements")
    except Exception as e:
        logger.error(f"Error during partition: {type(e).__name__}: {e}")
        # Try without strategy parameter as fallback
        try:
            logger.info("Retrying partition without strategy parameter...")
            elements = partition(filename=str(path))
            logger.info(f"Fallback succeeded, got {len(elements)} elements")
        except Exception as e2:
            logger.error(f"Fallback also failed: {type(e2).__name__}: {e2}")
            raise RuntimeError(f"Failed to parse document: {e2}")

    # Convert elements to dictionaries
    parsed_elements = []
    for i, element in enumerate(elements):
        try:
            elem_type = element.category if hasattr(element, 'category') else type(element).__name__
            elem_text = str(element)
            elem_metadata = element.metadata.to_dict() if hasattr(element, 'metadata') else {}

            parsed_elements.append({
                "type": elem_type,
                "text": elem_text,
                "metadata": elem_metadata,
            })

            if i < 3:  # Log first 3 elements for debugging
                logger.debug(f"Element {i}: type={elem_type}, text_length={len(elem_text)}")
        except Exception as e:
            logger.warning(f"Error processing element {i}: {e}")
            continue

    logger.info(f"Parsing complete. Extracted {len(parsed_elements)} elements")

    if not parsed_elements:
        logger.warning("No elements extracted from document")

    return parsed_elements


def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from an image using OCR.

    This is handled automatically by Unstructured when parsing images.
    """
    logger.info(f"Extracting text from image: {file_path}")
    elements = parse_document(file_path, "image")
    text = "\n".join([el["text"] for el in elements if el.get("text")])
    logger.info(f"Extracted {len(text)} characters from image")
    return text
