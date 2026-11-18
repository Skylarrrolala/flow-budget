# FlowBudget — Requirements Traceability Matrix (INF 651)

| | |
| --- | --- |
| **WBS** | 1.1.1.1 "Review requirements against INF 651 rubric": *SRS-to-rubric checklist covers all 8 grading criteria; gaps have action owners.* |
| **Official source** | *Frontend Development Final Project Assignment.pdf*, Google Drive `final-project` folder (Canvas export, added 2026-11-18). Course 5057, due 11/27/2026, 100 points. |
| **Requirement IDs** | [SRS.md](SRS.md) v1.2 (FR, TR, NFR, DR, AC); [business-rules.md](business-rules.md) (BR, INV) |
| **Snapshot date** | 2026-11-18. Repository `main` at `ef72f18` (scaffold only). |

## Status legend

| Column | Values |
| --- | --- |
| **Official** | ✅ Confirmed (criterion title and points read from the Canvas PDF) · ⚠️ Partly (title and points confirmed; per-rating long description **not available** in the PDF) |
| **Spec** | ✅ Specified with acceptance criteria in SRS v1.2 |
| **Build** | ⏳ Not started: no implementation evidence in the repository yet. Updated to 🟡 In progress / ✅ Passed only with linked WBS evidence. |

Compliance cannot be claimed until the "Build" column has evidence. This matrix shows that every official requirement is **specified and traceable**, not that it is met.

## 1. Official rubric criteria (100 points)

The Canvas rubric rows each show "view longer description", but that text was not included in the PDF export, so every row is ⚠️ Partly. Point scales come from the PDF: Exceeds / Mastery / Near / Below / No Evidence.

| ID | Course requirement (points) | FlowBudget implementation | Related requirements | Acceptance criteria | Verification method | WBS | Official | Spec | Build |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RUB-1 | At least 5 distinct pages, organized by component (10) | React Router routes `/`, `/transactions`, `/budgets`, `/goals`, `/settings` plus a 404 page; components in `pages/` and `components/{layout,ui,charts,forms}/` | FR-07.1–FR-07.4, TR-04 | AC-07.1–AC-07.4, AC-TR-04 | Demo of all routes, including direct URL and refresh on Vercel; code inspection of the folder structure | 1.2.2, 1.2.3, 1.5.3.1 | ⚠️ | ✅ | ⏳ |
| RUB-2 | Use React context management (15) | `FinanceProvider` + `useFinance()` hold transactions, budgets, goals, settings and storage status, with named actions; every page consumes it | TR-01; data-contracts §11 | AC-TR-01; INV-7 cross-page update | Code inspection; demo that an action on one page updates the others without reload | 1.2.4.1, 1.4.1 | ⚠️ | ✅ | ⏳ |
| RUB-3 | useEffect and useState implementation (15) | `useState`: provider snapshot (lazy init), forms, filters, month selectors, dialogs, toasts. `useEffect`: snapshot persistence, theme class on `<html>`, toast timers | TR-02, TR-03, BR-STO-01 | AC-TR-02, AC-TR-03 | Code inspection; DevTools check that each change writes once; theme toggle updates `<html>` | 1.2.4.2, 1.3.6.1 | ⚠️ | ✅ | ⏳ |
| RUB-4 | Data persistency (10) | Versioned `localStorage` snapshot `flowbudget:v1`; restore on load; corrupted/partial/unavailable storage recovery; JSON export backup | FR-06.1–FR-06.4, FR-05.3, NFR-04 | AC-06.1–AC-06.4, AC-05.3 | Manual test: refresh and browser restart; DevTools corruption tests; export diff | 1.2.4.2, 1.4.3.2, 1.5.3.2–1.5.3.3 | ⚠️ | ✅ | ⏳ |
| RUB-5 | Live on the Internet (10) | Public Vercel deployment with SPA rewrite (DEC-30) | FR-07.4, NFR-09, DR-01 | AC-07.4, DR-01 criteria | Open the public URL in a fresh browser/incognito; deep-link and refresh each route | 1.6.1.1–1.6.1.2 | ⚠️ | ✅ | ⏳ |
| RUB-6 | At least 90% of the overall planned functionality (25) | Planned functionality = the 41 FR sub-requirements in SRS §3. Threshold 37/41; team target 41/41 | FR-01…FR-07 | AC-01.1…AC-07.4 | AC checklist with pass/fail per ID; pass rate = passed ÷ 41 | 1.5.1–1.5.4 | ⚠️ | ✅ | ⏳ |
| RUB-7 | UX and UI (10) | Dark-first fintech UI with light theme; responsive 360–1280px+; consistent navigation; inline validation; empty, error and confirmation states; WCAG 2.2 AA target | NFR-01, NFR-02, NFR-06, FR-05.1, FR-07.2; user-journeys §9 | NFR-01/02/06 criteria, AC-05.1, AC-07.2 | Viewport test at 360/390/768/1280; keyboard-only run of J1–J5; contrast checks in both themes | 1.1.3, 1.2.3, 1.4.3.1, 1.5.2.2 | ⚠️ | ✅ | ⏳ |
| RUB-8 | Deliverable requirement (5) | Public URL, README, 1–2-page PDF report with both links, Canvas group submission | DR-01…DR-04 | DR-01…DR-04 criteria | Inspection of README and PDF (page count, link check); Canvas receipt | 1.6.2–1.6.4 | ⚠️ | ✅ | ⏳ |

