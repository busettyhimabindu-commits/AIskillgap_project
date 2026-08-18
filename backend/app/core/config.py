import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillGap AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "86dcd5732b6e46c394a611cc91b44c78_skillgap_ai_super_secret_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Primary MySQL URL with SQLite fallback
    MYSQL_DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/skillgap_db")
    SQLITE_DATABASE_URL: str = "sqlite:///./skillgap.db"

    class Config:
        case_sensitive = True

settings = Settings()
