import traceback
from fastapi import APIRouter, HTTPException

from app.api.schemas.upload import ProcessRequest, ProcessResponse
from app.api.routes.upload import get_file_path, update_file_processed, file_registry
from app.services.ingestion.parser import parse_document
from app.services.ingestion.chunker import chunk_text
from app.services.vector_store.memory_store import vector_store
from app.logging_config import logger

router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
async def process_file(request: ProcessRequest):
    """
    Process an uploaded file: parse, chunk, and create embeddings.

    This prepares the document for RAG retrieval during storyboard generation.
    """
    file_id = request.file_id
    logger.info(f"Process request received for file_id: {file_id}")

    # Check if file exists
    if file_id not in file_registry:
        logger.warning(f"File not found in registry: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")

    file_info = file_registry[file_id]
    logger.debug(f"File info: {file_info.filename}, type: {file_info.file_type}")

    # Check if already processed
    if file_info.processed:
        logger.info(f"File already processed: {file_id}")
        return ProcessResponse(
            file_id=file_id,
            chunks_count=file_info.chunks_count or 0,
            total_characters=0,  # Already processed
            message="File already processed",
        )

    # Get file path
    file_path = get_file_path(file_id)
    logger.info(f"Processing file at path: {file_path}")

    # Parse document
    try:
        logger.info("Starting document parsing...")
        parsed_elements = parse_document(str(file_path), file_info.file_type.value)
        logger.info(f"Parsing complete. Got {len(parsed_elements)} elements")
    except Exception as e:
        logger.error(f"Error parsing document: {type(e).__name__}: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing document: {type(e).__name__}: {str(e)}",
        )

    # Extract text from parsed elements
    full_text = "\n\n".join([el["text"] for el in parsed_elements if el.get("text")])
    logger.info(f"Extracted {len(full_text)} characters of text")

    if not full_text.strip():
        logger.warning("No text content found in document")
        raise HTTPException(
            status_code=400,
            detail="No text content found in document",
        )

    # Chunk the text
    try:
        logger.info("Starting text chunking...")
        chunks = chunk_text(full_text)
        logger.info(f"Created {len(chunks)} chunks")
    except Exception as e:
        logger.error(f"Error chunking text: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error chunking text: {str(e)}",
        )

    if not chunks:
        logger.warning("Could not create text chunks from document")
        raise HTTPException(
            status_code=400,
            detail="Could not create text chunks from document",
        )

    # Create embeddings and store in vector store
    try:
        logger.info("Creating embeddings and storing in vector store...")
        vector_store.add(file_id, chunks)
        logger.info("Embeddings created and stored successfully")
    except Exception as e:
        logger.error(f"Error creating embeddings: {type(e).__name__}: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating embeddings: {str(e)}",
        )

    # Update file registry
    update_file_processed(file_id, len(chunks))

    logger.info(f"File processing complete: {file_id} ({len(chunks)} chunks, {len(full_text)} chars)")
    return ProcessResponse(
        file_id=file_id,
        chunks_count=len(chunks),
        total_characters=len(full_text),
        message=f"Successfully processed document into {len(chunks)} chunks",
    )


@router.get("/process/{file_id}/chunks")
async def get_chunks(file_id: str, limit: int = 10):
    """Get the text chunks for a processed file (for debugging)."""
    logger.debug(f"Get chunks request: {file_id}, limit: {limit}")

    if file_id not in file_registry:
        logger.warning(f"File not found: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")

    file_info = file_registry[file_id]

    if not file_info.processed:
        logger.warning(f"File not processed yet: {file_id}")
        raise HTTPException(status_code=400, detail="File not processed yet")

    chunks = vector_store.get_chunks(file_id)
    logger.debug(f"Returning {min(limit, len(chunks))} of {len(chunks)} chunks")

    return {
        "file_id": file_id,
        "total_chunks": len(chunks),
        "chunks": chunks[:limit],
    }
