from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600
    )

    with engine.connect() as conn:
        logger.info("Successfully connected to PostgreSQL database.")

    DATABASE_TYPE = "PostgreSQL"

except Exception as e:
    logger.error(f"PostgreSQL database connection failed: {e}")
    raise


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()