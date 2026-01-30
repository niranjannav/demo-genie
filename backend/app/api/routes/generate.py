import traceback
from fastapi import APIRouter, HTTPException

from app.api.schemas.storyboard import GenerateRequest, GenerateResponse
from app.api.routes.upload import file_registry
from app.services.vector_store.memory_store import vector_store
from app.services.director.agent import generate_storyboard
from app.logging_config import logger

router = APIRouter()


@router.post("/generate-storyboard", response_model=GenerateResponse)
async def create_storyboard(request: GenerateRequest):
    """
    Generate a video storyboard using RAG and LLM.

    1. Retrieves relevant context from the processed document
    2. Uses Claude Haiku to generate a structured storyboard
    3. Returns validated storyboard JSON
    """
    file_id = request.file_id
    logger.info(f"Generate storyboard request: file_id={file_id}, style={request.style}")
    logger.debug(f"Prompt: {request.prompt[:100]}...")

    # Check if file exists
    if file_id not in file_registry:
        logger.warning(f"File not found: {file_id}")
        raise HTTPException(status_code=404, detail="File not found")

    file_info = file_registry[file_id]

    # Check if file is processed
    if not file_info.processed:
        logger.warning(f"File not processed: {file_id}")
        raise HTTPException(
            status_code=400,
            detail="File not processed. Call /process endpoint first.",
        )

    # Retrieve relevant context using RAG
    try:
        logger.info("Retrieving context using RAG...")
        context_chunks = vector_store.search(
            session_id=file_id,
            query=request.prompt,
            top_k=5,
        )
        logger.info(f"Retrieved {len(context_chunks)} context chunks")
    except Exception as e:
        logger.error(f"Error retrieving context: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving context: {str(e)}",
        )

    if not context_chunks:
        logger.warning("No relevant content found in document")
        raise HTTPException(
            status_code=400,
            detail="No relevant content found in document",
        )

    # Generate storyboard using Director Agent
    try:
        logger.info("Generating storyboard using Director Agent...")
        storyboard = await generate_storyboard(
            context=context_chunks,
            prompt=request.prompt,
            style=request.style.value,
        )
        logger.info(f"Storyboard generated: {storyboard.title} ({len(storyboard.scenes)} scenes)")
    except Exception as e:
        logger.error(f"Error generating storyboard: {type(e).__name__}: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating storyboard: {str(e)}",
        )

    logger.info(f"Storyboard generation complete for file_id: {file_id}")
    return GenerateResponse(
        file_id=file_id,
        storyboard=storyboard,
        context_chunks_used=len(context_chunks),
        message="Storyboard generated successfully",
    )
