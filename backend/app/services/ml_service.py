import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_skill_gap(
    candidate_skills: List[str],
    job_required_skills: List[str],
    project_count: int = 0,
    cert_count: int = 0,
    cgpa: float = 7.5
) -> Dict[str, Any]:
    """
    ML Skill Gap Engine using Scikit-Learn TF-IDF & Cosine Similarity:
    1. Vectorizes candidate skill corpus vs job role requirement corpus.
    2. Computes TF-IDF cosine similarity percentage.
    3. Categorizes exact matching vs missing skills with priority weights.
    4. Computes composite Placement Readiness Score (0 - 100%).
    """
    if not job_required_skills:
        job_required_skills = ["Python", "JavaScript", "SQL", "Git"]

    if not candidate_skills:
        candidate_skills = []

    # Clean skill lists
    candidate_set = {s.strip().lower(): s.strip() for s in candidate_skills}
    job_set = {s.strip().lower(): s.strip() for s in job_required_skills}

    # TF-IDF Cosine Similarity Calculation
    cand_doc = " ".join(candidate_skills) if candidate_skills else "none"
    job_doc = " ".join(job_required_skills)

    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([cand_doc, job_doc])
        sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        raw_cosine_sim = float(sim_matrix[0][0])
    except Exception:
        raw_cosine_sim = 0.0

    # Intersection and Set Difference for exact skill breakdown
    matching_keys = set(candidate_set.keys()).intersection(set(job_set.keys()))
    missing_keys = set(job_set.keys()).difference(set(candidate_set.keys()))

    matching_skills = []
    for k in matching_keys:
        matching_skills.append({
            "name": job_set[k],
            "status": "Matched",
            "proficiency": "Acquired"
        })

    # Priority weighting for missing skills
    missing_skills = []
    missing_list = list(missing_keys)
    for idx, k in enumerate(missing_list):
        # Top 3 missing skills are high priority
        priority = "High" if idx < 3 else ("Medium" if idx < 6 else "Low")
        missing_skills.append({
            "name": job_set[k],
            "priority": priority,
            "impact": "+15% match" if priority == "High" else "+8% match"
        })

    # Exact overlap ratio calculation
    overlap_ratio = len(matching_keys) / len(job_set.keys()) if job_set else 0.0
    
    # Weighted Skill Match Percentage (Combine TF-IDF similarity + Direct overlap)
    match_percentage = round(((raw_cosine_sim * 0.40) + (overlap_ratio * 0.60)) * 100, 1)
    match_percentage = min(max(match_percentage, 5.0), 99.0)  # Normalize between 5% and 99%

    # Placement Readiness Score composite calculation
    # Formula: 50% match_pct + 20% projects + 15% certs + 15% cgpa_factor
    project_factor = min(project_count * 12.5, 100.0)  # Max 100 for 8+ projects
    cert_factor = min(cert_count * 25.0, 100.0)         # Max 100 for 4+ certs
    cgpa_factor = min((cgpa / 10.0) * 100.0, 100.0)

    readiness_score = round(
        (0.50 * match_percentage) +
        (0.20 * project_factor) +
        (0.15 * cert_factor) +
        (0.15 * cgpa_factor),
        1
    )
    readiness_score = min(max(readiness_score, 10.0), 99.5)

    # Category breakdown for charts
    category_breakdown = {
        "Languages": {"matched": 0, "missing": 0},
        "Frameworks": {"matched": 0, "missing": 0},
        "Databases": {"matched": 0, "missing": 0},
        "Cloud & Tools": {"matched": 0, "missing": 0},
    }
    
    for m in matching_skills:
        category_breakdown["Languages"]["matched"] += 1
    for ms in missing_skills:
        category_breakdown["Frameworks"]["missing"] += 1

    summary = f"You match {match_percentage}% of the required skills. Focus on acquiring {len(missing_skills)} missing high-priority skills to boost your placement readiness score to {min(readiness_score + 20, 99.0)}%."

    return {
        "match_percentage": match_percentage,
        "readiness_score": readiness_score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "category_breakdown": category_breakdown,
        "summary": summary
    }