## 2. Assignment details (from the "Details" section of the same PDF)

These are the specific requirements behind the rubric rows. Rows marked "→ RUB-n" are covered there.

| ID | Course requirement | FlowBudget implementation | Related requirements | Acceptance criteria | Verification method | Official | Spec | Build |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ASG-1 | Project option 2, Personal Finance Tracker: "a dashboard for tracking income, expenses, and savings goals" | Dashboard with monthly income, expenses, net, savings summary and goal previews | FR-02.1, FR-02.2, FR-02.6, FR-04 | AC-02.1, AC-02.2, AC-02.6, AC-04.x | Demo with fixture data | ✅ | ✅ | ⏳ |
| ASG-2 | "interactive charts" | 6-month income-vs-expenses bar chart and category donut with tooltips, driven by the month selector | FR-02.3, FR-02.4, DEC-35 | AC-02.3, AC-02.4 | Demo: hover/tap/focus tooltips; change month and see the charts update | ✅ | ✅ | ⏳ |
| ASG-3 | "filtering by category and date" | Type, category and inclusive date-range filters on /transactions; month scoping on Dashboard and Budgets | FR-01.5, FR-02.1, FR-03.1 | AC-01.5, AC-02.1, AC-03.1 | Fixture filter cases (business-rules §11.4) | ✅ | ✅ | ⏳ |
| ASG-4 | "data persistence via local storage or mock authentication" | `localStorage` (no authentication) | → RUB-4 | → RUB-4 | → RUB-4 | ✅ | ✅ | ⏳ |
| ASG-5 | Minimum of 5 distinct pages/views to demonstrate routing and component organization | → RUB-1 | FR-07, TR-04 | → RUB-1 | → RUB-1 | ✅ | ✅ | ⏳ |
| ASG-6 | Use React context to manage global state | → RUB-2 | TR-01 | → RUB-2 | → RUB-2 | ✅ | ✅ | ⏳ |
| ASG-7 | `useEffect` for side effects and `useState` for component state | → RUB-3 | TR-02, TR-03 | → RUB-3 | → RUB-3 | ✅ | ✅ | ⏳ |
| ASG-8 | Browser-level persistence so data is saved between sessions | → RUB-4 | FR-06 | → RUB-4 | → RUB-4 | ✅ | ✅ | ⏳ |
| ASG-9 | Deploy live (Vercel, Netlify, GitHub Pages or similar) | → RUB-5 (Vercel) | NFR-09 | → RUB-5 | → RUB-5 | ✅ | ✅ | ⏳ |
| ASG-10 | Achieve at least 90% of planned functionality | → RUB-6 | FR-01…FR-07 | → RUB-6 | → RUB-6 | ✅ | ✅ | ⏳ |
| ASG-11 | User-friendly interface, good UX/UI, responsive design, intuitive navigation | → RUB-7 | NFR-01, NFR-02, NFR-06, FR-07.2 | → RUB-7 | → RUB-7 | ✅ | ✅ | ⏳ |
| ASG-12 | Deliverable: deployed application URL, publicly accessible | → RUB-5, RUB-8 | DR-01 | DR-01 | → RUB-5 | ✅ | ✅ | ⏳ |
| ASG-13 | Deliverable: source code repository with clear README instructions | Public GitHub repo `Skylarrrolala/flow-budget` (currently public) with README per DR-02 | DR-02, NFR-07 | DR-02 | README inspection by a teammate who follows it from a clean clone | ✅ | ✅ | ⏳ |
| ASG-14 | Deliverable and submission: 1–2-page report on approach, challenges and use of context and hooks, with GitHub and live links | PDF report (WBS 1.6.3) | DR-03, DR-04 | DR-03, DR-04 | Page count ≤ 2; all four topics present; both links open | ✅ | ✅ | ⏳ |
| ASG-15 | Evaluation criterion: "Code organization, clarity, and documentation" | Folder structure, shared `lib/` modules, README, this specification package | TR-04, NFR-07 | AC-TR-04, NFR-07 criteria | Code review on each PR; `npm run build` | ✅ | ✅ | ⏳ |

