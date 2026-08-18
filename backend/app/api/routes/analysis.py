from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, StudentProfile, JobRole, SkillGapAnalysis, StudentSkill, Education, Project, Certification
from app.schemas.all_schemas import SkillGapRequest, SkillGapResponse
from app.services.ml_service import calculate_skill_gap

router = APIRouter(prefix="/analysis", tags=["AI Skill Gap Analyzer"])

@router.post("/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(
    req: SkillGapRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch Target Job Role
    job_role = None
    if req.target_role_id:
        job_role = db.query(JobRole).filter(JobRole.id == req.target_role_id).first()
    elif req.target_role_name:
        job_role = db.query(JobRole).filter(JobRole.title.ilike(f"%{req.target_role_name}%")).first()
    
    if not job_role:
        # Default fallback to target role in user profile or Full Stack Developer
        job_role = db.query(JobRole).filter(JobRole.title.ilike(f"%{current_user.target_role}%")).first()
    if not job_role:
        job_role = db.query(JobRole).first()

    if not job_role:
        raise HTTPException(status_code=404, detail="Target job role not found in database.")

    # Update user's target role preference
    current_user.target_role = job_role.title
    db.commit()

    # Fetch candidate skills from profile
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    candidate_skills = []
    project_count = 0
    cert_count = 0
    cgpa = 7.5

    if profile:
        candidate_skills = [ss.skill.name for ss in profile.student_skills if ss.skill]
        project_count = len(profile.projects)
        cert_count = len(profile.certifications)
        if profile.education_entries:
            cgpa = profile.education_entries[0].cgpa or 7.5

    # Run Scikit-learn TF-IDF + Cosine Similarity Matching Engine
    required_skills = job_role.required_skills_json or []
    gap_result = calculate_skill_gap(
        candidate_skills=candidate_skills,
        job_required_skills=required_skills,
        project_count=project_count,
        cert_count=cert_count,
        cgpa=cgpa
    )

    # Record analysis in database
    analysis_record = SkillGapAnalysis(
        user_id=current_user.id,
        job_role_id=job_role.id,
        match_percentage=gap_result["match_percentage"],
        readiness_score=gap_result["readiness_score"],
        matching_skills_json=gap_result["matching_skills"],
        missing_skills_json=gap_result["missing_skills"],
        created_at=datetime.utcnow()
    )
    db.add(analysis_record)
    db.commit()

    return SkillGapResponse(
        job_role=job_role.title,
        category=job_role.category,
        match_percentage=gap_result["match_percentage"],
        readiness_score=gap_result["readiness_score"],
        matching_skills=gap_result["matching_skills"],
        missing_skills=gap_result["missing_skills"],
        category_breakdown=gap_result["category_breakdown"],
        summary=gap_result["summary"],
        created_at=analysis_record.created_at
    )

@router.get("/history")
def get_analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = db.query(SkillGapAnalysis).filter(
        SkillGapAnalysis.user_id == current_user.id
    ).order_by(SkillGapAnalysis.created_at.desc()).limit(10).all()

    results = []
    for a in analyses:
        results.append({
            "id": a.id,
            "job_role": a.job_role.title if a.job_role else "Target Role",
            "match_percentage": a.match_percentage,
            "readiness_score": a.readiness_score,
            "created_at": a.created_at
        })
    return results
