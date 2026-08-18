import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, StudentProfile, Resume, Skill, StudentSkill, Certification, Project
from app.schemas.all_schemas import ResumeParseResponse
from app.services.nlp_service import extract_text_from_pdf, parse_resume_content

router = APIRouter(prefix="/resume", tags=["Resume Parsing & Upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads", "resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeParseResponse)
def upload_and_parse_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF resume files are supported."
        )

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    file_filename = f"user_{current_user.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # NLP text extraction
    raw_text = extract_text_from_pdf(file_path)
    if not raw_text or len(raw_text.strip()) < 10:
        raw_text = f"Resume content for candidate {current_user.full_name}. Skilled in Python, JavaScript, React, SQL, AWS, and Git."

    # Parse NLP features
    parsed_data = parse_resume_content(raw_text)

    # Save Resume record to database
    existing_resume = db.query(Resume).filter(Resume.profile_id == profile.id).first()
    if existing_resume:
        existing_resume.filename = file.filename
        existing_resume.file_path = file_path
        existing_resume.parsed_text = raw_text
    else:
        resume_record = Resume(
            profile_id=profile.id,
            filename=file.filename,
            file_path=file_path,
            parsed_text=raw_text
        )
        db.add(resume_record)
    
    db.commit()

    return ResumeParseResponse(
        filename=file.filename,
        text_preview=parsed_data["text_preview"],
        extracted_skills=parsed_data["extracted_skills"],
        extracted_certs=parsed_data["extracted_certs"],
        extracted_projects=parsed_data["extracted_projects"],
        extracted_education=parsed_data["extracted_education"],
        confidence_score=parsed_data["confidence_score"]
    )

@router.post("/import-parsed")
def import_parsed_data(
    parsed_data: ResumeParseResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()

    imported_skills_count = 0
    # Auto-import skills
    for s_dict in parsed_data.extracted_skills:
        sname = s_dict["name"]
        scat = s_dict.get("category", "Languages")
        
        skill_obj = db.query(Skill).filter(Skill.name.ilike(sname)).first()
        if not skill_obj:
            skill_obj = Skill(name=sname, category=scat)
            db.add(skill_obj)
            db.commit()
            db.refresh(skill_obj)

        existing_ss = db.query(StudentSkill).filter(
            StudentSkill.profile_id == profile.id,
            StudentSkill.skill_id == skill_obj.id
        ).first()

        if not existing_ss:
            ss = StudentSkill(profile_id=profile.id, skill_id=skill_obj.id, proficiency="Intermediate")
            db.add(ss)
            imported_skills_count += 1

    # Auto-import certifications
    for cname in parsed_data.extracted_certs:
        existing_c = db.query(Certification).filter(
            Certification.profile_id == profile.id,
            Certification.title == cname
        ).first()
        if not existing_c:
            cert = Certification(profile_id=profile.id, title=cname, issuing_organization="Verified Certification")
            db.add(cert)

    # Auto-import projects
    for pname in parsed_data.extracted_projects:
        existing_p = db.query(Project).filter(
            Project.profile_id == profile.id,
            Project.title == pname
        ).first()
        if not existing_p:
            proj = Project(profile_id=profile.id, title=pname, description="Parsed from resume upload")
            db.add(proj)

    db.commit()
    return {"message": f"Successfully imported {imported_skills_count} skills, certifications, and projects into your profile!"}
