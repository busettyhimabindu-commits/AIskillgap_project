import io
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(data: Dict[str, Any]) -> io.BytesIO:
    """
    Generates a PDF analysis & career roadmap report using ReportLab.
    Returns a BytesIO stream.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#4F46E5")   # Indigo
    SECONDARY = colors.HexColor("#7C3AED") # Violet
    SUCCESS = colors.HexColor("#10B981")   # Emerald
    WARNING = colors.HexColor("#F59E0B")   # Amber
    DARK = colors.HexColor("#1E293B")      # Slate 800
    LIGHT = colors.HexColor("#F8FAFC")     # Slate 50

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=15
    )
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=DARK
    )

    story = []

    # Title Banner
    story.append(Paragraph("SkillGap AI — Career Readiness Report", title_style))
    story.append(Paragraph(f"Target Role: <b>{data.get('target_role', 'Software Engineer')}</b> | Candidate: <b>{data.get('candidate_name', 'Student')}</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceAfter=15))

    # Metric Cards Table
    match_pct = data.get("match_percentage", 75.0)
    readiness = data.get("readiness_score", 82.0)
    
    metric_data = [
        [
            Paragraph(f"<b>Skill Match Percentage</b><br/><font size=18 color='#4F46E5'><b>{match_pct}%</b></font>", body_style),
            Paragraph(f"<b>Placement Readiness Score</b><br/><font size=18 color='#10B981'><b>{readiness} / 100</b></font>", body_style),
        ]
    ]
    metric_table = Table(metric_data, colWidths=[260, 260])
    metric_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(metric_table)
    story.append(Spacer(1, 15))

    # Matching Skills Section
    story.append(Paragraph("1. Matching Skills Acquired", h2_style))
    matching_list = data.get("matching_skills", [])
    if matching_list:
        matching_text = ", ".join([s.get("name", s) if isinstance(s, dict) else s for s in matching_list])
        story.append(Paragraph(f"<font color='#10B981'><b>Acquired Skills ({len(matching_list)}):</b></font> {matching_text}", body_style))
    else:
        story.append(Paragraph("No skills matched yet. Complete your profile or upload a resume to detect skills.", body_style))
    story.append(Spacer(1, 10))

    # Missing Skills Section
    story.append(Paragraph("2. Missing High-Priority Skills", h2_style))
    missing_list = data.get("missing_skills", [])
    if missing_list:
        table_rows = [["Skill Name", "Priority Level", "Target Action"]]
        for item in missing_list[:8]:
            sname = item.get("name", str(item)) if isinstance(item, dict) else str(item)
            prio = item.get("priority", "High") if isinstance(item, dict) else "High"
            table_rows.append([sname, prio, "Complete Week 1-4 Module"])

        missing_table = Table(table_rows, colWidths=[200, 140, 180])
        missing_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), SECONDARY),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ]))
        story.append(missing_table)
    else:
        story.append(Paragraph("Great job! You have matched all key requirements.", body_style))
    story.append(Spacer(1, 15))

    # Learning Roadmap Timeline Section
    story.append(Paragraph("3. Personalized Learning Roadmap Timeline", h2_style))
    roadmap_items = data.get("roadmap_items", [])
    if roadmap_items:
        r_rows = [["Week", "Phase", "Milestone / Skill Goal"]]
        for r in roadmap_items[:6]:
            wnum = f"Week {r.get('week_number', 1)}"
            pname = r.get("phase_name", "Core")
            title = r.get("title", "Learn Skill")
            r_rows.append([wnum, pname, title])
        
        r_table = Table(r_rows, colWidths=[80, 160, 280])
        r_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), PRIMARY),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ]))
        story.append(r_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))
    story.append(Paragraph("Generated automatically by <b>SkillGap AI</b> — 2026 Career Intelligence Engine.", ParagraphStyle('Foot', parent=body_style, fontSize=8, textColor=colors.HexColor("#94A3B8"))))

    doc.build(story)
    buffer.seek(0)
    return buffer
