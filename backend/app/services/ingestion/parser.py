"""
Document parsing service using Unstructured library.

Supports: PDF, PPTX, DOCX, and images (PNG, JPG)
Uses type-specific parsers for best results.
"""

from pathlib import Path
from typing import List, Dict, Any

from app.logging_config import logger


def _check_pdf_dependencies() -> dict:
    """Check which PDF parsing dependencies are available."""
    deps = {
        "pdf2image": False,
        "pytesseract": False,
        "pdfminer": False,
        "pypdf": False,
    }

    try:
        import pdf2image
        deps["pdf2image"] = True
    except ImportError:
        pass

    try:
        import pytesseract
        deps["pytesseract"] = True
    except ImportError:
        pass

    try:
        import pdfminer
        deps["pdfminer"] = True
    except ImportError:
        pass

    try:
        import pypdf
        deps["pypdf"] = True
    except ImportError:
        pass

    return deps


def _parse_pdf(file_path: str) -> List[Any]:
    """Parse PDF with the best available method."""
    deps = _check_pdf_dependencies()
    logger.info(f"PDF dependencies available: {deps}")

    # Try partition_pdf first (best for PDFs)
    try:
        from unstructured.partition.pdf import partition_pdf

        # Determine best strategy based on available dependencies
        if deps["pdf2image"] and deps["pytesseract"]:
            # Full OCR capability available
            logger.info("Using hi_res strategy with OCR")
            return partition_pdf(
                filename=file_path,
                strategy="hi_res",
                infer_table_structure=True,
            )
        elif deps["pdfminer"] or deps["pypdf"]:
            # Text extraction available but no OCR
            logger.info("Using fast strategy (no OCR deps)")
            return partition_pdf(
                filename=file_path,
                strategy="fast",
            )
        else:
            # Basic extraction
            logger.info("Using auto strategy")
            return partition_pdf(filename=file_path)

    except ImportError:
        logger.warning("partition_pdf not available, trying generic partition")
    except Exception as e:
        logger.warning(f"partition_pdf failed: {e}, trying fallback methods")

    # Fallback: Try PyPDF2/pypdf direct extraction
    if deps["pypdf"]:
        try:
            logger.info("Attempting direct pypdf extraction")
            from pypdf import PdfReader
            from unstructured.documents.elements import Text

            reader = PdfReader(file_path)
            elements = []
            for page_num, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    elements.append(Text(text=text))

            if elements:
                logger.info(f"pypdf extracted {len(elements)} text elements")
                return elements
        except Exception as e:
            logger.warning(f"pypdf extraction failed: {e}")

    # Fallback: Try pdfminer
    if deps["pdfminer"]:
        try:
            logger.info("Attempting pdfminer extraction")
            from pdfminer.high_level import extract_text
            from unstructured.documents.elements import Text

            text = extract_text(file_path)
            if text and text.strip():
                logger.info(f"pdfminer extracted {len(text)} characters")
                return [Text(text=text)]
        except Exception as e:
            logger.warning(f"pdfminer extraction failed: {e}")

    # Final fallback: generic partition
    logger.info("Using generic partition as final fallback")
    from unstructured.partition.auto import partition
    return partition(filename=file_path)


def _parse_docx(file_path: str) -> List[Any]:
    """Parse DOCX files."""
    try:
        from unstructured.partition.docx import partition_docx
        logger.info("Using partition_docx")
        return partition_docx(filename=file_path)
    except ImportError:
        logger.warning("partition_docx not available, using generic partition")
        from unstructured.partition.auto import partition
        return partition(filename=file_path)


def _parse_pptx(file_path: str) -> List[Any]:
    """Parse PowerPoint files."""
    try:
        from unstructured.partition.pptx import partition_pptx
        logger.info("Using partition_pptx")
        return partition_pptx(filename=file_path)
    except ImportError:
        logger.warning("partition_pptx not available, using generic partition")
        from unstructured.partition.auto import partition
        return partition(filename=file_path)


def _parse_image(file_path: str) -> List[Any]:
    """Parse image files using OCR."""
    deps = _check_pdf_dependencies()

    try:
        from unstructured.partition.image import partition_image

        if deps["pytesseract"]:
            logger.info("Using partition_image with OCR")
            return partition_image(
                filename=file_path,
                strategy="hi_res",
            )
        else:
            logger.info("Using partition_image (basic)")
            return partition_image(filename=file_path)

    except ImportError:
        logger.warning("partition_image not available, using generic partition")
        from unstructured.partition.auto import partition
        return partition(filename=file_path)
    except Exception as e:
        logger.warning(f"partition_image failed: {e}")
        # Return empty if no OCR available and image parsing fails
        return []


def _parse_text(file_path: str) -> List[Any]:
    """Parse plain text files."""
    try:
        from unstructured.partition.text import partition_text
        logger.info("Using partition_text")
        return partition_text(filename=file_path)
    except ImportError:
        # Simple fallback for text files
        from unstructured.documents.elements import Text
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        return [Text(text=content)]


def parse_document(file_path: str, file_type: str) -> List[Dict[str, Any]]:
    """
    Parse a document into structured elements.

    Args:
        file_path: Path to the document file
        file_type: Type of file (pdf, pptx, docx, png, jpg, jpeg, txt)

    Returns:
        List of parsed elements with type and text content
    """
    logger.info(f"Starting document parsing: {file_path} (type: {file_type})")

    path = Path(file_path)

    if not path.exists():
        logger.error(f"File not found: {file_path}")
        raise FileNotFoundError(f"File not found: {file_path}")

    logger.debug(f"File exists, size: {path.stat().st_size} bytes")

    # Route to appropriate parser based on file type
    file_type_lower = file_type.lower()

    try:
        if file_type_lower == "pdf":
            elements = _parse_pdf(file_path)
        elif file_type_lower == "docx":
            elements = _parse_docx(file_path)
        elif file_type_lower == "pptx":
            elements = _parse_pptx(file_path)
        elif file_type_lower in ("png", "jpg", "jpeg", "image"):
            elements = _parse_image(file_path)
        elif file_type_lower in ("txt", "text"):
            elements = _parse_text(file_path)
        else:
            # Generic fallback for unknown types
            logger.warning(f"Unknown file type '{file_type}', using generic partition")
            from unstructured.partition.auto import partition
            elements = partition(filename=file_path)

        logger.info(f"Successfully parsed document, got {len(elements)} elements")

    except Exception as e:
        logger.error(f"Error during parsing: {type(e).__name__}: {e}")
        raise RuntimeError(f"Failed to parse document: {e}")

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
