from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    elevenlabs_api_key: str = ""
    remotion_service_url: str = "http://localhost:3001"
    upload_dir: str = "./uploads"
    output_dir: str = "./outputs"
    max_file_size_mb: int = 50

    # Computed properties
    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def output_path(self) -> Path:
        path = Path(self.output_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def images_output_path(self) -> Path:
        path = self.output_path / "images"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def audio_output_path(self) -> Path:
        path = self.output_path / "audio"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def videos_output_path(self) -> Path:
        path = self.output_path / "videos"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
