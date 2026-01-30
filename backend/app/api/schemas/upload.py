from pydantic import BaseModel
from typing import Optional
from enum import Enum


class FileType(str, Enum):
    PDF = "pdf"
    PPTX = "pptx"
    DOCX = "docx"
    PNG = "png"
    JPG = "jpg"
    JPEG = "jpeg"


class UploadResponse(BaseModel):
    """Response after file upload."""

    file_id: str
    filename: str
    file_type: FileType
    size_bytes: int
    message: str


class ProcessRequest(BaseModel):
    """Request to process an uploaded file."""

    file_id: str


class ProcessResponse(BaseModel):
    """Response after processing a file."""

    file_id: str
    chunks_count: int
    total_characters: int
    message: str


class FileInfo(BaseModel):
    """Information about an uploaded file."""

    file_id: str
    filename: str
    file_type: FileType
    size_bytes: int
    processed: bool = False
    chunks_count: Optional[int] = None
