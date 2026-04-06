from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Ticketing System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str
    
    # Security (JWT Auth)
    SECRET_KEY: str = "generate-a-super-secret-key-for-production-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    # AI APIs
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env")

# Instantiate the settings so it can be imported across the app
settings = Settings()
