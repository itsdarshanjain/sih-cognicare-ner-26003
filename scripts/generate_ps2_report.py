"""
CogniCare NER — Detailed Technical Report PDF Generator
Team Prakalp | SIH 2026
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether
)
from reportlab.pdfgen import canvas
import os

# ============ HEALTHCARE COLORS (PS2 THEME) ============
PRIMARY_TEAL = HexColor('#0D9488')    # Deep Medical Teal
ACCENT_GREEN = HexColor('#10B981')    # Vibrant Health Green
DARK_SLATE = HexColor('#0F172A')      # Text Dark
SOFT_TEAL = HexColor('#CCFBF1')       # Light background
ORANGE = HexColor('#F97316')          # Alert/Action Accent
PURPLE = HexColor('#8B5CF6')          # Clinical Accent
BORDER = HexColor('#E2E8F0')
SUCCESS = HexColor('#22C55E')
DANGER = HexColor('#EF4444')
TEXT_DARK = HexColor('#1E293B')
WHITE = white

# ============ OUTPUT ============
OUTPUT_DIR = r"c:\Users\Darsh\OneDrive\Desktop\SIH\PS2\CogniCare"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "CogniCare_NER_Technical_Report.pdf")

# ============ STYLES ============
def get_styles():
    styles = {}
    styles['h1'] = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=24, textColor=PRIMARY_TEAL, spaceBefore=30, spaceAfter=18, leading=30)
    styles['h2'] = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=18, textColor=DARK_SLATE, spaceBefore=22, spaceAfter=12, leading=24)
    styles['h3'] = ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=15, textColor=PRIMARY_TEAL, spaceBefore=16, spaceAfter=8, leading=20)
    styles['body'] = ParagraphStyle('body', fontName='Helvetica', fontSize=13, textColor=TEXT_DARK, leading=20, alignment=TA_JUSTIFY, spaceAfter=14)
    styles['body_bold'] = ParagraphStyle('body_bold', fontName='Helvetica-Bold', fontSize=13, textColor=DARK_SLATE, leading=20, alignment=TA_JUSTIFY, spaceAfter=14)
    styles['bullet'] = ParagraphStyle('bullet', fontName='Helvetica', fontSize=13, textColor=TEXT_DARK, leading=20, leftIndent=25, bulletIndent=12, spaceAfter=10)
    styles['toc'] = ParagraphStyle('toc', fontName='Helvetica', fontSize=15, textColor=TEXT_DARK, leading=28, leftIndent=20, spaceAfter=8)
    styles['toc_title'] = ParagraphStyle('toc_title', fontName='Helvetica-Bold', fontSize=30, textColor=PRIMARY_TEAL, spaceAfter=26)
    styles['callout'] = ParagraphStyle('callout', fontName='Helvetica', fontSize=12, textColor=TEXT_DARK, leading=18, leftIndent=12, rightIndent=12)
    styles['callout_title'] = ParagraphStyle('callout_title', fontName='Helvetica-Bold', fontSize=13, textColor=DARK_SLATE, leading=18, leftIndent=12)
    styles['footer'] = ParagraphStyle('footer', fontName='Helvetica', fontSize=11, textColor=black, alignment=TA_CENTER)
    styles['center'] = ParagraphStyle('center', fontName='Helvetica', fontSize=14, textColor=TEXT_DARK, alignment=TA_CENTER, leading=22)
    styles['center_bold'] = ParagraphStyle('center_bold', fontName='Helvetica-Bold', fontSize=14, textColor=PRIMARY_TEAL, alignment=TA_CENTER, leading=22)
    return styles

S = get_styles()

# ============ HELPERS ============
def section_header(num, title):
    data = [[Paragraph(f'<font color="white"><b>{num:02d}</b></font>', ParagraphStyle('badge', fontName='Helvetica-Bold', fontSize=16, textColor=WHITE, alignment=TA_CENTER, leading=18)),
             Paragraph(f'<font color="#0F172A"><b>{title}</b></font>', S['h1'])]]
    t = Table(data, colWidths=[18*mm, 147*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), ACCENT_GREEN),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (0, 0), 4),
        ('RIGHTPADDING', (0, 0), (0, 0), 4),
        ('TOPPADDING', (0, 0), (0, 0), 4),
        ('BOTTOMPADDING', (0, 0), (0, 0), 4),
        ('LINEBELOW', (0, 0), (-1, 0), 2.5, PRIMARY_TEAL),
    ]))
    return t

def make_table(headers, rows, col_widths=None):
    header_style = ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=12, textColor=WHITE, leading=16)
    cell_style = ParagraphStyle('td', fontName='Helvetica', fontSize=11, textColor=TEXT_DARK, leading=16)
    cell_bold = ParagraphStyle('td_b', fontName='Helvetica-Bold', fontSize=11, textColor=DARK_SLATE, leading=16)

    data = [[Paragraph(h, header_style) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cell_bold if i == 0 else cell_style) for i, c in enumerate(row)])

    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SOFT_TEAL]),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    return t

def callout_box(title, text, color=PRIMARY_TEAL):
    data = [[Paragraph(title, S['callout_title']),],
            [Paragraph(text, S['callout'])]]
    t = Table(data, colWidths=[165*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SOFT_TEAL),
        ('LINEBELOW', (0, 0), (-1, -1), 0, WHITE),
        ('LINEBEFORE', (0, 0), (0, -1), 5, color),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('ROUNDEDCORNERS', [0, 8, 8, 0]),
    ]))
    return t

# ============ COVER PAGE ============
class CoverPage:
    def __init__(self, c, doc):
        w, h = A4
        
        # Healthcare Calming Gradient-like feel (Using solid teal as base)
        c.setFillColor(PRIMARY_TEAL)
        c.rect(0, 0, w, h, fill=1, stroke=0)

        # Background accents (Softer Medical Greens/Blues)
        c.setFillColor(HexColor('#0F766E'))
        c.circle(w + 40, h - 80, 250, fill=1, stroke=0)
        c.setFillColor(HexColor('#115E59'))
        c.circle(-60, 60, 200, fill=1, stroke=0)

        y_pos = h - 250
        c.setFillColor(HexColor('#99F6E4'))
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(w/2, y_pos, 'SMART INDIA HACKATHON 2026')

        y_pos -= 20
        c.setStrokeColor(ACCENT_GREEN)
        c.setLineWidth(3)
        c.line(w/2 - 60, y_pos, w/2 + 60, y_pos)

        y_pos -= 60
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 46)
        c.drawCentredString(w/2, y_pos, 'CogniCare NER')

        y_pos -= 35
        c.setFont('Helvetica', 18)
        c.setFillColor(HexColor('#CCFBF1'))
        c.drawCentredString(w/2, y_pos, 'AI-Based Cognitive Gaming & Memory')
        y_pos -= 25
        c.drawCentredString(w/2, y_pos, 'Assistance Platform for Elderly Dementia')

        y_pos -= 35
        c.setStrokeColor(ACCENT_GREEN)
        c.setLineWidth(2)
        c.line(w/2 - 50, y_pos, w/2 + 50, y_pos)

        meta_lines = [
            ('Problem Statement ID:', 'SIH26003'),
            ('Organization:', 'Ministry of Development of North Eastern Region (MDoNER)'),
            ('Theme:', 'MedTech / BioTech / HealthTech'),
            ('Category:', 'Software'),
            ('Team:', 'Prakalp (130019)'),
            ('Institute:', 'IES College of Technology, Bhopal'),
        ]
        
        y_pos -= 50
        for label, value in meta_lines:
            c.setFillColor(HexColor('#99F6E4'))
            c.setFont('Helvetica', 14)
            c.drawCentredString(w/2, y_pos, f'{label}  {value}')
            y_pos -= 26

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(w/2, 40, 'Confidential -- Prepared for SIH 2026 Grand Finale Evaluation')

# ============ PAGE TEMPLATE ============
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    w, h = A4

    canvas_obj.setStrokeColor(ACCENT_GREEN)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(20*mm, h - 12*mm, w - 20*mm, h - 12*mm)

    canvas_obj.setFont('Helvetica-Bold', 10)
    canvas_obj.setFillColor(PRIMARY_TEAL)
    canvas_obj.drawString(20*mm, h - 10*mm, 'CogniCare NER -- Detailed Technical Report')
    canvas_obj.drawRightString(w - 20*mm, h - 10*mm, 'Team Prakalp | SIH 2026')

    canvas_obj.setStrokeColor(PRIMARY_TEAL)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(20*mm, 15*mm, w - 20*mm, 15*mm)
    canvas_obj.setFont('Helvetica-Bold', 10)
    canvas_obj.setFillColor(PRIMARY_TEAL)
    canvas_obj.drawCentredString(w/2, 9*mm, f'Page {doc.page}')
    canvas_obj.drawString(20*mm, 9*mm, 'PS ID: SIH26003')
    canvas_obj.drawRightString(w - 20*mm, 9*mm, 'MDoNER')

    canvas_obj.restoreState()

# ============ BUILD DOCUMENT ============
def build_report():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        topMargin=22*mm,
        bottomMargin=22*mm,
        leftMargin=20*mm,
        rightMargin=20*mm,
    )

    elements = []
    
    # TOC
    elements.append(PageBreak())
    elements.append(Paragraph('<b>Table of Contents</b>', S['toc_title']))
    toc_items = [
        '01. Executive Summary', 
        '02. Problem Statement & Deep Analysis', 
        '03. Proposed Solution (8 Core Pillars)',
        '04. System Architecture & Edge Flow', 
        '05. Core AI Engine & Vocal Biomarkers', 
        '06. 100% Offline Edge Infrastructure',
        '07. Platform Modules (13 Clinical Games)', 
        '08. Cultural Integration (NER Therapy)', 
        '09. Technology Stack', 
        '10. Feasibility, Viability & Security',
        '11. Clinical Impact & Medical Benefits', 
        '12. Competitive Advantage vs Generic Apps', 
        '13. Implementation Roadmap',
        '14. Team Members'
    ]
    for item in toc_items:
        elements.append(Paragraph(f'<font color="#0D9488"><b>{item[:2]}</b></font>  {item[4:]}', S['toc']))
    elements.append(PageBreak())

    # 1. Executive Summary
    elements.append(section_header(1, 'Executive Summary'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('<b>CogniCare NER</b> is a highly specialized, AI-powered cognitive gaming and memory assistance platform engineered explicitly for elderly dementia patients in the North Eastern Region (NER). Built for the Ministry of Development of North Eastern Region (MDoNER), this platform directly tackles the massive rural healthcare deficit by deploying culturally localized, offline-first digital therapy.', S['body']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph('At its core, CogniCare replaces generic, English-centric puzzle apps with highly tailored cognitive treatments. It utilizes **Gemini 3.5 AI** for empathetic regional language processing, **Web Audio API** for procedural folk music therapy (binaural beats), and a proprietary **Vocal Biomarker Analyzer** that converts natural speech cadence into clinical MMSE-grade reports for doctors. Crucially, the entire system is architected as an offline-first **Progressive Web App (PWA)**, guaranteeing continuous therapy even in zero-connectivity rural zones.', S['body']))
    elements.append(Spacer(1, 15))
    elements.append(callout_box('Live Clinical Prototype', 'The complete frontend architecture is successfully deployed. It features 13 interactive cognitive games, 7 NER languages, real-time Vocal Biomarker processing via Gemini, and 100% Edge/Offline capability via Service Workers.', SUCCESS))
    elements.append(Spacer(1, 30))

    # 2. Problem Statement
    elements.append(section_header(2, 'Problem Statement & Deep Analysis'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('Dementia affects over 5.3 million elderly in India, with the NER facing extreme compounding challenges. Generic cognitive apps (like Lumosity) fail spectacularly in this demographic for three critical reasons:', S['body']))
    
    ps_rows = [
        ['The Language & Literacy Barrier', 'Existing apps rely on English UI and complex text instructions. Rural NER elderly (Assamese, Mizo, Khasi speakers) are immediately alienated by text-heavy interfaces.'],
        ['The Rural Connectivity Deficit', 'Mainstream ML therapy apps demand persistent 4G connections for cloud-AI processing. In rural NER, internet is intermittent, rendering cloud-dependent apps useless.'],
        ['Cultural & Semantic Disconnect', 'Dementia therapy requires triggering long-term autobiographical memory. Matching generic triangles or recognizing American landmarks does nothing for a patient in Majuli; they need familiar, regional stimuli.'],
        ['The Clinical Tracking Void', 'Caregivers lack the medical training to objectively track decline, leading to reactive emergency care rather than proactive management. Doctors receive no continuous telemetry data.']
    ]
    elements.append(make_table(['Critical Barrier', 'Impact on Current Healthcare System'], ps_rows, col_widths=[50*mm, 115*mm]))
    
    elements.append(PageBreak())

    # 3. Proposed Solution
    elements.append(section_header(3, 'Proposed Solution (8 Core Pillars)'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('CogniCare NER systematically dismantles every barrier mentioned above through 8 interconnected, highly engineered technical pillars:', S['body']))
    elements.append(Spacer(1, 10))
    
    solutions = [
        '<b>1. AI Cognitive Gaming:</b> 13 distinct clinical games targeting 8 specific cognitive domains (Memory, Executive Function, Visuospatial, etc.).',
        '<b>2. Adaptive Difficulty Engine:</b> A real-time ML algorithm that monitors patient struggle (time-to-click, error rate) and auto-scales game complexity to prevent frustration.',
        '<b>3. Voice-First NER Interface:</b> Powered by Gemini 3.5 Assistant, allowing the elderly to navigate entirely by speaking in Assamese, Manipuri, Khasi, Mizo, Bengali, Hindi, or English.',
        '<b>4. Caregiver Clinical Dashboard:</b> Aggregates raw gameplay data and telemetry, converting it into an MMSE-grade Cognitive Wellness Index (CWI) score with automated PDF reports for doctors.',
        '<b>5. 100% Offline Edge PWA:</b> Utilizes IndexedDB and Service Workers to run the entire game engine, telemetry tracking, and procedural audio directly on the device CPU without the internet.',
        '<b>6. NER Cultural Therapy:</b> Games are deeply rooted in regional geography. Patients complete Bihu proverbs, identify Kaziranga animals, and listen to synthesized NER folk instruments to trigger deep memory.',
        '<b>7. Smart Reminders & SOS:</b> Automates caregiver duties with audio medicine/hydration reminders spoken in the native dialect, alongside a one-tap Emergency SOS for wandering risks.',
        '<b>8. Geriatric-First UI Design:</b> Engineered strictly for failing eyesight and motor control. Features 56px+ touch targets, single-tap navigation, ultra-high contrast, and zero nested menus.'
    ]
    for s in solutions:
        elements.append(Paragraph(f'• {s}', S['bullet']))
        elements.append(Spacer(1, 4))
        
    elements.append(Spacer(1, 20))

    # 4. System Architecture
    elements.append(section_header(4, 'System Architecture & Edge Flow'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('The platform is built on a 4-tier edge-native architecture designed to minimize server latency and maximize local processing.', S['body']))
    
    arch_rows = [
        ['1. Patient Interface', 'Web Speech API for STT voice capture, touch events, and a highly accessible Geriatric UI.'],
        ['2. Core AI Engine', 'Gemini 3.5 Voice Assistant, Adaptive Difficulty heuristics, and the Vocal Biomarker Analyzer.'],
        ['3. Data & Sync Layer', 'IndexedDB for persistent offline caching, Service Workers for asset delivery, Web Audio API.'],
        ['4. Clinical Output', 'Caregiver Analytics Dashboard, Sundowning Alerts, MMSE Progress Reports, Medicine Reminders.'],
    ]
    elements.append(make_table(['Architecture Tier', 'Technical Components'], arch_rows, col_widths=[45*mm, 120*mm]))
    
    elements.append(PageBreak())

    # 5. Core AI & Biomarkers
    elements.append(section_header(5, 'Core AI Engine & Vocal Biomarkers'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('<b>5.1 Vocal Biomarker Detection</b>', S['h2']))
    elements.append(Paragraph('The most advanced clinical feature of CogniCare is its ability to conduct passive cognitive assessments via voice. When the patient speaks to the AI Assistant, the system does not just transcribe the text; it analyzes the <i>way</i> the patient speaks.', S['body']))
    
    bio_rows = [
        ['Type-Token Ratio (TTR)', 'Measures vocabulary richness. A dropping TTR indicates semantic memory loss (forgetting words).'],
        ['Filler Word Frequency', 'Counts excessive use of "um," "uh," and regional equivalents, indicating high cognitive load.'],
        ['Speech Cadence & Pauses', 'Measures milliseconds of silence between words. Increased hesitation strongly correlates with early-stage dementia.'],
        ['Sentiment Fluctuations', 'Detects signs of agitation or depression, which are common precursors to Sundowning syndrome.']
    ]
    elements.append(make_table(['Vocal Biomarker', 'Clinical Significance'], bio_rows, col_widths=[50*mm, 115*mm]))

    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>5.2 Gemini 3.5 Integration</b>', S['h2']))
    elements.append(Paragraph('We leverage Google Gemini 3.5 Flash for rapid, empathetic conversational AI. The prompt engineering is specifically tuned to behave as a patient, reassuring companion (Smriti Saathi) that never corrects the patient aggressively, thereby avoiding catastrophic reactions common in dementia care.', S['body']))

    elements.append(Spacer(1, 30))

    # 6. 100% Offline Edge Infrastructure
    elements.append(section_header(6, '100% Offline Edge Infrastructure'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('To solve the rural connectivity crisis, we completely bypassed traditional cloud-heavy app architecture. CogniCare is a Progressive Web App (PWA) that acts as a standalone local application.', S['body']))
    elements.append(Spacer(1, 10))
    
    edge_rows = [
        ['Service Workers', 'Intercepts all network requests. Caches the React bundle, CSS, and game logic locally upon first load. The app opens instantly even in airplane mode.'],
        ['IndexedDB Storage', 'Instead of requiring MongoDB for every action, all game telemetry, CWI scores, and voice logs are saved locally in the browser\'s IndexedDB. Background Sync API pushes data to the cloud only when WiFi returns.'],
        ['Procedural Web Audio', 'Instead of downloading hundreds of megabytes of MP3 files for music therapy, we use the browser\'s native Web Audio API (Oscillators, Gain Nodes) to mathematically synthesize NER instruments on the fly. Zero bandwidth required.']
    ]
    elements.append(make_table(['Edge Technology', 'Implementation Details'], edge_rows, col_widths=[45*mm, 120*mm]))

    elements.append(PageBreak())

    # 7. Platform Modules
    elements.append(section_header(7, 'Platform Modules (13 Clinical Games)'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('The therapy engine comprises 13 mini-games mapped directly to the 8 standard clinical cognitive domains.', S['body']))
    
    games = [
        ('1. Memory Match (Cultural)', 'Short-Term Memory: Patients match pairs of Bihu Dhols, Rhinos, and local textiles. Time-to-match is heavily tracked.'),
        ('2. Family Faces (Emotional)', 'Autobiographical Memory: Caregivers upload family photos. The system asks "Where is Rahul?" to reinforce immediate family bonds.'),
        ('3. Melody Memory (Auditory)', 'Working Memory: Simon-says style pattern matching using synthesized NER instruments (Pepa, Pung) instead of standard beeps.'),
        ('4. Daily Routine Ordering', 'Executive Functioning: Drag-and-drop chronological sorting of daily tasks (e.g., Wake Up -> Tea -> Medicine).'),
        ('5. Cultural Proverb Completion', 'Language Preservation: Completes famous regional proverbs. Helps maintain semantic vocabulary.'),
        ('6. Spatial Shape Rotation', 'Visuospatial Skills: Mentally rotating traditional NER weaving patterns to fit into a grid.'),
        ('7. Sundowning Audio Therapy', 'Clinical Module: Generates 40Hz Gamma binaural beats mixed with procedural rain and folk drone to combat evening agitation. (Not a game, but a therapy tool).')
    ]
    for title, desc in games:
        elements.append(Paragraph(f'<b>{title}</b>', S['h3']))
        elements.append(Paragraph(desc, S['body']))

    elements.append(Spacer(1, 20))

    # 8. Cultural Integration
    elements.append(section_header(8, 'Cultural Integration (NER Therapy)'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('Clinical research proves that dementia patients respond best to stimuli rooted in their deep past. CogniCare replaces sterile, clinical shapes with vibrant, culturally resonant NER themes:', S['body']))
    elements.append(Paragraph('• <b>Visuals:</b> Kaziranga Safari themes, Hornbill festival aesthetics, and regional attire.', S['bullet']))
    elements.append(Paragraph('• <b>Audio:</b> Authentic procedural synthesis of the Bihu Dhol, Bamboo Flute, and Mizo Gong.', S['bullet']))
    elements.append(Paragraph('• <b>Language:</b> Medicine reminders are delivered in the precise local dialect (e.g., Assamese, Khasi), which feels like a family member speaking rather than a robotic alarm.', S['bullet']))

    elements.append(PageBreak())

    # 9. Technology Stack
    elements.append(section_header(9, 'Technology Stack'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('Engineered for maximum performance on low-end Android devices.', S['body']))
    
    tech_rows = [
        ['Frontend / UI', 'React 18, Vite (Rapid Compilation), Tailwind/Custom CSS, Lucide Icons.'],
        ['Edge / Offline', 'PWA Service Workers (Workbox), IndexedDB (LocalForage), Web Audio API.'],
        ['Backend / Sync', 'Node.js, Express.js REST API, MongoDB Atlas (for eventual cloud sync).'],
        ['AI Capabilities', 'Google Gemini 3.5 Flash, Web Speech API (Native STT/TTS).'],
    ]
    elements.append(make_table(['System Layer', 'Technologies Used'], tech_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 30))

    # 10. Feasibility & Viability
    elements.append(section_header(10, 'Feasibility, Viability & Security'))
    elements.append(Spacer(1, 15))
    
    fv_rows = [
        ['Zero Hardware Cost', 'Runs natively in Chrome/Edge on existing ₹5,000 Android phones. No specialized medical tablets required.'],
        ['Frictionless Distribution', 'As a PWA, users simply visit the URL and click "Add to Home Screen". Bypasses the complex Google Play Store update process.'],
        ['Patient Data Privacy', 'Since AI processing and data storage happen locally via IndexedDB, sensitive medical telemetry never leaves the device unless explicitly authorized by the caregiver for cloud backup.'],
    ]
    elements.append(make_table(['Factor', 'Explanation'], fv_rows, col_widths=[45*mm, 120*mm]))

    elements.append(PageBreak())

    # 11 & 12. Impact & Competitive
    elements.append(section_header(11, 'Clinical Impact & Benefits'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('<b>Social Benefit:</b> The Voice-First UI in 7 regional languages removes the digital barrier, restoring dignity to the elderly.', S['bullet']))
    elements.append(Paragraph('<b>Economical Benefit:</b> Free decentralized PWA saves rural families thousands of rupees in traditional therapy travel costs.', S['bullet']))
    elements.append(Paragraph('<b>Environmental Benefit:</b> Edge-AI and procedural audio consume near-zero battery, reducing cloud server carbon footprints and e-waste.', S['bullet']))
    elements.append(Paragraph('<b>Strategic Benefit:</b> Early detection of cognitive decline via Vocal Biomarkers allows MDoNER to proactively triage medical resources across districts.', S['bullet']))
    
    elements.append(Spacer(1, 30))
    elements.append(section_header(12, 'Competitive Advantage'))
    elements.append(Spacer(1, 15))
    comp_rows = [
        ['7 Regional NER Languages', 'Yes', 'No (English only)'],
        ['Vocal Biomarker Tracking', 'Yes', 'No'],
        ['Procedural Folk Audio Therapy', 'Yes', 'No'],
        ['100% Offline PWA (No internet)', 'Yes', 'No (Requires 4G)'],
        ['MMSE-Grade Doctor Reports', 'Yes', 'No'],
    ]
    elements.append(make_table(['Feature', 'CogniCare NER', 'Lumosity / Elevate'], comp_rows, col_widths=[75*mm, 45*mm, 45*mm]))

    elements.append(PageBreak())
    
    # 13 & 14. Roadmap & Team
    elements.append(section_header(13, 'Implementation Roadmap'))
    elements.append(Spacer(1, 15))
    road_rows = [
        ['Phase 1 (Months 1-2)', 'Clinical Validation: Pilot testing the 13 games with 50 local NER patients to fine-tune the Adaptive Difficulty algorithm.'],
        ['Phase 2 (Months 3-4)', 'Language Expansion: Finalizing the Voice-UI for Khasi, Mizo, and Manipuri dialects with native voice-actors for TTS.'],
        ['Phase 3 (Months 5-6)', 'MDoNER Rollout: Deploying the PWA through local primary healthcare centers and ASHA workers in rural districts.'],
    ]
    elements.append(make_table(['Phase', 'Objective'], road_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 30))
    elements.append(section_header(14, 'Team Members'))
    elements.append(Spacer(1, 15))
    team_rows = [
        ['1', 'Darshan Jain (Team Leader)'],
        ['2', 'Chinmay Gour'],
        ['3', 'Prasanna'],
        ['4', 'Tejasree'],
        ['5', 'Apoorva'],
        ['6', 'Khushi'],
    ]
    elements.append(make_table(['#', 'Team Member Name'], team_rows, col_widths=[15*mm, 150*mm]))
    
    elements.append(Spacer(1, 30))
    elements.append(Paragraph('<b>Team Prakalp (130019) | SIH 2026 Grand Finale</b>', S['center_bold']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph('IES College of Technology, Bhopal', S['center']))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph('-- End of Technical Report --', S['center']))

    doc.build(elements, onFirstPage=lambda c, d: CoverPage(c, d), onLaterPages=header_footer)
    print(f"PDF generated: {OUTPUT_PDF}")

if __name__ == '__main__':
    build_report()
