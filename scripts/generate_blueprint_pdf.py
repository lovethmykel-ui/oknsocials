import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#3B82F6"))
        self.drawString(54, 750, "OKN SOCIAL COMMAND CENTER (OKN SOCIAL OS)")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(558, 750, "MASTER ARCHITECTURAL BLUEPRINT & USER GUIDE")
        
        # Top Rule
        self.setStrokeColor(colors.HexColor("#1E293B"))
        self.setLineWidth(0.75)
        self.line(54, 742, 558, 742)
        
        # Bottom Rule & Footer
        self.line(54, 45, 558, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(54, 32, "Ecosystem: https://okntoken.com  |  https://oknexusexchange.com")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=68,
        bottomMargin=56
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2563EB"),
        spaceAfter=14
    )
    
    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#FFFFFF")
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )
    
    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E3A8A")
    )

    story = []

    # Title Banner
    story.append(Paragraph("OKN Social Command Center", title_style))
    story.append(Paragraph("Master Architectural Blueprint & End-to-End Operations Manual", subtitle_style))
    story.append(Paragraph("<b>Target Ecosystem:</b> OKN Token (<font color='#2563EB'>https://okntoken.com</font>) &amp; OKNEXUS Exchange (<font color='#2563EB'>https://oknexusexchange.com</font>)", body_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=12))

    # Executive Overview
    story.append(Paragraph("1. Executive Summary &amp; Core Philosophy", h1_style))
    story.append(Paragraph(
        "The <b>OKN Social Command Center (OKN Social OS)</b> is an autonomous social operations and executive intelligence platform purpose-built for the OKN ecosystem. It unifies multi-channel publishing, 7-platform unified community moderation, 12 specialized AI autonomous agents, Sentinel real-time threat gating, and executive performance analytics into a single Apple Liquid Glass interface.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Two First-Class Ecosystem Entities:</b>",
        body_style
    ))
    story.append(Paragraph("• <b>OKN Token (<font color='#2563EB'>https://okntoken.com</font>):</b> The utility token and decentralized community engine.", bullet_style))
    story.append(Paragraph("• <b>OKNEXUS Exchange (<font color='#2563EB'>https://oknexusexchange.com</font>):</b> The institutional-grade perpetual DEX and liquidity infrastructure.", bullet_style))
    story.append(Spacer(1, 10))

    # Architecture Matrix
    story.append(Paragraph("2. System Architecture &amp; Module Blueprint", h1_style))
    story.append(Paragraph("The platform is structured into 12 dedicated operational workspaces accessible via the responsive command shell:", body_style))

    table_data = [
        [
            Paragraph("Workspace Module", table_header_style),
            Paragraph("Core Functionality", table_header_style),
            Paragraph("Autonomous Capabilities", table_header_style)
        ],
        [
            Paragraph("<b>Command Center</b>", table_cell_style),
            Paragraph("Executive overview, live KPI cards, sparkline velocity charts, pipeline snapshot.", table_cell_style),
            Paragraph("Automated daily briefing, risk index scoring, priority alert triage.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Social Director</b>", table_cell_style),
            Paragraph("Operational intelligence engine with 9-capability matrix and live decision stream.", table_cell_style),
            Paragraph("Continuous reasoning stream, autonomous task dispatching, risk gating.", table_cell_style)
        ],
        [
            Paragraph("<b>Unified Inbox</b>", table_cell_style),
            Paragraph("3-pane customer relationship inbox across X, IG, LinkedIn, Telegram, YT, TikTok, FB.", table_cell_style),
            Paragraph("Intent classification, sentiment scoring, AI-suggested brand responses.", table_cell_style)
        ],
        [
            Paragraph("<b>Content Studio</b>", table_cell_style),
            Paragraph("Multi-channel composer with 7-platform adaptive synthesis via live Gemini AI.", table_cell_style),
            Paragraph("Auto-tailoring character limits, hashtag extraction, real-time safety gating.", table_cell_style)
        ],
        [
            Paragraph("<b>Content Calendar</b>", table_cell_style),
            Paragraph("Interactive release calendar (Month/Week/List views) with scheduled time slots.", table_cell_style),
            Paragraph("Automated scheduling window optimization based on audience activity.", table_cell_style)
        ],
        [
            Paragraph("<b>Campaign Builder</b>", table_cell_style),
            Paragraph("Multi-stage campaign architecture (Teaser → Educational → Launch → Community).", table_cell_style),
            Paragraph("Reach milestones, budget allocation tracking, phase progression bars.", table_cell_style)
        ],
        [
            Paragraph("<b>Media Vault</b>", table_cell_style),
            Paragraph("Curated brand asset library with aspect ratio tags and metadata inspector.", table_cell_style),
            Paragraph("Auto-tagging, dimension validation, quick-attach to Content Studio.", table_cell_style)
        ],
        [
            Paragraph("<b>Analytics</b>", table_cell_style),
            Paragraph("Executive SVG area charts for 7d/30d/90d reach, impressions, audience breakdown.", table_cell_style),
            Paragraph("Automated engagement velocity and follower trend calculations.", table_cell_style)
        ],
        [
            Paragraph("<b>Social Accounts</b>", table_cell_style),
            Paragraph("Connected platform health monitor, OAuth diagnostics, sync status.", table_cell_style),
            Paragraph("Token expiration warning, auto-reply permissions, rate limit tracking.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Agent Matrix</b>", table_cell_style),
            Paragraph("Roster of 12 specialized agents with granular autonomy level selectors.", table_cell_style),
            Paragraph("Accuracy rate tracking, task completion counter, execution logs.", table_cell_style)
        ],
        [
            Paragraph("<b>Project AI Brain</b>", table_cell_style),
            Paragraph("Knowledge base governing approved voice, official URLs, and forbidden claims.", table_cell_style),
            Paragraph("Direct constraint layer for all Gemini generation and reply drafting.", table_cell_style)
        ],
        [
            Paragraph("<b>System Settings</b>", table_cell_style),
            Paragraph("Supabase RLS database diagnostics, security audit logs, API key management.", table_cell_style),
            Paragraph("Passcode security, session persistence, automation policy overrides.", table_cell_style)
        ]
    ]

    t = Table(table_data, colWidths=[110, 234, 160])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # Page Break for Step-by-Step User Manual
    story.append(PageBreak())

    # Step-by-Step Operations Manual
    story.append(Paragraph("3. Step-by-Step Feature Operations Guide", h1_style))
    story.append(Paragraph("Follow this operational workflow to manage your entire social lifecycle with zero friction:", body_style))
    story.append(Spacer(1, 4))

    # Step 1
    story.append(Paragraph("<b>Step 1: Security Passcode &amp; Project Switching</b>", h2_style))
    story.append(Paragraph("• <b>Passcode Unlock:</b> The command center is gated by a default security PIN: <b><font color='#2563EB'>1234</font></b>. Enter via the tactile numpad or keyboard.", bullet_style))
    story.append(Paragraph("• <b>Project Switcher:</b> Click the top-left logo dropdown in the sidebar to toggle between <b>OKN Token</b> and <b>OKNEXUS Exchange</b>. All metrics, agents, and drafts immediately re-contextualize.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 2
    story.append(Paragraph("<b>Step 2: Connecting &amp; Managing Social Accounts</b>", h2_style))
    story.append(Paragraph("• Navigate to <b>Social Accounts</b> from the sidebar.", bullet_style))
    story.append(Paragraph("• Click <b>'Connect Social Account'</b> to open the integration modal.", bullet_style))
    story.append(Paragraph("• Select from X, Instagram, LinkedIn, Telegram, YouTube, TikTok, or Facebook.", bullet_style))
    story.append(Paragraph("• Set your handle, initial follower baseline, and autonomy permission level (<i>Approval Required</i>, <i>Suggest Only</i>, or <i>Autonomous</i>).", bullet_style))
    story.append(Spacer(1, 6))

    # Step 3
    story.append(Paragraph("<b>Step 3: Generating Multi-Platform Content with Gemini AI</b>", h2_style))
    story.append(Paragraph("• Open the <b>Content Studio</b> workspace.", bullet_style))
    story.append(Paragraph("• Enter your raw release concept (e.g. <i>'OKNEXUS perpetual DEX launch at https://oknexusexchange.com'</i>).", bullet_style))
    story.append(Paragraph("• Click <b>'✦ AI Adapt via Gemini'</b> — the server-side Gemini AI engine synthesizes platform-perfect copy for all 7 channels in parallel.", bullet_style))
    story.append(Paragraph("• Inspect live platform previews (X, Instagram, LinkedIn, Telegram) on the right-hand panel.", bullet_style))
    story.append(Paragraph("• Click <b>'Publish All Now'</b> to trigger confetti celebration and save to your pipeline.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 4
    story.append(Paragraph("<b>Step 4: Unified Inbox &amp; Autonomous AI Responses</b>", h2_style))
    story.append(Paragraph("• Navigate to <b>Unified Inbox</b> to view all community inquiries across all channels.", bullet_style))
    story.append(Paragraph("• Click any thread: the Sentinel engine displays intent badges (<i>Product Question</i>, <i>Security Concern</i>, etc.) and sentiment score.", bullet_style))
    story.append(Paragraph("• Review the <b>'AI Suggested Brand Response'</b> box.", bullet_style))
    story.append(Paragraph("• Click <b>'Insert into Composer'</b>, review the copy, and hit Send.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 5
    story.append(Paragraph("<b>Step 5: Managing Campaigns &amp; Scheduling Releases</b>", h2_style))
    story.append(Paragraph("• Go to <b>Campaigns</b> to build multi-phase releases with target reach and budgets.", bullet_style))
    story.append(Paragraph("• Use the <b>Content Calendar</b> to review release density by day, week, or month.", bullet_style))
    story.append(Spacer(1, 8))

    # Safety Gating Architecture Callout Box
    callout_data = [[
        Paragraph(
            "<b>🛡️ AI Safety Sentinel Architecture:</b><br/>"
            "Every output generated by Gemini AI or drafted by autonomous agents passes through a 4-tier risk classifier. Content containing prohibited keywords (e.g. 'guaranteed returns', 'risk-free', 'seed phrase', '100x') is automatically blocked or flagged for mandatory human review before publishing.",
            callout_style
        )
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#93C5FD")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 14))

    # 4. Official Ecosystem Reference
    story.append(Paragraph("4. Official OKN Ecosystem References", h1_style))
    ref_table_data = [
        [Paragraph("Property", table_header_style), Paragraph("Official URL", table_header_style), Paragraph("Primary Focus", table_header_style)],
        [Paragraph("<b>OKN Token</b>", table_cell_style), Paragraph("<font color='#2563EB'>https://okntoken.com</font>", table_cell_style), Paragraph("Ecosystem utility token, governance, staking &amp; community", table_cell_style)],
        [Paragraph("<b>OKNEXUS Exchange</b>", table_cell_style), Paragraph("<font color='#2563EB'>https://oknexusexchange.com</font>", table_cell_style), Paragraph("Perpetual DEX, institutional liquidity &amp; trading infrastructure", table_cell_style)],
        [Paragraph("<b>GitHub Repository</b>", table_cell_style), Paragraph("<font color='#2563EB'>https://github.com/lovethmykel-ui/oknsocials</font>", table_cell_style), Paragraph("Production codebase, Next.js 16 App Router, Supabase Schema", table_cell_style)],
        [Paragraph("<b>Live Command Center</b>", table_cell_style), Paragraph("<font color='#2563EB'>http://localhost:3000</font> (or Vercel domain)", table_cell_style), Paragraph("Interactive executive command center (PIN: 1234)", table_cell_style)]
    ]
    ref_table = Table(ref_table_data, colWidths=[110, 194, 200])
    ref_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(ref_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: Blueprint PDF generated at {filename}")

if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "OKN_Social_OS_Master_Blueprint.pdf"
    build_pdf(out_path)
