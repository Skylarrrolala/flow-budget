from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "FlowBudget-Final-Report.docx"


def add_hyperlink(paragraph, text, url):
    relationship_id = paragraph.part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), relationship_id)
    run = OxmlElement("w:r")
    properties = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "1D4ED8")
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    properties.extend((color, underline))
    run.append(properties)
    text_element = OxmlElement("w:t")
    text_element.text = text
    run.append(text_element)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def add_heading(document, text):
    paragraph = document.add_paragraph(style="Heading 1")
    paragraph.paragraph_format.keep_with_next = True
    paragraph.add_run(text)
    return paragraph


def add_body(document, text):
    paragraph = document.add_paragraph(text)
    paragraph.paragraph_format.space_after = Pt(5)
    return paragraph


def add_challenge(document, challenge, solution):
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.left_indent = Inches(0.18)
    paragraph.paragraph_format.first_line_indent = Inches(-0.18)
    paragraph.paragraph_format.space_after = Pt(4)
    label = paragraph.add_run(f"{challenge}: ")
    label.bold = True
    paragraph.add_run(solution)
    return paragraph


document = Document()
section = document.sections[0]
section.top_margin = Inches(0.62)
section.bottom_margin = Inches(0.58)
section.left_margin = Inches(0.72)
section.right_margin = Inches(0.72)

styles = document.styles
normal = styles["Normal"]
normal.font.name = "Aptos"
normal.font.size = Pt(9.6)
normal.font.color.rgb = RGBColor(31, 41, 55)
normal.paragraph_format.line_spacing = 1.05
normal.paragraph_format.space_after = Pt(5)

title_style = styles["Title"]
title_style.base_style = normal
title_style.font.name = "Aptos Display"
title_style.font.size = Pt(24)
title_style.font.bold = True
title_style.font.color.rgb = RGBColor(0, 0, 0)

heading_style = styles["Heading 1"]
heading_style.font.name = "Aptos Display"
heading_style.font.size = Pt(13)
heading_style.font.bold = True
heading_style.font.color.rgb = RGBColor(0, 0, 0)
heading_style.paragraph_format.space_before = Pt(8)
heading_style.paragraph_format.space_after = Pt(3)

title = document.add_paragraph(style="Title")
title.alignment = WD_ALIGN_PARAGRAPH.LEFT
title.paragraph_format.space_after = Pt(4)
title.add_run("FlowBudget Final Project Report")
for paragraph_properties in (title_style._element.get_or_add_pPr(), title._p.get_or_add_pPr()):
    borders = paragraph_properties.find(qn("w:pBdr"))
    if borders is not None:
        paragraph_properties.remove(borders)

metadata = document.add_paragraph()
metadata.paragraph_format.space_after = Pt(10)
run = metadata.add_run("INF 651 Frontend Development  |  Fall 2026\nRithy, Narith, and Menghor")
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(75, 85, 99)

add_heading(document, "Project Overview")
add_body(
    document,
    "FlowBudget is a browser-based personal finance tracker built with React and Vite. "
    "It provides five routed views for an overview dashboard, transactions, monthly category budgets, "
    "savings goals, and settings. The application stores its data in the browser, so it works without "
    "a backend or user account. The implemented version supports responsive navigation, USD and KHR "
    "display rules, JSON export, demo data, and light and dark themes.",
)

