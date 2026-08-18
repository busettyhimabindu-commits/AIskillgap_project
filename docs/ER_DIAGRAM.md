# SkillGap AI — Entity Relationship (ER) Diagram & Schema Documentation

## Database Schema (MySQL 8 / SQLAlchemy ORM)

```
 +------------------+           +----------------------+          +-------------------+
 |      users       | 1       1 |   student_profiles   | 1      * |     education     |
 +------------------+-----------+----------------------+----------+-------------------+
 | id (PK)          |           | id (PK)              |          | id (PK)           |
 | email (UNIQUE)   |           | user_id (FK)         |          | profile_id (FK)   |
 | hashed_password  |           | phone                |          | degree            |
 | full_name        |           | location             |          | institution       |
 | target_role      |           | bio                  |          | branch            |
 | is_active        |           | github_url           |          | cgpa              |
 | created_at       |           | linkedin_url         |          | graduation_year   |
 +--------+---------+           | avatar_url           |          +-------------------+
          |                     +----------+-----------+
          |                                |
          | 1                              | 1
          |                                |
          | *                              | *
 +--------v---------+           +----------v-----------+          +-------------------+
 |skill_gap_analyses|           |    student_skills    | *      1 |      skills       |
 +------------------+           +----------------------+----------+-------------------+
 | id (PK)          |           | id (PK)              |          | id (PK)           |
 | user_id (FK)     |           | profile_id (FK)      |          | name (UNIQUE)     |
 | job_role_id (FK) |           | skill_id (FK)        |          | category          |
 | match_percentage |           | proficiency          |          +-------------------+
 | readiness_score  |           | years_exp            |
 | matching_skills  |           +----------------------+
 | missing_skills   |
 +------------------+           +----------------------+          +-------------------+
                                |    certifications    |          |     projects      |
                                +----------------------+          +-------------------+
                                | id (PK)              |          | id (PK)           |
                                | profile_id (FK)      |          | profile_id (FK)   |
                                | title                |          | title             |
                                | issuing_org          |          | description       |
                                +----------------------+          | tech_stack        |
                                                                  +-------------------+
```

---

## Key Data Entities Description
1. **users**: Primary authentication account entity storing email, bcrypt hashed password, and target role preference.
2. **student_profiles**: Core profile metadata linked 1-to-1 with `users`.
3. **skills**: Taxonomy repository of 200+ industry technical and soft skills grouped by domain.
4. **student_skills**: Junction table associating student profiles to acquired skills with proficiency levels.
5. **education**, **certifications**, **projects**: One-to-many child records detailing candidate qualifications and portfolio background.
6. **job_roles**: Pre-populated benchmark directory containing required skill taxonomies, average salaries, and recommended certs.
7. **skill_gap_analyses**: Historical log storing Scikit-Learn TF-IDF cosine similarity calculations, skill match percentages, and placement readiness scores.
8. **roadmap_items**: Multi-phase 12-week step-by-step learning timeline items with completion flags.
