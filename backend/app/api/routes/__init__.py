from app.api.routes.auth import router as auth_router
from app.api.routes.profile import router as profile_router
from app.api.routes.resume import router as resume_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes.roadmap import router as roadmap_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.reports import router as reports_router

__all__ = [
    "auth_router",
    "profile_router",
    "resume_router",
    "analysis_router",
    "roadmap_router",
    "jobs_router",
    "reports_router",
]
