import uuid
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import settings
from app.api.schemas.upload import UploadResponse, FileType, FileInfo
from app.logging_config import logger

router = APIRouter()

# In-memory file registry (for MVP - no database)
file_registry: dict[str, FileInfo] = {}

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".pptx", ".docx", ".png", ".jpg", ".jpeg"}


def get_file_type(filename: str) -> FileType:
    """Get FileType enum from filename extension."""
    ext = Path(filename).suffix.lower()
    extension_map = {
        ".pdf": FileType.PDF,
        ".pptx": FileType.PPTX,
        ".docx": FileType.DOCX,
        ".png": FileType.PNG,
        ".jpg": FileType.JPG,
        ".jpeg": FileType.JPEG,
    }
    return extension_map.get(ext)


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a document or image file.

    Accepts: PDF, PPTX, DOCX, PNG, JPG, JPEG
    Returns: file_id for subsequent operations
    """
    logger.info(f"Upload request received: {file.filename}")

    # Validate file extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(f"Rejected file with invalid extension: {ext}")
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file content
    content = await file.read()
    logger.debug(f"Read file content: {len(content)} bytes")

    # Check file size
    if len(content) > settings.max_file_size_bytes:
        logger.warning(f"Rejected file too large: {len(content)} bytes")
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.max_file_size_mb}MB",
        )

    # Generate unique file ID
    file_id = str(uuid.uuid4())
    logger.debug(f"Generated file_id: {file_id}")

    # Create safe filename with file_id prefix
    safe_filename = f"{file_id}_{file.filename}"
    file_path = settings.upload_path / safe_filename

    # Save file to disk
    try:
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        logger.info(f"File saved to disk: {file_path}")
    except Exception as e:
        logger.error(f"Failed to save file to disk: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Get file type
    file_type = get_file_type(file.filename)
    logger.debug(f"Detected file type: {file_type}")

    # Register file in memory
    file_info = FileInfo(
        file_id=file_id,
        filename=file.filename,
        file_type=file_type,
        size_bytes=len(content),
        processed=False,
    )
    file_registry[file_id] = file_info
    logger.info(f"File registered successfully: {file_id} ({file.filename})")

    return UploadResponse(
        file_id=file_id,
        filename=file.filename,
        file_type=file_type,
        size_bytes=len(content),
        message="File uploaded successfully",
    )


@router.get("/files/{file_id}", response_model=FileInfo)
async def get_file_info(file_id: str):
    """Get information about an uploaded file."""
    logger.debug(f"Get file info request: {file_id}")
    if file_id not in file_registry:
        logger.warning(f"File not found: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")
    return file_registry[file_id]


@router.get("/files/{file_id}/download")
async def download_file(file_id: str):
    """Download an uploaded file (for PDF viewer)."""
    from fastapi.responses import FileResponse

    logger.debug(f"Download request: {file_id}")

    if file_id not in file_registry:
        logger.warning(f"File not found for download: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")

    file_info = file_registry[file_id]
    safe_filename = f"{file_id}_{file_info.filename}"
    file_path = settings.upload_path / safe_filename

    if not file_path.exists():
        logger.error(f"File not found on disk: {file_path}")
        raise HTTPException(status_code=404, detail="File not found on disk")

    # Determine content type
    content_types = {
        FileType.PDF: "application/pdf",
        FileType.PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        FileType.DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        FileType.PNG: "image/png",
        FileType.JPG: "image/jpeg",
        FileType.JPEG: "image/jpeg",
    }

    logger.info(f"Serving file download: {file_info.filename}")
    return FileResponse(
        path=file_path,
        filename=file_info.filename,
        media_type=content_types.get(file_info.file_type, "application/octet-stream"),
    )


def get_file_path(file_id: str) -> Path:
    """Get the file path for a given file_id."""
    logger.debug(f"Getting file path for: {file_id}")
    if file_id not in file_registry:
        logger.error(f"File not found in registry: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")

    file_info = file_registry[file_id]
    safe_filename = f"{file_id}_{file_info.filename}"
    file_path = settings.upload_path / safe_filename
    logger.debug(f"File path resolved: {file_path}")
    return file_path


def update_file_processed(file_id: str, chunks_count: int):
    """Mark a file as processed and store chunk count."""
    if file_id in file_registry:
        file_registry[file_id].processed = True
        file_registry[file_id].chunks_count = chunks_count
        logger.info(f"File marked as processed: {file_id} ({chunks_count} chunks)")
