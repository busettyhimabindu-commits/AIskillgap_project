from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6)
    target_role: Optional[str] = "Full Stack Developer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserOut"

class RefreshRequest(BaseModel):
    refresh_token: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=6)

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    target_role: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Profile Schemas ---
class EducationCreate(BaseModel):
    degree: str
    institution: str
    branch: Optional[str] = None
    cgpa: Optional[float] = 0.0
    graduation_year: Optional[int] = None

class EducationOut(EducationCreate):
    id: int
    class Config:
        from_attributes = True

class SkillCreate(BaseModel):
    name: str
    category: Optional[str] = "Languages"
    proficiency: Optional[str] = "Intermediate"
    years_exp: Optional[float] = 1.0

class SkillOut(BaseModel):
    id: int
    name: str
    category: str
    proficiency: str
    years_exp: float
    class Config:
        from_attributes = True

class CertificationCreate(BaseModel):
    title: str
    issuing_organization: str
    issue_date: Optional[str] = None
    credential_url: Optional[str] = None

class CertificationOut(CertificationCreate):
    id: int
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class ProjectOut(ProjectCreate):
    id: int
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileOut(BaseModel):
    id: int
    user_id: int
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None
    education_entries: List[EducationOut] = []
    student_skills: List[SkillOut] = []
    certifications: List[CertificationOut] = []
    projects: List[ProjectOut] = []
    has_resume: bool = False
    class Config:
        from_attributes = True

# --- Resume Parser Schemas ---
class ResumeParseResponse(BaseModel):
    filename: str
    text_preview: str
    extracted_skills: List[Dict[str, Any]]
    extracted_certs: List[str]
    extracted_projects: List[str]
    extracted_education: List[str]
    confidence_score: float

# --- Skill Gap Analysis Schemas ---
class SkillGapRequest(BaseModel):
    target_role_id: Optional[int] = None
    target_role_name: Optional[str] = None

class SkillGapResponse(BaseModel):
    job_role: str
    category: str
    match_percentage: float
    readiness_score: float
    matching_skills: List[Dict[str, Any]]
    missing_skills: List[Dict[str, Any]]
    category_breakdown: Dict[str, Any]
    summary: str
    created_at: datetime

# --- Roadmap Schemas ---
class RoadmapItemOut(BaseModel):
    id: int
    phase_name: str
    week_number: int
    title: str
    description: Optional[str] = None
    resource_url: Optional[str] = None
    is_completed: bool

    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    target_role: str
    total_items: int
    completed_items: int
    progress_percentage: float
    items: List[RoadmapItemOut]
    recommended_certs: List[str]
    recommended_projects: List[Dict[str, str]]

# --- Job Role Schemas ---
class JobRoleOut(BaseModel):
    id: int
    title: str
    category: str
    description: Optional[str] = None
    required_skills_json: List[str]
    recommended_certs_json: Optional[List[str]] = []
    recommended_projects_json: Optional[List[Dict[str, str]]] = []
    avg_salary: Optional[str] = None
    exp_level: Optional[str] = None

    class Config:
        from_attributes = True
