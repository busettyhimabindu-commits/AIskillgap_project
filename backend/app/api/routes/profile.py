from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, StudentProfile, Education, Skill, StudentSkill, Certification, Project, Resume
from app.schemas.all_schemas import (
    ProfileOut, ProfileUpdate, EducationCreate, EducationOut,
    SkillCreate, SkillOut, CertificationCreate, CertificationOut,
    ProjectCreate, ProjectOut
)

router = APIRouter(prefix="/profile", tags=["Student Profile"])

def get_or_create_profile(user_id: int, db: Session) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = StudentProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("", response_model=ProfileOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(current_user.id, db)
    
    # Format response skills
    formatted_skills = []
    for ss in profile.student_skills:
        formatted_skills.append({
            "id": ss.id,
            "name": ss.skill.name if ss.skill else "Skill",
            "category": ss.skill.category if ss.skill else "General",
            "proficiency": ss.proficiency,
            "years_exp": ss.years_exp
        })

    has_resume = db.query(Resume).filter(Resume.profile_id == profile.id).count() > 0

    return ProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        phone=profile.phone,
        location=profile.location,
        bio=profile.bio,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url,
        avatar_url=profile.avatar_url,
        education_entries=[EducationOut.model_validate(e) for e in profile.education_entries],
        student_skills=formatted_skills,
        certifications=[CertificationOut.model_validate(c) for c in profile.certifications],
        projects=[ProjectOut.model_validate(p) for p in profile.projects],
        has_resume=has_resume
    )

@router.put("", response_model=ProfileOut)
def update_profile(
    upd: ProfileUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    for field, val in upd.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)
    db.commit()
    return get_profile(current_user, db)

# Skills Endpoints
@router.post("/skills", response_model=SkillOut)
def add_student_skill(
    skill_in: SkillCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    
    # Check if Skill exists in taxonomy
    skill_obj = db.query(Skill).filter(Skill.name.ilike(skill_in.name)).first()
    if not skill_obj:
        skill_obj = Skill(name=skill_in.name, category=skill_in.category or "Languages")
        db.add(skill_obj)
        db.commit()
        db.refresh(skill_obj)

    # Check if already added
    existing_ss = db.query(StudentSkill).filter(
        StudentSkill.profile_id == profile.id,
        StudentSkill.skill_id == skill_obj.id
    ).first()

    if existing_ss:
        existing_ss.proficiency = skill_in.proficiency or existing_ss.proficiency
        existing_ss.years_exp = skill_in.years_exp or existing_ss.years_exp
        db.commit()
        db.refresh(existing_ss)
        target_ss = existing_ss
    else:
        target_ss = StudentSkill(
            profile_id=profile.id,
            skill_id=skill_obj.id,
            proficiency=skill_in.proficiency or "Intermediate",
            years_exp=skill_in.years_exp or 1.0
        )
        db.add(target_ss)
        db.commit()
        db.refresh(target_ss)

    return SkillOut(
        id=target_ss.id,
        name=skill_obj.name,
        category=skill_obj.category,
        proficiency=target_ss.proficiency,
        years_exp=target_ss.years_exp
    )

@router.delete("/skills/{skill_id}")
def delete_student_skill(
    skill_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    ss = db.query(StudentSkill).filter(
        StudentSkill.id == skill_id,
        StudentSkill.profile_id == profile.id
    ).first()

    if not ss:
        raise HTTPException(status_code=404, detail="Skill not found in profile.")

    db.delete(ss)
    db.commit()
    return {"message": "Skill removed successfully."}

# Education Endpoints
@router.post("/education", response_model=EducationOut)
def add_education(
    edu_in: EducationCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    edu = Education(
        profile_id=profile.id,
        degree=edu_in.degree,
        institution=edu_in.institution,
        branch=edu_in.branch,
        cgpa=edu_in.cgpa,
        graduation_year=edu_in.graduation_year
    )
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return EducationOut.model_validate(edu)

@router.delete("/education/{id}")
def delete_education(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(current_user.id, db)
    edu = db.query(Education).filter(Education.id == id, Education.profile_id == profile.id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found.")
    db.delete(edu)
    db.commit()
    return {"message": "Education record deleted."}

# Certifications Endpoints
@router.post("/certifications", response_model=CertificationOut)
def add_certification(
    cert_in: CertificationCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    cert = Certification(
        profile_id=profile.id,
        title=cert_in.title,
        issuing_organization=cert_in.issuing_organization,
        issue_date=cert_in.issue_date,
        credential_url=cert_in.credential_url
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return CertificationOut.model_validate(cert)

@router.delete("/certifications/{id}")
def delete_certification(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(current_user.id, db)
    cert = db.query(Certification).filter(Certification.id == id, Certification.profile_id == profile.id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found.")
    db.delete(cert)
    db.commit()
    return {"message": "Certification deleted."}

# Projects Endpoints
@router.post("/projects", response_model=ProjectOut)
def add_project(
    proj_in: ProjectCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user.id, db)
    proj = Project(
        profile_id=profile.id,
        title=proj_in.title,
        description=proj_in.description,
        tech_stack=proj_in.tech_stack,
        github_url=proj_in.github_url,
        live_url=proj_in.live_url
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return ProjectOut.model_validate(proj)

@router.delete("/projects/{id}")
def delete_project(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(current_user.id, db)
    proj = db.query(Project).filter(Project.id == id, Project.profile_id == profile.id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found.")
    db.delete(proj)
    db.commit()
    return {"message": "Project deleted."}
