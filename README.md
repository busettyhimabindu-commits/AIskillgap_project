# 🚀 SkillGap AI — Production-Grade AI Skill Gap Analyzer & Career Roadmap Engine

**SkillGap AI** is a state-of-the-art, production-grade web application built for 2026 computer science & engineering placement readiness. The system enables students to parse PDF resumes with NLP, analyze technical skill gaps against 15+ industry job roles using **Scikit-learn TF-IDF & Cosine Similarity**, compute a Placement Readiness Score, view interactive analytics dashboards, and export branded PDF career reports.

---

## 🌟 Key Features & Highlights

- 🔐 **Authentication Module**: Secure JWT authentication (Access & Refresh tokens), bcrypt password hashing, and token-based password reset.
- 🎓 **Student Profile Module**: Comprehensive multi-tab profile management for personal details, education, technical skills, certifications, and portfolio projects.
- 📄 **Resume NLP Parser Module**: Extracts raw text from uploaded PDF resumes using `pypdf`, matches regex word boundary taxonomies, detects certs/projects, and imports them with a single click.
- 🧠 **AI Skill Gap Analyzer Engine**:
  - Uses **Scikit-learn TF-IDF vectorization & Cosine Similarity** to calculate exact skill match % against target role requirements.
  - Computes composite **Placement Readiness Score**:
    $$\text{Readiness} = (0.50 \times \text{Match \%}) + (0.20 \times \text{Projects}) + (0.15 \times \text{Certifications}) + (0.15 \times \text{CGPA})$$
  - Highlights matching skills (emerald green) vs missing high-priority skills (rose red/amber).
- 🗺️ **Career Roadmap Module**: Generates a 4-phase 12-week learning timeline with tutorial resource links, recommended certifications, and portfolio project suggestions.
- 📊 **Interactive Analytics Dashboard**:
  - Recharts Radar Chart (Candidate Skill Level vs Industry Benchmark)
  - Circular Placement Readiness Gauge
  - Skill distribution charts & historical analysis logs
- 🔍 **Search & Filter Module**: Live debounced search across job roles and skill taxonomy by category.
- 🎨 **2026 SaaS Aesthetic & Dark Mode**: Persistent dark mode (Tailwind `dark:`), glassmorphism cards, ambient glow gradients, and Framer Motion micro-animations.
- 📑 **ReportLab PDF Exporter**: Generate and download formatted PDF Career Reports directly from the app.

---

## 🧱 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Dark mode with `localStorage` persistence)
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **API Client**: Axios (with auto refresh-token interceptor)

### Backend
- **Framework**: Python 3.11+ FastAPI
- **ORM & Database**: SQLAlchemy ORM (MySQL 8 with zero-config SQLite fallback)
- **Machine Learning & NLP**: Scikit-Learn (TF-IDF + Cosine Similarity), PyPDF, regex taxonomy matching
- **Security & Auth**: JWT (`python-jose`), Passlib bcrypt
- **PDF Generation**: ReportLab

---

## 🗄️ Database Architecture

The application includes 12 normalized database models:
`users`, `student_profiles`, `education`, `skills`, `student_skills`, `certifications`, `projects`, `resumes`, `job_roles`, `skill_gap_analyses`, `roadmap_items`, `password_reset_tokens`.

*(See detailed ER Diagram in [`docs/ER_DIAGRAM.md`](file:///c:/Users/Busetty%20HimaBindu/OneDrive%20-%20Madanapalle%20Institute%20of%20Technology%20&%20Science/Desktop/AI%20Skill%20Gap/docs/ER_DIAGRAM.md))*

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.11+
- Node.js v18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python requirements
pip install -r requirements.txt

# Launch FastAPI Backend Server (runs on http://127.0.0.1:8000)
python run.py
```

> **Note**: The backend automatically seeds 15+ industry job roles and 200+ skill taxonomy tags into the database on first startup. It connects to **MySQL 8** if configured, or seamlessly falls back to local SQLite (`skillgap.db`) zero-config database.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (runs on http://localhost:5173)
node node_modules/vite/bin/vite.js

# Build production bundle
node node_modules/vite/bin/vite.js build
```

---

## 📖 API Documentation

Access interactive OpenAPI Swagger docs at:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 🖼️ Application Screenshots

| Landing Page & Hero Banner | Interactive Analytics Dashboard |
| :---: | :---: |
| *2026 SaaS Aesthetic & Dark Mode* | *Readiness Gauge & Recharts Radar Chart* |

| AI Skill Gap Analyzer | Phased Learning Roadmap |
| :---: | :---: |
| *Scikit-Learn TF-IDF Cosine Match* | *12-Week Timeline & PDF Export* |

---

## 📜 License
MIT License. Created for 2026 Portfolio & Placement Readiness.
