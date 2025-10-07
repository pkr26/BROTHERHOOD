from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    APP_NAME: str = "Brotherhood API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=True)
    ENV: str = Field(default="development")

    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = Field(default="sqlite:///./brotherhood.db")

    SECRET_KEY: str = Field(default="your-super-secret-key-change-in-production-2024")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24)

    BACKEND_CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"]
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()