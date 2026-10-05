"""
CogniCare NER — Comprehensive Technical Report PDF Generator
Team Prakalp | SIH 2026
Modeled after the PS1 FreightCast report structure with healthcare-teal theming.
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

# ============ COLORS (Readable, Professional) ============
NAVY = HexColor('#113963')       # Headers, deep accents
PRIMARY = HexColor('#0D6E6E')    # Primary teal — medical feel
TEAL = HexColor('#0F9D8E')       # Accent badges
ORANGE = HexColor('#E8793A')     # Warm accent for stat cards
LIGHT_BG = HexColor('#EBF5F4')   # Table alt-row highlight
BORDER = HexColor('#C8D8D6')     # Table grid
SUCCESS = HexColor('#1A8D5F')    # Callout: positive
DANGER = HexColor('#C53030')     # Callout: alert
TEXT_DARK = HexColor('#000000')  # Pure black for maximum readability
WHITE = white

# ============ OUTPUT ============
OUTPUT_DIR = r"c:\Users\Darsh\OneDrive\Desktop\SIH\PS2\CogniCare"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "CogniCare_NER_Technical_Report.pdf")

# ============ STYLES ============
def get_styles():
    s = {}
    s['h1'] = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=26, textColor=NAVY, spaceBefore=30, spaceAfter=18, leading=32)
    s['h2'] = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=18, textColor=PRIMARY, spaceBefore=22, spaceAfter=12, leading=24)
    s['h3'] = ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=15, textColor=NAVY, spaceBefore=16, spaceAfter=8, leading=20)
    s['body'] = ParagraphStyle('body', fontName='Helvetica', fontSize=14, textColor=TEXT_DARK, leading=22, alignment=TA_JUSTIFY, spaceAfter=14)
    s['body_bold'] = ParagraphStyle('body_bold', fontName='Helvetica-Bold', fontSize=14, textColor=black, leading=22, alignment=TA_JUSTIFY, spaceAfter=14)
    s['bullet'] = ParagraphStyle('bullet', fontName='Helvetica', fontSize=14, textColor=TEXT_DARK, leading=22, leftIndent=25, bulletIndent=12, spaceAfter=10)
    s['toc'] = ParagraphStyle('toc', fontName='Helvetica', fontSize=16, textColor=TEXT_DARK, leading=30, leftIndent=20, spaceAfter=8)
    s['toc_title'] = ParagraphStyle('toc_title', fontName='Helvetica-Bold', fontSize=30, textColor=NAVY, spaceAfter=26)
    s['callout'] = ParagraphStyle('callout', fontName='Helvetica', fontSize=13, textColor=TEXT_DARK, leading=20, leftIndent=12, rightIndent=12)
    s['callout_title'] = ParagraphStyle('callout_title', fontName='Helvetica-Bold', fontSize=14, textColor=NAVY, leading=20, leftIndent=12)
    s['center'] = ParagraphStyle('center', fontName='Helvetica', fontSize=14, textColor=TEXT_DARK, alignment=TA_CENTER, leading=22)
    s['center_bold'] = ParagraphStyle('center_bold', fontName='Helvetica-Bold', fontSize=14, textColor=NAVY, alignment=TA_CENTER, leading=22)
    return s

S = get_styles()

# ============ HELPERS ============
def section_header(num, title):
    data = [[Paragraph(f'<font color="white"><b>{num:02d}</b></font>', ParagraphStyle('badge', fontName='Helvetica-Bold', fontSize=16, textColor=WHITE, alignment=TA_CENTER, leading=18)),
             Paragraph(f'<font color="#113963"><b>{title}</b></font>', S['h1'])]]
    t = Table(data, colWidths=[18*mm, 147*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), PRIMARY),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (0, 0), 4),
        ('RIGHTPADDING', (0, 0), (0, 0), 4),
        ('TOPPADDING', (0, 0), (0, 0), 4),
        ('BOTTOMPADDING', (0, 0), (0, 0), 4),
        ('LINEBELOW', (0, 0), (-1, 0), 2.5, PRIMARY),
    ]))
    return t

def make_table(headers, rows, col_widths=None):
    header_style = ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=13, textColor=WHITE, leading=16)
    cell_style = ParagraphStyle('td', fontName='Helvetica', fontSize=12, textColor=TEXT_DARK, leading=16)
    cell_bold = ParagraphStyle('td_b', fontName='Helvetica-Bold', fontSize=12, textColor=black, leading=16)
    data = [[Paragraph(h, header_style) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cell_bold if i == 0 else cell_style) for i, c in enumerate(row)])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    return t

def callout_box(title, text, color=PRIMARY):
    data = [[Paragraph(title, S['callout_title'])],
            [Paragraph(text, S['callout'])]]
    t = Table(data, colWidths=[165*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('LINEBELOW', (0, 0), (-1, -1), 0, WHITE),
        ('LINEBEFORE', (0, 0), (0, -1), 5, color),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('ROUNDEDCORNERS', [0, 8, 8, 0]),
    ]))
    return t

def stat_cards(items):
    cards = []
    bg_colors = [NAVY, TEAL, ORANGE]
    for i, (value, label) in enumerate(items):
        bg = bg_colors[i % len(bg_colors)]
        card_data = [
            [Paragraph(f'<font color="white" size="24"><b>{value}</b></font>', ParagraphStyle('sv', alignment=TA_CENTER, leading=28))],
            [Paragraph(f'<font color="#ffffff" size="10"><b>{label.upper()}</b></font>', ParagraphStyle('sl', alignment=TA_CENTER, leading=14))]
        ]
        card = Table(card_data, colWidths=[52*mm])
        card.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg),
            ('ROUNDEDCORNERS', [10, 10, 10, 10]),
            ('TOPPADDING', (0, 0), (-1, -1), 16),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        cards.append(card)
    row = Table([cards], colWidths=[55*mm]*3)
    row.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    return row

# ============ COVER PAGE ============
class CoverPage:
    def __init__(self, c, doc):
        w, h = A4
        # Deep medical teal background
        c.setFillColor(HexColor('#0B4F4A'))
        c.rect(0, 0, w, h, fill=1, stroke=0)
        # Subtle accent circles
        c.setFillColor(HexColor('#0D6E6E'))
        c.circle(w + 40, h - 80, 250, fill=1, stroke=0)
        c.setFillColor(HexColor('#083D3A'))
        c.circle(-60, 60, 200, fill=1, stroke=0)

        y = h - 250
        c.setFillColor(HexColor('#A8D8D4'))
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(w/2, y, 'SMART INDIA HACKATHON 2026')

        y -= 20
        c.setStrokeColor(HexColor('#26C6A0'))
        c.setLineWidth(3)
        c.line(w/2 - 60, y, w/2 + 60, y)

        y -= 60
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 46)
        c.drawCentredString(w/2, y, 'CogniCare NER')

        y -= 35
        c.setFont('Helvetica', 18)
        c.setFillColor(HexColor('#D0EDE8'))
        c.drawCentredString(w/2, y, 'AI-Based Cognitive Gaming & Memory')
        y -= 25
        c.drawCentredString(w/2, y, 'Assistance Platform for Elderly Dementia')

        y -= 35
        c.setStrokeColor(HexColor('#26C6A0'))
        c.setLineWidth(2)
        c.line(w/2 - 50, y, w/2 + 50, y)

        meta = [
            ('Problem Statement ID:', 'SIH26003'),
            ('Organization:', 'Ministry of Development of North Eastern Region (MDoNER)'),
            ('Theme:', 'MedTech / BioTech / HealthTech'),
            ('Category:', 'Software'),
            ('Team:', 'Prakalp (130019)'),
            ('Institute:', 'Institute of Engineering & Science, IPS Academy, Indore'),
        ]
        y -= 50
        for label, value in meta:
            c.setFillColor(HexColor('#A8D8D4'))
            c.setFont('Helvetica', 14)
            c.drawCentredString(w/2, y, f'{label}  {value}')
            y -= 26

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(w/2, 40, 'Confidential -- Prepared for SIH 2026 Grand Finale Evaluation')

# ============ PAGE TEMPLATE ============
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    w, h = A4
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(20*mm, h - 12*mm, w - 20*mm, h - 12*mm)
    canvas_obj.setFont('Helvetica-Bold', 10)
    canvas_obj.setFillColor(NAVY)
    canvas_obj.drawString(20*mm, h - 10*mm, 'CogniCare NER -- Technical Report')
    canvas_obj.drawRightString(w - 20*mm, h - 10*mm, 'Team Prakalp | SIH 2026')
    canvas_obj.setStrokeColor(NAVY)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(20*mm, 15*mm, w - 20*mm, 15*mm)
    canvas_obj.setFont('Helvetica-Bold', 10)
    canvas_obj.setFillColor(NAVY)
    canvas_obj.drawCentredString(w/2, 9*mm, f'Page {doc.page}')
    canvas_obj.drawString(20*mm, 9*mm, 'PS ID: SIH26003')
    canvas_obj.drawRightString(w - 20*mm, 9*mm, 'MDoNER')
    canvas_obj.restoreState()

# ============ BUILD DOCUMENT ============
def build_report():
    doc = SimpleDocTemplate(OUTPUT_PDF, pagesize=A4, topMargin=22*mm, bottomMargin=22*mm, leftMargin=20*mm, rightMargin=20*mm)
    elements = []

    # -------- TABLE OF CONTENTS --------
    elements.append(PageBreak())
    elements.append(Paragraph('<b>Table of Contents</b>', S['toc_title']))
    toc = [
        '01. Executive Summary',
        '02. Problem Statement & Analysis',
        '03. Proposed Solution',
        '04. System Architecture',
        '05. AI Engine -- Vocal Biomarker Pipeline',
        '06. Platform Modules (13 Clinical Games & 7 Pages)',
        '07. Procedural NER Audio Engine',
        '08. Technology Stack',
        '09. Key Features & Metrics',
        '10. Feasibility & Viability',
        '11. Impact & Benefits',
        '12. Competitive Advantage',
        '13. Implementation Roadmap',
        '14. Challenges & Mitigations',
        '15. Research References',
        '16. Team Members',
    ]
    for item in toc:
        elements.append(Paragraph(f'<font color="#0D6E6E"><b>{item[:2]}</b></font>  {item[4:]}', S['toc']))
    elements.append(PageBreak())

    # -------- 01 EXECUTIVE SUMMARY --------
    elements.append(section_header(1, 'Executive Summary'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('<b>CogniCare NER</b> is an end-to-end AI-powered cognitive gaming and memory assistance platform built specifically for elderly dementia patients in the North Eastern Region (NER) of India. Developed for the <b>Ministry of Development of North Eastern Region (MDoNER)</b>, our mission is to radically transform dementia care through culturally localized, offline-first digital therapy.', S['body']))
    elements.append(Spacer(1, 15))
    elements.append(stat_cards([('13', 'Clinical Cognitive Games'), ('7', 'NER Languages Supported'), ('100%', 'Offline PWA Ready')]))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph('The platform leverages <b>Google Gemini 3.5 AI</b> for empathetic voice interaction, <b>Vocal Biomarker Analysis</b> for passive cognitive assessment, and the <b>Web Audio API</b> for procedurally synthesized NER folk music therapy. By operating entirely on-device via Service Workers and IndexedDB, CogniCare bridges the extreme digital and medical divide in rural NER, providing world-class cognitive therapy without requiring constant internet connectivity.', S['body']))
    elements.append(Spacer(1, 15))
    elements.append(callout_box('Live & Deployed', 'The working prototype is successfully deployed with 13 functional cognitive games, a complete Caregiver Dashboard, Patient Profiles, Smart Alerts, Medicine Reminders, an Emergency SOS module, and real-time Gemini Voice AI assistance (Smriti Saathi).', SUCCESS))
    elements.append(Spacer(1, 40))

    # -------- 02 PROBLEM STATEMENT --------
    elements.append(section_header(2, 'Problem Statement & Analysis'))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph('<b>2.1 The Core Challenge</b>', S['h2']))
    elements.append(Paragraph('Dementia affects over <b>5.3 million elderly</b> in India, with the North Eastern Region (NER) facing a unique set of compounding challenges. The region suffers from a severe lack of geriatric psychiatric facilities, profound language barriers (Assamese, Mizo, Khasi, Manipuri), and highly intermittent internet connectivity in remote districts like Majuli and Tawang. Existing cognitive apps are entirely in English, culturally alien (western puzzles and shapes), and require persistent 4G connections -- making them utterly useless for the NER elderly population.', S['body']))
    elements.append(Spacer(1, 10))
    elements.append(callout_box('Critical Statistic', 'According to the Alzheimer\'s and Related Disorders Society of India (ARDSI), approximately <b>90% of rural dementia patients remain undiagnosed and untreated</b> due to inaccessible healthcare infrastructure and severe stigma surrounding cognitive decline.', DANGER))

    elements.append(PageBreak())
    elements.append(Paragraph('<b>2.2 Key Pain Points</b>', S['h2']))
    elements.append(make_table(
        ['Identified Pain Point', 'Operational Impact', 'Current System State'],
        [
            ['Language & Literacy Barrier', 'Elderly cannot use existing English apps', 'Severe exclusion of NER patients'],
            ['Rural Connectivity Deficit', 'Cloud-dependent apps fail in remote villages', 'No offline accessibility whatsoever'],
            ['Cultural & Semantic Disconnect', 'Western games fail to trigger long-term memory', 'Low engagement & therapy failure'],
            ['No Clinical Telemetry', 'Doctors receive no continuous progression data', 'Caregivers rely on subjective memory'],
            ['Wandering & Safety Risks', 'Patients get disoriented without supervision', 'High physical danger, no digital SOS'],
            ['Caregiver Burnout', 'Family caregivers face exhaustion with no automation', 'No reminder or monitoring tools available'],
        ],
        col_widths=[52*mm, 63*mm, 50*mm]
    ))

    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>2.3 The Reminiscence Therapy Failure</b>', S['h2']))
    elements.append(Paragraph('Clinical Reminiscence Therapy relies on triggering autobiographical memory through deeply familiar stimuli. When a patient in rural Assam plays a generic brain-training app that asks them to identify a "Snowman" or match abstract geometric shapes, the therapy fails at a neurological level. They require stimuli deeply embedded in their cultural long-term memory -- Kaziranga animals, Bihu festival sounds, regional proverbs -- to spark the correct neural pathways.', S['body']))

    elements.append(PageBreak())

    # -------- 03 PROPOSED SOLUTION --------
    elements.append(section_header(3, 'Proposed Solution'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('CogniCare NER is a <b>comprehensive, culturally-rooted digital therapy platform</b> designed to transform dementia care in the North East. By integrating advanced AI with deep regional localization, we deliver eight interconnected core capabilities:', S['body']))
    elements.append(Spacer(1, 10))
    elements.append(stat_cards([('8', 'Core Solution Pillars'), ('6', 'NER Folk Instruments'), ('56px+', 'Geriatric Touch Targets')]))
    elements.append(Spacer(1, 15))

    elements.append(Paragraph('<b>3.1 Solution Pillars in Detail</b>', S['h2']))
    pillars = [
        '<b>AI Cognitive Gaming Ecosystem:</b> 13 distinct clinical mini-games meticulously mapped to 8 cognitive domains (Memory, Attention, Executive Function, Visuospatial, Language, Problem Solving, Processing Speed, and Motor Skills). Each game uses culturally localized NER stimuli instead of generic western assets.',
        '<b>Voice-First NER Interface (Smriti Saathi):</b> Powered by Gemini 3.5, the elderly navigate entirely by speaking in Assamese, Manipuri, Khasi, Mizo, Bengali, Hindi, or English. The AI is prompt-engineered to employ Validation Therapy -- never aggressively correcting the patient, which can cause catastrophic distress in dementia care.',
        '<b>Vocal Biomarker Detection:</b> While the patient speaks to the AI, the system passively analyzes their speech cadence, filler word frequency (\"um\", \"ah\"), and Type-Token Ratio (TTR) to detect hidden cognitive load and track dementia progression automatically without invasive clinical tests.',
        '<b>100% Offline Edge PWA:</b> Built on React 18, Vite, and Service Workers, the entire game engine, AI scoring, and audio synthesis run locally on the device. IndexedDB stores all patient telemetry, ensuring zero data loss even if the device has no internet for weeks.',
        '<b>Caregiver Clinical Dashboard:</b> Aggregates raw gameplay data and voice biomarker telemetry, converting it into an MMSE-grade Cognitive Wellness Index (CWI) score with weekly trend analysis and automated PDF reports for remote doctors.',
        '<b>Procedural NER Audio Engine:</b> Using the Web Audio API, we mathematically synthesize 6 NER folk instruments (Bihu Dhol, Pepa Horn, Pung Drum, Sarthebari Taal, Bamboo Flute, Mizo Gong) entirely via oscillators and gain nodes. Zero MP3 downloads required -- the app delivers rich cultural music therapy with zero bandwidth.',
        '<b>Smart Reminders & Emergency SOS:</b> Automates caregiver duties with audio medicine and hydration reminders spoken in the patient\'s native dialect. Includes a persistent one-tap Emergency SOS button for wandering risks that instantly contacts the registered caregiver.',
        '<b>Geriatric-First UI/UX:</b> Engineered strictly for failing eyesight and motor control. Features 56px+ touch targets, single-tap navigation, ultra-high contrast themes (including a dedicated High Contrast mode), and zero nested menus. Supports multiple visual themes (Calm Forest, Ocean Breeze, Warm Sunset, High Contrast).',
    ]
    for p in pillars:
        elements.append(Paragraph(f'\u2022 {p}', S['bullet']))
        elements.append(Spacer(1, 5))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph('<b>3.2 Unique Innovation -- Procedural Folk Audio Synthesis</b>', S['h2']))
    elements.append(Paragraph('Our most significant technical innovation is the <b>Procedural NER Audio Engine</b>. Instead of bundling hundreds of megabytes of pre-recorded MP3 files (which would make the app unusable offline on low-storage phones), we use the browser\'s native Web Audio API to mathematically generate authentic NER instrument sounds using oscillator waveforms, frequency ramps, and gain envelopes. This means we deliver rich, clinical-grade music therapy and 40Hz Gamma binaural beats with <b>zero file downloads</b>.', S['body']))
    elements.append(callout_box('Implementation Detail', 'The Bihu Dhol is synthesized using a triangle-wave oscillator starting at 120Hz and ramping exponentially to 40Hz over 300ms. The Pepa Horn uses a sawtooth wave with linear frequency modulation from 440Hz to 520Hz and back. Each instrument is defined in under 15 lines of JavaScript code.', PRIMARY))

    elements.append(PageBreak())

    # -------- 04 SYSTEM ARCHITECTURE --------
    elements.append(section_header(4, 'System Architecture'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('CogniCare follows a robust, <b>4-layer edge-native architecture</b> specifically engineered for offline-first resilience, extreme scalability, and maximum data privacy.', S['body']))
    elements.append(Spacer(1, 8))
    arch_rows = [
        ['1. Patient Interface Layer', 'React 18 PWA with Geriatric UI (56px+ targets). Web Speech API for voice capture. Touch-optimized game components. 4 visual themes + high-contrast mode.'],
        ['2. Core AI & Logic Layer', 'Gemini 3.5 Voice Assistant (Smriti Saathi). Adaptive Difficulty Engine. Vocal Biomarker Analyzer (TTR, Filler Detection, Cadence). CWI Score Calculator. 13 game-logic modules.'],
        ['3. Edge Data & Storage Layer', 'Service Workers (Workbox) for offline asset caching. IndexedDB for persistent patient telemetry. LocalStorage for session data. Web Audio API for procedural NER instrument synthesis.'],
        ['4. Clinical Output Layer', 'Caregiver Dashboard with weekly trend analysis. Patient Profiles module. Smart Alerts engine (Sundowning detection). Medicine Reminders with native-dialect TTS. Emergency SOS module. PDF report generation.'],
    ]
    elements.append(make_table(['Architecture Tier', 'Technical Components & Responsibilities'], arch_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>4.1 Step-by-Step Data Flow</b>', S['h2']))
    flow = [
        '<b>Input:</b> Elderly user interacts via Voice (Hinglish/Regional) through the Web Speech API or large 56px+ touch targets on the Geriatric UI.',
        '<b>AI Processing:</b> Voice input is processed by Gemini 3.5 for conversational response. Simultaneously, the raw transcript is fed to the Vocal Biomarker Analyzer.',
        '<b>Game Logic:</b> Each of the 13 games evaluates response time, accuracy, and error patterns. The Adaptive Difficulty Engine scales complexity in real-time (Levels 1-5) to prevent patient frustration.',
        '<b>Biomarker Extraction:</b> The Speech Analyzer computes Type-Token Ratio, filler word velocity, bigram repetition count, and composite fluency scores from every conversation.',
        '<b>Local Storage:</b> All metrics are stored instantly in the browser via LocalStorage and IndexedDB. Data is absolutely safe even if the device has zero connectivity.',
        '<b>Clinical Output:</b> When the caregiver logs in, the Dashboard visualizes CWI progress, the Alerts page flags Sundowning anomalies, and the Patient Profiles module tracks individual histories.',
    ]
    for i, f in enumerate(flow):
        elements.append(Paragraph(f'<b>{i+1}.</b> {f}', S['bullet']))

    elements.append(PageBreak())

    # -------- 05 AI ENGINE --------
    elements.append(section_header(5, 'AI Engine -- Vocal Biomarker Pipeline'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('The most clinically advanced feature of CogniCare is its ability to conduct <b>passive cognitive assessments via voice</b>. When the patient speaks to the Smriti Saathi AI Assistant, the system does not just transcribe text -- it analyzes the <i>way</i> the patient speaks.', S['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph('<b>5.1 Vocal Biomarker Metrics</b>', S['h2']))
    bio_rows = [
        ['Type-Token Ratio (TTR)', 'Measures vocabulary diversity. Ratio of unique words to total words. A declining TTR is a clinical indicator of Semantic Dementia (the patient is forgetting vocabulary).'],
        ['Filler Word Velocity', 'Detects excessive use of hesitation markers (\"um\", \"uh\", \"hmm\", \"matlab\", \"wo\", \"kya\"). Supports both Hindi and English fillers. High frequency indicates high cognitive load.'],
        ['Bigram Repetition Count', 'Counts repeated two-word phrases in speech. High repetition indicates perseveration -- a well-documented symptom of frontal-temporal dementia.'],
        ['Avg Words Per Utterance', 'Short, fragmented sentences (under 3 words per utterance) indicate language degradation and increased difficulty with sentence construction.'],
        ['Composite Fluency Score', 'A weighted 0-100 score combining vocabulary diversity (50%), filler penalty (30%), and brevity penalty (20%). Lower scores trigger clinical alerts to caregivers.'],
    ]
    elements.append(make_table(['Biomarker Metric', 'Algorithmic & Clinical Significance'], bio_rows, col_widths=[50*mm, 115*mm]))

    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>5.2 Gemini 3.5 -- Validation Therapy Prompt Architecture</b>', S['h2']))
    elements.append(Paragraph('We leverage Google Gemini 3.5 Flash for rapid, empathetic conversational AI. However, raw LLMs can be dangerous for dementia patients if they aggressively correct factual errors (e.g., if a patient insists it is 1985, correcting them causes extreme distress). Our system injects a carefully tuned system prompt forcing the AI to employ <b>Validation Therapy</b> -- agreeing with the patient\'s emotional reality, validating their feelings, and gently redirecting the conversation without confrontation.', S['body']))

    elements.append(PageBreak())

    # -------- 06 PLATFORM MODULES --------
    elements.append(section_header(6, 'Platform Modules (13 Games & 7 Pages)'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('The CogniCare therapy engine comprises <b>13 clinical mini-games</b> and <b>7 dedicated application pages</b>, providing comprehensive coverage across all cognitive domains and caregiver workflows.', S['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph('<b>6.1 The 13 Clinical Games</b>', S['h2']))
    games = [
        ('Memory Match (Cultural)', 'Short-Term Visual Memory: Patients match pairs of Bihu Dhols, Rhinos, Japi hats, and local textiles. Time-to-match and error count are heavily tracked for CWI calculations.'),
        ('Family Faces (Emotional Recall)', 'Autobiographical Memory: Caregivers upload family photos. The game asks patients to identify family members by name. Triggers deep emotional memory recall and strengthens personal identity.'),
        ('Melody Memory (Auditory)', 'Working Memory: Simon-says style pattern matching using procedurally synthesized NER instruments (Pepa Horn, Pung Drum, Sarthebari Taal). Patient must repeat the audio pattern correctly.'),
        ('Daily Routine Ordering', 'Executive Functioning: Drag-and-drop chronological sorting of daily tasks (e.g., Wake Up, Brush, Chai, Walk, Medicine). Strengthens sequential planning abilities.'),
        ('Cultural Connections', 'Associative Memory: Connecting related cultural items (e.g., linking Bihu with Assam, linking Pung with Manipur). Tests semantic association networks.'),
        ('Proverb Completion', 'Language Preservation: Completes famous Assamese, Hindi, or regional proverbs with missing words. Tests semantic vocabulary and long-term linguistic memory.'),
        ('Word Completion', 'Linguistics & Spelling: Filling in missing letters of common household words. Maintains active vocabulary and prevents linguistic degradation.'),
        ('Number Patterns', 'Mathematical Cognition: Identifying the next number in simple sequences. Maintains basic arithmetic reasoning and numerical pattern recognition.'),
        ('Colour-Word Matching', 'Attention & Focus: A Stroop-test variant. The word "RED" appears in blue ink -- the patient must identify the ink color, testing inhibitory control and focused attention.'),
        ('Market Sorting', 'Categorization: Sorting grocery items into correct categories (Fruits, Vegetables, Grains). Tests semantic categorization and daily-life problem solving.'),
        ('Odd One Out', 'Visual Discrimination: Identifying which item does not belong in a set. Tests pattern recognition and logical reasoning abilities.'),
        ('Pattern Replication', 'Visuospatial Skills: Reproducing visual patterns on a grid. Tests spatial memory, motor planning, and hand-eye coordination.'),
        ('Calm Mode & Sundowning Therapy', 'Therapeutics: Not a game, but a clinical module. Generates 40Hz Gamma binaural beats mixed with procedural rain sounds and folk drone to combat evening agitation (Sundowning syndrome). Uses Web Audio API oscillators for zero-download therapy.'),
    ]
    for title, desc in games:
        elements.append(Paragraph(f'<b>{title}</b>', S['h3']))
        elements.append(Paragraph(desc, S['body']))

    elements.append(PageBreak())
    elements.append(Paragraph('<b>6.2 The 7 Application Pages</b>', S['h2']))
    page_rows = [
        ['Landing Page', 'Dual-portal entry (Patient Portal / Caregiver Portal). MMSE-style onboarding assessment. Mood check-in module. Language and theme selection.'],
        ['Patient Hub (Game Center)', 'Grid display of all 13 cognitive games with difficulty indicators. Tracks recent scores and streaks. Adaptive recommendations based on weakest cognitive domains.'],
        ['Smriti Phone', 'A simplified phone-like interface for elderly to call the AI assistant. Large buttons, familiar phone UI metaphor, reduced cognitive load for initiating voice conversations.'],
        ['Reminders', 'Configurable medicine, hydration, and exercise reminders. Plays audio alerts in the patient\'s native language using browser TTS. Tracks adherence history.'],
        ['Caregiver Dashboard', 'Comprehensive analytics: weekly CWI trends, per-game performance breakdown, vocal biomarker history, session duration tracking, and caregiver burnout risk assessment.'],
        ['Patient Profiles', 'Multi-patient management. Caregivers can register multiple elderly family members, each with independent game history, biomarker baselines, and personalized difficulty settings.'],
        ['Alerts Page', 'Automated clinical alerts: Sundowning risk warnings (based on evening session anomalies), missed medication alerts, sudden CWI score drops, and caregiver burnout indicators.'],
    ]
    elements.append(make_table(['Page Module', 'Detailed Functionality'], page_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 15))
    elements.append(callout_box('Smriti Saathi -- The AI Companion', 'A proprietary Gemini-powered AI companion integrated as a floating widget across the entire application. It allows elderly patients to ask questions, request game explanations, or simply have a comforting conversation in their regional language. The Smriti Saathi widget provides SHAP-like conversational justifications and never argues with the patient.', TEAL))

    elements.append(PageBreak())

    # -------- 07 PROCEDURAL AUDIO --------
    elements.append(section_header(7, 'Procedural NER Audio Engine'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('Clinical research proves that music from a patient\'s cultural background activates deep memory pathways that bypass damaged cortical regions. CogniCare implements a zero-download audio engine using the Web Audio API.', S['body']))
    elements.append(Spacer(1, 10))

    audio_rows = [
        ['Bihu Dhol', 'Triangle wave, 120Hz -> 40Hz exponential ramp, 400ms duration', 'Deep drum hit characteristic of Assamese Bihu festivals'],
        ['Pepa Horn', 'Sawtooth wave, 440Hz -> 520Hz -> 440Hz linear ramp, 600ms', 'Reed horn sound iconic to Assamese folk music'],
        ['Pung Drum', 'Sine wave, 200Hz -> 80Hz exponential ramp, 350ms', 'Manipuri body drum used in Ras Leela performances'],
        ['Sarthebari Taal', 'Square wave, 800Hz -> 600Hz, 1000ms sustained', 'Bell-metal cymbal chime from Assamese tradition'],
        ['Bamboo Flute', 'Sine wave, 523Hz -> 587Hz linear, 700ms with attack envelope', 'Melodic NER bamboo flute with natural vibrato effect'],
        ['Mizo Gong', 'Sine wave, 220Hz -> 180Hz, 2000ms long sustain', 'Deep resonant gong characteristic of Mizo culture'],
    ]
    elements.append(make_table(['NER Instrument', 'Synthesis Parameters (Waveform, Frequency, Duration)', 'Cultural Significance'], audio_rows, col_widths=[35*mm, 75*mm, 55*mm]))

    elements.append(Spacer(1, 15))
    elements.append(Paragraph('Additionally, the platform generates <b>Success Chimes</b> (ascending C-E-G triad at 523/659/784Hz) and <b>Encouragement Tones</b> (gentle G->E descending at 392->330Hz) to provide positive auditory reinforcement without downloading any sound files.', S['body']))

    elements.append(PageBreak())

    # -------- 08 TECH STACK --------
    elements.append(section_header(8, 'Technology Stack'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('CogniCare is built using a modern, lightweight technology stack optimized for low-end Android devices prevalent in rural India.', S['body']))
    elements.append(Spacer(1, 10))
    tech_rows = [
        ['Frontend Application', 'React 18, Vite (lightning-fast HMR), React Router DOM, Lucide Icons, CSS3 Custom Properties, 4 visual themes.'],
        ['Offline Engine', 'PWA Service Workers (Workbox) for asset caching, IndexedDB (via LocalForage) for persistent patient data, Background Sync API for eventual cloud sync.'],
        ['AI & Voice', 'Google Gemini 3.5 Flash API (Smriti Saathi), Web Speech API (Native browser STT/TTS), Custom speechAnalyzer.js for biomarker extraction.'],
        ['Audio Synthesis', 'Native Web Audio API (OscillatorNode, GainNode, BiquadFilterNode) for zero-download procedural NER instruments and binaural beat therapy.'],
        ['State Management', 'React Context API (AppContext.jsx -- 81KB comprehensive state) managing patient profiles, game scores, language settings, theme preferences, and reminder schedules.'],
    ]
    elements.append(make_table(['Architectural Layer', 'Specific Technologies Utilized'], tech_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 30))

    # -------- 09 KEY FEATURES --------
    elements.append(section_header(9, 'Key Features & Metrics'))
    elements.append(Spacer(1, 15))
    elements.append(stat_cards([('13', 'Clinical Games'), ('7', 'App Pages'), ('6', 'Synthesized Instruments')]))
    elements.append(Spacer(1, 15))
    feat_rows = [
        ['Cognitive Games', '13 mini-games', 'Covers all 8 standard clinical cognitive domains'],
        ['Application Pages', '7 dedicated pages', 'Full patient + caregiver workflow coverage'],
        ['Languages Supported', '7 NER languages', 'Assamese, Manipuri, Khasi, Mizo, Bengali, Hindi, English'],
        ['Vocal Biomarkers', '5 metrics tracked', 'TTR, Filler Velocity, Repetition, Brevity, Fluency Score'],
        ['NER Instruments', '6 synthesized', 'Bihu Dhol, Pepa, Pung, Taal, Bamboo Flute, Mizo Gong'],
        ['Visual Themes', '4 themes + modes', 'Calm Forest, Ocean Breeze, Warm Sunset, High Contrast'],
        ['Touch Target Size', '56px+ minimum', 'Exceeds WCAG AAA requirements for motor impairment'],
        ['Offline Capability', '100% PWA', 'Full functionality without any internet connection'],
    ]
    elements.append(make_table(['Feature Category', 'Achieved Value', 'Clinical Significance'], feat_rows, col_widths=[45*mm, 40*mm, 80*mm]))

    elements.append(PageBreak())

    # -------- 10 FEASIBILITY --------
    elements.append(section_header(10, 'Feasibility & Viability'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('<b>10.1 Implementation Feasibility</b>', S['h2']))
    feas_rows = [
        ['Zero Hardware Cost', 'Runs natively in Chrome/Edge on any existing smartphone. No specialized medical tablets required. Works on phones as affordable as Rs. 5,000.'],
        ['Frictionless Distribution', 'As a PWA, users simply visit the URL and click \"Add to Home Screen\". Completely bypasses the Google Play Store and eliminates complex app update processes.'],
        ['Zero External Dependencies', 'The offline engine uses only native browser APIs (Web Audio, Web Speech, IndexedDB). The only external service is Gemini API, which degrades gracefully when offline.'],
        ['Data Privacy by Design', 'All patient telemetry is stored locally via IndexedDB. Sensitive medical data never leaves the device unless explicitly authorized by the registered caregiver.'],
    ]
    elements.append(make_table(['Feasibility Factor', 'Technical Assessment'], feas_rows, col_widths=[55*mm, 110*mm]))

    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>10.2 Economic Viability</b>', S['h2']))
    viab_rows = [
        ['Zero Licensing Costs', 'Built entirely on open web standards. No proprietary framework licenses. The Gemini API is the only marginal cost, with a generous free tier.'],
        ['Scalable Architecture', 'The edge-native design means server costs remain near zero regardless of user count. 100 or 100,000 patients can use the app simultaneously without additional infrastructure.'],
        ['Cost Savings for Families', 'Traditional cognitive therapy sessions cost Rs. 1,500+ each and require travel to Tier-1 cities. CogniCare delivers equivalent therapy for free, on existing phones.'],
    ]
    elements.append(make_table(['Viability Factor', 'Economic Assessment'], viab_rows, col_widths=[55*mm, 110*mm]))

    elements.append(PageBreak())

    # -------- 11 IMPACT --------
    elements.append(section_header(11, 'Impact & Benefits'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('The deployment of CogniCare NER will create a measurable, transformative impact across the social, economic, environmental, and strategic dimensions of healthcare delivery in the North Eastern Region.', S['body']))
    elements.append(Spacer(1, 10))
    impact_rows = [
        ['Accessibility Impact', '100% offline PWA architecture ensures elderly patients in deep rural NER receive uninterrupted cognitive therapy without requiring 4G internet connectivity.'],
        ['Cultural Impact', 'Culturally rooted games using Assamese proverbs, Kaziranga geography, and procedural NER folk instruments trigger deep autobiographical memory far more effectively than generic western puzzle apps.'],
        ['Healthcare Impact', 'AI Vocal Biomarkers automatically convert daily patient interactions into objective, MMSE-grade clinical data, giving local doctors accurate cognitive progression tracking for the first time.'],
        ['Psychological Impact', 'Automated native-dialect medicine reminders and procedural Sundowning audio therapy drastically reduce the severe burden of caregiver burnout across NER families.'],
        ['Social Benefit', 'The Voice-First UI in 7 regional languages removes the digital literacy barrier, restoring dignity, independence, and social connection to the elderly.'],
        ['Economical Benefit', 'Free decentralized PWA on existing low-end smartphones saves rural families thousands of rupees per month in traditional therapy travel and consultation costs.'],
        ['Environmental Benefit', 'Local edge-AI processing and procedural audio synthesis consume near-zero battery and zero cloud server power, reducing e-waste and carbon footprints.'],
        ['Strategic Benefit', 'Provides MDoNER with an unprecedented real-time early-warning radar. AI detection of cognitive decline allows the government to proactively triage medical resources to specific districts.'],
    ]
    elements.append(make_table(['Impact Dimension', 'Resulting Organizational & Societal Benefit'], impact_rows, col_widths=[45*mm, 120*mm]))

    elements.append(Spacer(1, 30))

    # -------- 12 COMPETITIVE ADVANTAGE --------
    elements.append(section_header(12, 'Competitive Advantage'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('When compared against traditional generic brain-training apps and manual care methods, CogniCare NER provides an insurmountable clinical advantage tailored specifically for India\'s NER.', S['body']))
    elements.append(Spacer(1, 10))
    comp_rows = [
        ['7 Regional NER Languages', 'Yes', 'No (English only)', 'If available locally'],
        ['Vocal Biomarker Detection (5 metrics)', 'Yes', 'No', 'No'],
        ['Procedural Folk Audio Therapy (6 instruments)', 'Yes', 'No', 'No'],
        ['100% Offline PWA Capability', 'Yes', 'No (Requires 4G)', 'N/A'],
        ['MMSE-Grade Clinical Telemetry', 'Yes', 'No', 'Subjective only'],
        ['Geriatric-First UI (56px+ targets)', 'Yes', 'No', 'N/A'],
        ['Caregiver Burnout Assessment', 'Yes', 'No', 'No'],
        ['Emergency Wandering SOS', 'Yes', 'No', 'No'],
    ]
    elements.append(make_table(['Capability / Feature', 'CogniCare NER', 'Lumosity/Elevate', 'Traditional Care'], comp_rows, col_widths=[60*mm, 35*mm, 35*mm, 35*mm]))

    elements.append(PageBreak())

    # -------- 13 ROADMAP --------
    elements.append(section_header(13, 'Implementation Roadmap'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('We have designed a phased, low-risk implementation strategy that integrates seamlessly into the existing NER healthcare infrastructure.', S['body']))
    elements.append(Spacer(1, 10))
    road_rows = [
        ['Phase 1: Clinical Validation (Month 1-2)', 'Pilot testing 13 games with 50 elderly NER patients to fine-tune the Adaptive Difficulty algorithm and validate Vocal Biomarker thresholds against clinical MMSE scores.'],
        ['Phase 2: Language Expansion (Month 3-4)', 'Finalizing Voice-UI for deep regional Khasi, Mizo, and Manipuri dialects with native voice-actor TTS recordings for maximum cultural authenticity.'],
        ['Phase 3: MDoNER Rollout (Month 5-6)', 'Deploying the PWA through local primary healthcare centers and ASHA workers in targeted rural districts (Majuli, Tawang, Churachandpur).'],
        ['Phase 4: National Scaling (Month 7-12)', 'Abstracting the cultural game modules to support southern and western Indian demographics. Integrating with the National Health Stack and Ayushman Bharat Digital Mission (ABDM).'],
    ]
    elements.append(make_table(['Rollout Phase', 'Strategic Objectives & Description'], road_rows, col_widths=[55*mm, 110*mm]))

    elements.append(Spacer(1, 30))

    # -------- 14 CHALLENGES --------
    elements.append(section_header(14, 'Challenges & Mitigations'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('We proactively identified and engineered technical solutions for the primary risks associated with deploying AI-powered healthcare in remote NER regions.', S['body']))
    elements.append(Spacer(1, 10))
    chal_rows = [
        ['Zero Connectivity', 'Internet is absent for days in rural NER', 'Built 100% offline PWA with Service Workers and IndexedDB. Procedural audio eliminates all download dependencies.'],
        ['Digital Illiteracy', 'Elderly patients cannot navigate complex UIs', 'Developed Voice-First interface + 56px touch targets + single-tap navigation. Zero nested menus.'],
        ['Cultural Sensitivity', 'Generic western games cause disengagement', 'All 13 games use localized NER stimuli (Kaziranga, Bihu, regional proverbs). Validated with regional cultural experts.'],
        ['Patient Distress Risk', 'Aggressive AI corrections trigger catastrophic reactions', 'Gemini is prompt-tuned for Validation Therapy. The AI never argues with the patient, only validates and redirects.'],
    ]
    elements.append(make_table(['Identified Challenge', 'Core Problem', 'Engineered Mitigation'], chal_rows, col_widths=[42*mm, 45*mm, 78*mm]))

    elements.append(PageBreak())

    # -------- 15 REFERENCES --------
    elements.append(section_header(15, 'Research References'))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph('CogniCare NER is built upon a foundation of peer-reviewed academic research and official government healthcare documentation.', S['body']))
    elements.append(Spacer(1, 10))
    ref_rows = [
        ['1', 'Alzheimer\'s & Related Disorders Society of India (ARDSI), Dementia India Report 2023', 'Epidemiological basis for 5.3M patient statistic'],
        ['2', 'Woods et al., \"Reminiscence Therapy for Dementia,\" Cochrane Database, 2018', 'Clinical foundation for culturally localized stimuli'],
        ['3', 'Satoh et al., \"Music Therapy for Dementia,\" Brain Sciences, 2015', 'Evidence for music-based memory activation'],
        ['4', 'Konig et al., \"Automatic Speech Analysis for Dementia Detection,\" Alzheimer\'s & Dementia, 2015', 'Foundation for vocal biomarker pipeline'],
        ['5', 'W3C Web Audio API Specification', 'Technical standard for procedural audio synthesis'],
        ['6', 'Google Gemini API Documentation, 2026', 'Integration reference for Smriti Saathi AI'],
        ['7', 'Ministry of Health, National Programme for Health Care of the Elderly (NPHCE)', 'Policy alignment for NER geriatric healthcare'],
        ['8', 'National Mental Health Survey of India, NIMHANS, 2016', 'Mental health infrastructure gaps in NER states'],
    ]
    elements.append(make_table(['Ref', 'Academic or Institutional Source', 'Platform Integration'], ref_rows, col_widths=[10*mm, 95*mm, 60*mm]))

    elements.append(Spacer(1, 30))

    # -------- 16 TEAM --------
    elements.append(section_header(16, 'Team Members'))
    elements.append(Spacer(1, 15))
    team_rows = [
        ['1', 'Darshan Jain (Team Leader)'],
        ['2', 'Apurva Verma'],
        ['3', 'Tejasree'],
        ['4', 'Chinmay Gour'],
        ['5', 'Prasanna Parmar'],
        ['6', 'Puja Pawar'],
    ]
    elements.append(make_table(['#', 'Team Member Name'], team_rows, col_widths=[15*mm, 150*mm]))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph('<b>Institute of Engineering &amp; Science, IPS Academy, Indore</b>', S['center_bold']))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph('-- End of Technical Report --', S['center']))

    doc.build(elements, onFirstPage=lambda c, d: CoverPage(c, d), onLaterPages=header_footer)
    print(f"PDF generated: {OUTPUT_PDF}")

if __name__ == '__main__':
    build_report()
