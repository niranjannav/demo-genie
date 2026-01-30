from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import upload, process, generate
from app.config import settings
from app.logging_config import logger

app = FastAPI(
    title="NeuroReel Studio API",
    description="AI-powered educational video generation platform",
    version="0.1.0",
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {type(exc).__name__}: {exc}")
    logger.error(f"Request path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {type(exc).__name__}"},
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("NeuroReel Studio API starting up...")
    logger.info(f"Upload directory: {settings.upload_path}")
    logger.info(f"Max file size: {settings.max_file_size_mb}MB")
    logger.info("=" * 50)


# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(process.router, prefix="/api", tags=["process"])
app.include_router(generate.router, prefix="/api", tags=["generate"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    logger.debug("Health check requested")
    return {
        "status": "healthy",
        "version": "0.1.0",
        "upload_dir": str(settings.upload_path),
    }


@app.get("/")
async def root():
    """Root endpoint."""
    logger.debug("Root endpoint requested")
    return {
        "message": "NeuroReel Studio API",
        "docs": "/docs",
        "health": "/health",
    }
