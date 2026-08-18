from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, StudentProfile, JobRole, SkillGapAnalysis, RoadmapItem
from app.services.pdf_service import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

@router.get("/pdf")
def download_pdf_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    # Recent skill gap analysis
    recent_analysis = db.query(SkillGapAnalysis).filter(
        SkillGapAnalysis.user_id == current_user.id
    ).order_by(SkillGapAnalysis.created_at.desc()).first()

    # Roadmap items
    roadmap_items = db.query(RoadmapItem).filter(
        RoadmapItem.user_id == current_user.id
    ).order_by(RoadmapItem.week_number.asc()).all()

    formatted_roadmap = []
    for r in roadmap_items:
        formatted_roadmap.append({
            "week_number": r.week_number,
            "phase_name": r.phase_name,
            "title": r.title
        })

    report_payload = {
        "candidate_name": current_user.full_name,
        "target_role": current_user.target_role or "Full Stack Developer",
        "match_percentage": recent_analysis.match_percentage if recent_analysis else 78.5,
        "readiness_score": recent_analysis.readiness_score if recent_analysis else 82.0,
        "matching_skills": recent_analysis.matching_skills_json if recent_analysis else [
            {"name": "Python"}, {"name": "JavaScript"}, {"name": "React"}, {"name": "SQL"}
        ],
        "missing_skills": recent_analysis.missing_skills_json if recent_analysis else [
            {"name": "FastAPI", "priority": "High"},
            {"name": "Docker", "priority": "High"},
            {"name": "AWS", "priority": "Medium"}
        ],
        "roadmap_items": formatted_roadmap
    }

    pdf_buffer = generate_pdf_report(report_payload)

    headers = {
        'Content-Disposition': f'attachment; filename="SkillGap_AI_Report_{current_user.full_name.replace(" ", "_")}.pdf"'
    }
    return Response(content=pdf_buffer.getvalue(), media_type="application/pdf", headers=headers)
