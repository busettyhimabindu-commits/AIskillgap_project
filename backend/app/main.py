import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal, DATABASE_TYPE
from app.seed_data import seed_database
from app.api.routes import (
    auth_router, profile_router, resume_router,
    analysis_router, roadmap_router, jobs_router, reports_router
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
with SessionLocal() as db_session:
    seed_database(db_session)

app = FastAPI(
    title="SkillGap AI API Engine",
    description="Production-grade AI Skill Gap Analyzer & Career Roadmap REST API using FastAPI, SQLAlchemy, and Scikit-learn.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(roadmap_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "database": DATABASE_TYPE,
        "docs": "/docs"
    }
@app.get("/health")
def health():
    return {
        "status": "ok"
    }