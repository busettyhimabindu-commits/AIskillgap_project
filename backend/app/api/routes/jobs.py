from fastapi import HTTPException
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import JobRole, Skill
from app.schemas.all_schemas import JobRoleOut, SkillOut

router = APIRouter(tags=["Jobs & Skills Search"])

@router.get("/jobs", response_model=List[JobRoleOut])
def search_jobs(
    q: Optional[str] = Query(None, description="Search query for job role title or skills"),
    category: Optional[str] = Query(None, description="Filter by category e.g. Web, AI/ML, Cloud"),
    db: Session = Depends(get_db)
):
    query = db.query(JobRole)
    if category and category.lower() != "all":
        query = query.filter(JobRole.category.ilike(f"%{category}%"))
    
    if q and q.strip():
        search_str = f"%{q.strip()}%"
        query = query.filter(
            (JobRole.title.ilike(search_str)) | 
            (JobRole.description.ilike(search_str))
        )

    roles = query.all()
    return [JobRoleOut.model_validate(r) for r in roles]

@router.get("/jobs/{job_id}", response_model=JobRoleOut)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    role = db.query(JobRole).filter(JobRole.id == job_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found.")
    return JobRoleOut.model_validate(role)

@router.get("/skills/search")
def search_skills(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    if category and category.lower() != "all":
        query = query.filter(Skill.category.ilike(f"%{category}%"))
    if q and q.strip():
        query = query.filter(Skill.name.ilike(f"%{q.strip()}%"))

    skills = query.limit(50).all()
    return [{"id": s.id, "name": s.name, "category": s.category} for s in skills]
