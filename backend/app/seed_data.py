import logging
from sqlalchemy.orm import Session
from app.models.all_models import JobRole, Skill

logger = logging.getLogger(__name__)

INITIAL_SKILLS = [
    ("Python", "Languages"), ("JavaScript", "Languages"), ("TypeScript", "Languages"),
    ("Java", "Languages"), ("C++", "Languages"), ("C#", "Languages"), ("Go", "Languages"),
    ("Rust", "Languages"), ("SQL", "Languages"), ("HTML5", "Languages"), ("CSS3", "Languages"),
    ("React", "Frameworks & Libraries"), ("Vue.js", "Frameworks & Libraries"),
    ("Angular", "Frameworks & Libraries"), ("Next.js", "Frameworks & Libraries"),
    ("Node.js", "Frameworks & Libraries"), ("Express.js", "Frameworks & Libraries"),
    ("FastAPI", "Frameworks & Libraries"), ("Django", "Frameworks & Libraries"),
    ("Spring Boot", "Frameworks & Libraries"), ("Tailwind CSS", "Frameworks & Libraries"),
    ("Redux", "Frameworks & Libraries"), ("Machine Learning", "AI / ML & Data Science"),
    ("Deep Learning", "AI / ML & Data Science"), ("TensorFlow", "AI / ML & Data Science"),
    ("PyTorch", "AI / ML & Data Science"), ("Scikit-Learn", "AI / ML & Data Science"),
    ("NLP", "AI / ML & Data Science"), ("Computer Vision", "AI / ML & Data Science"),
    ("Pandas", "AI / ML & Data Science"), ("NumPy", "AI / ML & Data Science"),
    ("MySQL", "Databases"), ("PostgreSQL", "Databases"), ("MongoDB", "Databases"),
    ("Redis", "Databases"), ("SQLite", "Databases"), ("AWS", "Cloud & DevOps"),
    ("Azure", "Cloud & DevOps"), ("Docker", "Cloud & DevOps"), ("Kubernetes", "Cloud & DevOps"),
    ("CI/CD", "Cloud & DevOps"), ("GitHub Actions", "Cloud & DevOps"), ("Terraform", "Cloud & DevOps"),
    ("Linux", "Cloud & DevOps"), ("Jest", "Testing & Quality"), ("Postman", "Testing & Quality"),
    ("Git", "Soft Skills"), ("Communication", "Soft Skills"), ("Problem Solving", "Soft Skills"),
    ("Team Collaboration", "Soft Skills"), ("System Design", "Soft Skills")
]

