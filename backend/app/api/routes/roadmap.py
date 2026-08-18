from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, JobRole, RoadmapItem, StudentProfile, SkillGapAnalysis
from app.schemas.all_schemas import RoadmapResponse, RoadmapItemOut

router = APIRouter(prefix="/roadmap", tags=["Career Roadmap"])

@router.get("", response_model=RoadmapResponse)
def get_user_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(RoadmapItem).filter(
        RoadmapItem.user_id == current_user.id
    ).order_by(RoadmapItem.week_number.asc()).all()

    if not items:
        # Auto-generate default roadmap if none exists
        return generate_roadmap(target_role=current_user.target_role or "Full Stack Developer", current_user=current_user, db=db)

    total_items = len(items)
    completed_items = sum(1 for i in items if i.is_completed)
    progress_percentage = round((completed_items / total_items) * 100, 1) if total_items > 0 else 0.0

    # Fetch job role recommendations
    job_role = db.query(JobRole).filter(JobRole.title.ilike(f"%{current_user.target_role}%")).first()
    recommended_certs = job_role.recommended_certs_json if job_role and job_role.recommended_certs_json else ["AWS Certified Developer", "Meta Front-End Developer"]
    recommended_projects = job_role.recommended_projects_json if job_role and job_role.recommended_projects_json else [
        {"title": "Full Stack SaaS Application", "description": "Build a SaaS app with authentication, database, and payment processing."}
    ]

    return RoadmapResponse(
        target_role=current_user.target_role or "Software Engineer",
        total_items=total_items,
        completed_items=completed_items,
        progress_percentage=progress_percentage,
        items=[RoadmapItemOut.model_validate(i) for i in items],
        recommended_certs=recommended_certs,
        recommended_projects=recommended_projects
    )

@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(
    target_role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role_name = target_role or current_user.target_role or "Full Stack Developer"
    current_user.target_role = role_name
    db.commit()

    # Clear existing items for re-generation
    db.query(RoadmapItem).filter(RoadmapItem.user_id == current_user.id).delete()
    db.commit()

    # Fetch missing skills from recent analysis
    recent_analysis = db.query(SkillGapAnalysis).filter(
        SkillGapAnalysis.user_id == current_user.id
    ).order_by(SkillGapAnalysis.created_at.desc()).first()

    missing_skill_names = []
    if recent_analysis and recent_analysis.missing_skills_json:
        missing_skill_names = [m.get("name") if isinstance(m, dict) else str(m) for m in recent_analysis.missing_skills_json]

    if not missing_skill_names:
        missing_skill_names = ["Python", "FastAPI", "React", "Docker", "AWS", "System Design"]

    # Generate 4-Phase 12-Week Roadmap Timeline
    phases = [
        ("Phase 1: Foundations & Core Concepts", 1, missing_skill_names[:2], "Master core syntax, data structures, and fundamental principles."),
        ("Phase 2: Frameworks & Developer Tools", 4, missing_skill_names[2:4] if len(missing_skill_names) > 2 else ["Git", "REST APIs"], "Build interactive APIs, microservices, and database schemas."),
        ("Phase 3: Real-World Portfolio Projects", 7, missing_skill_names[4:6] if len(missing_skill_names) > 4 else ["Docker", "CI/CD"], "Construct end-to-end full stack projects and deploy to production."),
        ("Phase 4: Certifications & Placement Prep", 10, ["System Design", "Mock Interviews"], "Complete industry certification and prepare for technical whiteboard interviews.")
    ]

    new_items = []
    w_counter = 1
    for p_title, start_w, skills, p_desc in phases:
        for idx, skill in enumerate(skills):
            item = RoadmapItem(
                user_id=current_user.id,
                target_role=role_name,
                phase_name=p_title,
                week_number=start_w + (idx * 1),
                title=f"Master {skill} & Hands-on Implementation",
                description=f"{p_desc} Focus area: {skill}.",
                resource_url=f"https://google.com/search?q=Learn+{skill}+tutorial",
                is_completed=False
            )
            db.add(item)
            new_items.append(item)
            w_counter += 1

    db.commit()
    return get_user_roadmap(current_user, db)

@router.patch("/items/{item_id}")
def toggle_roadmap_item(
    item_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    item = db.query(RoadmapItem).filter(
        RoadmapItem.id == item_id,
        RoadmapItem.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found.")

    item.is_completed = not item.is_completed
    db.commit()
    db.refresh(item)
    return {"message": "Status updated.", "is_completed": item.is_completed}