## 3. Reverse coverage (every planned requirement traces to a course requirement)

| Requirement group | Sub-requirements | Course requirement(s) |
| --- | --- | --- |
| FR-01 Transactions | 6 | RUB-6, ASG-3 |
| FR-02 Dashboard | 7 | RUB-6, ASG-1, ASG-2 |
| FR-03 Budgets | 7 | RUB-6, ASG-3 (month filter) |
| FR-04 Savings goals | 8 | RUB-6, ASG-1 |
| FR-05 Settings | 5 | RUB-6, RUB-4 (export), RUB-7 (theme) |
| FR-06 Persistence | 4 | RUB-4, RUB-6 |
| FR-07 Navigation | 4 | RUB-1, RUB-5, RUB-6 |
| TR-01…TR-04 | 4 | RUB-1, RUB-2, RUB-3, ASG-15 |
| NFR-01…NFR-09 | 9 | RUB-7, RUB-5, ASG-15 |
| DR-01…DR-04 | 4 | RUB-8, ASG-12…ASG-14 |

No functional requirement lacks a course justification, and no course requirement lacks a FlowBudget requirement. Budgets (FR-03) go beyond the brief's minimum. They were in the approved scope from SRS v1.1 and count toward RUB-6 planned functionality.

## 4. Gaps and actions

| Gap | Risk | Action | Owner | WBS |
| --- | --- | --- | --- | --- |
| GAP-1 No feature is implemented yet; `main` is a scaffold (App renders a heading only). | High: 9 days left, 168 planned hours | Start 1.2.x foundation immediately; merge shared UI and Context first (TDD Rev 1.1 rule) | Rithy, then all | 1.2.1–1.2.4 |
| GAP-2 React Router, Tailwind CSS and Recharts are not installed (`package.json` has only React and Vite). | Blocks RUB-1, RUB-7, ASG-2 | Install and configure in the foundation tasks | Rithy, Menghor | 1.2.1.1, 1.2.3 |
| GAP-3 No `develop` branch exists on the remote. | Breaks the agreed PR flow | Create `develop` from `main`; protect `main` | Rithy | 1.2.1.2 |
| GAP-4 Rubric long descriptions were not available. | Hidden grading expectations | Open the rubric in Canvas and add any extra expectation to this matrix | Rithy | 1.1.1.1 |
| GAP-5 No wireframes or visual tokens were found in Drive or the repo. | UI inconsistency | Produce them, or agree to build directly from user-journeys + UI/UX spec | Menghor | 1.1.3 |
| GAP-6 No `vercel.json` rewrite exists yet. | Deep links 404 on refresh, which fails RUB-5 | Add the rewrite (DEC-30) in the deployment task | Rithy | 1.6.1.1 |
| GAP-7 README says no package manifest exists, but `package.json` and `vite.config.js` now exist. | Unclear README (ASG-13) | Update during the README task | Narith | 1.6.2.1 |
| GAP-8 SRS, TDD, UI/UX, scope and owner approvals are all pending. | Process risk; WBS 1.1.4 not started | Review this package and record approvals (SRS §15) | All | 1.1.1.3, 1.1.4 |
| GAP-9 Canvas due time and timezone not shown in the PDF (A-05). | Late submission | Confirm in Canvas; plan to submit by Nov 26 | Rithy | 1.6.4.2 |