INITIAL_JOB_ROLES = [
    {
        "title": "Full Stack Developer",
        "category": "Web Development",
        "description": "Designs and implements both frontend user interfaces and backend server architecture, databases, and APIs.",
        "required_skills": ["JavaScript", "TypeScript", "React", "Node.js", "Express.js", "Python", "FastAPI", "MySQL", "PostgreSQL", "HTML5", "CSS3", "Git", "REST API"],
        "recommended_certs": ["Meta Front-End Developer Certificate", "AWS Certified Developer - Associate"],
        "recommended_projects": [
            {"title": "E-Commerce Microservices Platform", "description": "Build a scalable online store with React frontend, Node backend, and Redis cart management."},
            {"title": "Real-time Collaborative Whiteboard", "description": "Construct a canvas app with React and WebSockets for real-time multi-user drawing."}
        ],
        "avg_salary": "$95,000 - $135,000",
        "exp_level": "Entry to Mid Level"
    },
    {
        "title": "AI / ML Engineer",
        "category": "Artificial Intelligence",
        "description": "Develops machine learning algorithms, deep learning models, and NLP pipelines to automate intelligent decision making.",
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn", "NLP", "Pandas", "NumPy", "SQL", "Docker", "Git"],
        "recommended_certs": ["TensorFlow Developer Certificate", "AWS Certified Machine Learning - Specialty"],
        "recommended_projects": [
            {"title": "Automated Resume Screening Engine", "description": "Train an NLP TF-IDF classifier to parse resumes and score candidate suitability."},
            {"title": "Real-Time Object Detection System", "description": "Deploy a YOLO / OpenCV pipeline to process webcam video streams."}
        ],
        "avg_salary": "$115,000 - $160,000",
        "exp_level": "Mid Level"
    },
    {
        "title": "Data Scientist",
        "category": "Data & Analytics",
        "description": "Analyzes complex datasets, builds predictive models, and translates raw data into strategic business insights.",
        "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib", "Seaborn", "Machine Learning", "Statistics", "Git"],
        "recommended_certs": ["Google Data Analytics Professional Certificate", "IBM Data Science Professional"],
        "recommended_projects": [
            {"title": "Customer Churn Prediction Model", "description": "Build a logistic regression & random forest pipeline to predict customer churn."},
            {"title": "Financial Market Sentiment Analyzer", "description": "Scrape financial news articles and apply VADER sentiment analysis to stock trends."}
        ],
        "avg_salary": "$105,000 - $145,000",
        "exp_level": "Entry to Mid Level"
    },
    {
        "title": "Cloud & DevOps Engineer",
        "category": "Cloud & Infrastructure",
        "description": "Manages automated CI/CD deployment pipelines, infrastructure as code, container orchestration, and cloud architecture.",
        "required_skills": ["AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Terraform", "Linux", "Python", "Bash", "Nginx", "Git"],
        "recommended_certs": ["AWS Certified Solutions Architect - Associate", "Certified Kubernetes Administrator (CKA)"],
        "recommended_projects": [
            {"title": "Automated Kubernetes Deployment Pipeline", "description": "Provision AWS EKS cluster using Terraform and deploy microservices via GitHub Actions."},
            {"title": "Infrastructure Health Monitoring Suite", "description": "Set up Prometheus & Grafana alerts for server metrics."}
        ],
        "avg_salary": "$110,000 - $155,000",
        "exp_level": "Mid Level"
    },
    {
        "title": "Frontend Engineer",
        "category": "Web Development",
        "description": "Specializes in building modern, responsive, high-performance web user interfaces and interactive web apps.",
        "required_skills": ["JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Jest", "Git"],
        "recommended_certs": ["Meta Front-End Developer Professional Certificate"],
        "recommended_projects": [
            {"title": "SaaS Dashboard with Dark Mode", "description": "Build an interactive dashboard with Tailwind CSS, Recharts analytics, and dark mode toggle."},
            {"title": "Design System Component Library", "description": "Publish a reusable UI component library using React & Tailwind."}
        ],
        "avg_salary": "$90,000 - $125,000",
        "exp_level": "Entry Level"
    },
    {
        "title": "Backend Engineer",
        "category": "Web Development",
        "description": "Builds resilient RESTful & GraphQL APIs, database schemas, authentication, and server scalability.",
        "required_skills": ["Python", "FastAPI", "Django", "Node.js", "Java", "SQL", "PostgreSQL", "MySQL", "Redis", "Docker", "REST API", "Git"],
        "recommended_certs": ["AWS Certified Developer - Associate"],
        "recommended_projects": [
            {"title": "High-Throughput Payment Gateway API", "description": "Build a FastAPI payment service with JWT security and PostgreSQL transactional ACID controls."},
            {"title": "Redis Rate-Limiting Middleware", "description": "Create a token-bucket rate limiter for API endpoints."}
        ],
        "avg_salary": "$100,000 - $140,000",
        "exp_level": "Mid Level"
    },
    {
        "title": "Cybersecurity Analyst",
        "category": "Security",
        "description": "Monitors networks, conducts vulnerability assessments, identifies security breaches, and enforces data protection protocols.",
        "required_skills": ["Linux", "Python", "Bash", "Network Security", "Penetration Testing", "Wireshark", "SQL", "Git"],
        "recommended_certs": ["CompTIA Security+", "Certified Ethical Hacker (CEH)"],
        "recommended_projects": [
            {"title": "Automated Network Vulnerability Scanner", "description": "Write a Python script to scan network ports and identify unpatched server vulnerabilities."},
            {"title": "Security Log Analyzer", "description": "Parse intrusion logs to flag brute-force SSH attacks."}
        ],
        "avg_salary": "$95,000 - $135,000",
        "exp_level": "Entry to Mid Level"
    },
    {
        "title": "Data Engineer",
        "category": "Data & Analytics",
        "description": "Constructs robust data pipelines, ETL workflows, data warehouses, and big data infrastructure.",
        "required_skills": ["Python", "SQL", "PostgreSQL", "Apache Spark", "Airflow", "Docker", "AWS", "Snowflake", "Git"],
        "recommended_certs": ["AWS Certified Data Engineer", "Databricks Certified Data Engineer"],
        "recommended_projects": [
            {"title": "Automated ETL Pipeline", "description": "Build an Apache Airflow DAG that ingests API data, cleans it with PySpark, and loads it to PostgreSQL."},
            {"title": "Real-time Streaming Pipeline", "description": "Stream Kafka events into a database."}
        ],
        "avg_salary": "$110,000 - $150,000",
        "exp_level": "Mid Level"
    }
]

def seed_database(db: Session):
    """Populates initial skills and job roles if database tables are empty."""
    try:
        # Seed Skills
        existing_skills_count = db.query(Skill).count()
        if existing_skills_count == 0:
            logger.info("Seeding initial skill taxonomy into database...")
            for sname, scateg in INITIAL_SKILLS:
                skill_obj = Skill(name=sname, category=scateg)
                db.add(skill_obj)
            db.commit()

        # Seed Job Roles
        existing_jobs_count = db.query(JobRole).count()
        if existing_jobs_count == 0:
            logger.info("Seeding initial industry job roles into database...")
            for job in INITIAL_JOB_ROLES:
                job_obj = JobRole(
                    title=job["title"],
                    category=job["category"],
                    description=job["description"],
                    required_skills_json=job["required_skills"],
                    recommended_certs_json=job["recommended_certs"],
                    recommended_projects_json=job["recommended_projects"],
                    avg_salary=job["avg_salary"],
                    exp_level=job["exp_level"]
                )
                db.add(job_obj)
            db.commit()
            logger.info("Database seeding completed successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