add_heading(document, "Implementation Approach")
add_body(
    document,
    "We organized the application around small page, form, layout, and user-interface components. React "
    "Router handles navigation between the five views. A shared FinanceProvider owns transactions, budgets, "
    "goals, contributions, and settings and exposes the actions that may update them.",
)
add_body(
    document,
    "Financial records are saved as a versioned snapshot under flowbudget:v1 in localStorage. The storage "
    "utility also migrates the earlier separate keys used during development. Monetary values use integers: "
    "cents for USD and whole riel for KHR. This avoids floating-point errors in totals and percentages.",
)
add_body(
    document,
    "Budget records contain a month, an expense category, and a limit. The three demo budgets are individual "
    "category allocations for Food, Transport, and Entertainment, not one overall monthly cap. Each card sums "
    "only expenses with the same month and category. The final fix changed budget uniqueness from month-only "
    "to month plus category, so several category budgets can exist in one month while duplicates remain blocked.",
)
add_body(
    document,
    "Savings goals keep an amount, optional target date, and separate contribution history. Contributions do "
    "not change transaction balances. Settings controls theme, display currency, export, demo data, and a "
    "confirmed reset. Currency changes require confirmation because the app does not convert saved amounts.",
)

add_heading(document, "Challenges and Solutions")
rows = [
    ("Persistence and schema changes", "A versioned localStorage snapshot migrates older keys and falls back safely when saved JSON is malformed."),
    ("Category budget accuracy", "Spending filters on month and category. Uniqueness uses the same pair, allowing several category budgets per month."),
    ("USD and KHR precision", "Shared money helpers store integer minor units and reject fractional KHR values."),
    ("Currency changes", "Settings warns the user, offers export, and resets financial records only after confirmation."),
    ("Fixed demo dates", "Demo loading shifts the newest record to today while preserving relative dates and the current budget month."),
]
for challenge, solution in rows:
    add_challenge(document, challenge, solution)

document.add_section(WD_SECTION.NEW_PAGE)

add_heading(document, "React Concepts Used")
add_body(
    document,
    "The Context API shares finance data and approved update actions without passing props through every page. "
    "useState manages forms, filters, selected months, dialogs, notifications, and other local interface state. "
    "useEffect applies the selected theme, writes the snapshot to localStorage, and clears timed notifications. "
    "useCallback keeps Context actions stable for consumers. Derived values such as monthly totals, category "
    "spending, remaining budget, and goal progress are calculated from stored records rather than duplicated in state.",
)
add_body(
    document,
    "Reusable components including Button, Card, Modal, ConfirmDialog, ProgressBar, and EmptyState keep behavior "
    "and styling consistent across the application. React Router provides client-side navigation and supports "
    "direct access to all five required routes.",
)

add_heading(document, "Verification")
add_body(
    document,
    "We tested Goals and Settings on the deployed application. Goal checks covered required fields, zero amounts, "
    "duplicate names, editing, contributions, 100 percent completion, overfunding, confirmation dialogs, and "
    "refresh persistence. Settings checks covered theme persistence, current-currency selection, canceling a "
    "currency reset, export feedback, demo replacement confirmation, and factory-reset confirmation. We did not "
    "execute destructive confirmation actions during the live test.",
)
add_body(
    document,
    "The final local verification passed 41 automated tests. Coverage includes storage migration, malformed storage "
    "recovery, optional goal-date persistence, contribution behavior, theme changes, currency reset rules, KHR "
    "validation, demo-date shifting, record editing, and same-month category budgets. ESLint and the Vite production "
    "build also completed successfully. A browser check confirmed category-specific Food, Transport, Entertainment, "
    "and Housing calculations and verified that a newly added Housing budget remained after refresh.",
)

add_heading(document, "Project Links")
github = document.add_paragraph()
github.paragraph_format.space_after = Pt(3)
github.add_run("GitHub repository  ").bold = True
add_hyperlink(github, "github.com/Skylarrrolala/flow-budget", "https://github.com/Skylarrrolala/flow-budget")
live = document.add_paragraph()
live.paragraph_format.space_after = Pt(0)
live.add_run("Live application  ").bold = True
add_hyperlink(live, "flow-budget-navy.vercel.app", "https://flow-budget-navy.vercel.app")

document.core_properties.title = "FlowBudget Final Project Report"
document.core_properties.subject = "INF 651 Frontend Development final project implementation report"
document.core_properties.author = "Rithy, Narith, and Menghor"
document.save(OUTPUT)
print(OUTPUT)
