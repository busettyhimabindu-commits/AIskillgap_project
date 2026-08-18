import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

# Try MySQL first; fallback to SQLite if MySQL fails
try:
    engine = create_engine(
        settings.MYSQL_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600
    )
    # Test connection
    with engine.connect() as conn:
        logger.info("Successfully connected to MySQL database.")
    DATABASE_TYPE = "MySQL"
except Exception as e:
    logger.warning(f"MySQL connection failed ({e}). Falling back to SQLite database.")
    engine = create_engine(
        settings.SQLITE_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    DATABASE_TYPE = "SQLite"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
