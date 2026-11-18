# FlowBudget — Software Requirements Specification (SRS) — Version 1.2

| | |
| --- | --- |
| **Course** | INF 651 — Frontend Development, Fall 2026 |
| **Project** | Personal Finance Tracker (FlowBudget) |
| **Team** | Rithy, Narith, Menghor |
| **Version** | 1.2 — 2026-11-18 |
| **Document status** | **Finalized for implementation.** Team approval **pending** (§15). |
| **Supersedes** | [SRS v1.1 in Google Drive](https://docs.google.com/document/d/1_zqyIHclxDBRhXXjo3lwfPdarfxrrPljWjon4XLyqpY/edit), including its Rev 1.2 addendum, for implementation purposes. The Drive copy is unchanged; see [README](README.md#drive-synchronization). |
| **Submission deadline** | November 27, 2026, 11:59 PM, course timezone (Team Guide §10) |

Version 1.2 keeps all v1.1 functional areas, routes, technology and data-model choices. It turns each functional area into numbered, testable sub-requirements with acceptance criteria, finalizes MVP scope and exclusions, and links each requirement to the official INF 651 rubric. Design decisions are recorded in [decision-log.md](decision-log.md). No new feature areas have been added.

## 1. Introduction

### 1.1 Project overview

FlowBudget is a browser-based personal finance application built with React. It lets users record income and expenses, set monthly category budgets, track savings goals, and review a responsive dashboard. It is aimed at students and young professionals.

### 1.2 Problem statement

Many people struggle to track daily spending, keep to monthly budgets and work toward savings goals. Without a dedicated tool, records become fragmented and planning becomes difficult. FlowBudget brings transactions, budgets and savings goals into one browser-based application.

### 1.3 Project objectives

1. A responsive single-page application built with React and React Router (five pages).
2. Record, edit, delete and filter financial transactions.
3. Interactive charts and financial summaries.
4. Monthly budgeting and savings-goal tracking.
5. React Context API for shared state; `useState` and `useEffect` for component state and side effects.
6. Data persisted in browser `localStorage`.
7. A fully functional deployment on Vercel with public access.

### 1.4 Finalized MVP scope

This is the authoritative scope (deliverable 2 / WBS 1.1.1.2). Anything not listed under "In scope" is out of scope. Adding a feature requires a recorded team decision (Team Guide §8, WBS 1.1.4.2).

#### 1.4.1 In scope

| # | Feature | What the MVP includes | Route | Requirements |
| --- | --- | --- | --- | --- |
| S1 | Transaction management | Add, edit and delete income and expense records (type, amount, category, optional description, date); newest/oldest sort; filters by type, category and inclusive date range | `/transactions` | FR-01 |
| S2 | Financial dashboard and charts | Month selector; income, expense and net KPI cards; 6-month income-vs-expenses bar chart; category donut chart with text legend; 5 recent transactions; savings summary and up to 3 goal previews | `/` | FR-02 |
| S3 | Monthly category budgets | One limit per expense category per month; spent, remaining, % used, progress bar, over-budget status; month navigation | `/budgets` | FR-03 |
| S4 | Savings goals and contributions | Goals with name, target and optional target date; add and remove dated contributions; progress, completion and overfunding states | `/goals` | FR-04 |
| S5 | Settings and theme | Dark (default) and light theme; storage disclosure | `/settings` | FR-05.1, FR-05.5 |
| S6 | USD/KHR selection with reset | One active currency; switching with records requires confirmation and clears financial records; no conversion | `/settings` | FR-05.2 |
| S7 | LocalStorage persistence | Versioned snapshot `flowbudget:v1`; restore on load; recovery from missing, corrupted, partly invalid or unavailable storage | all | FR-06 |
| S8 | JSON data export | Download the current snapshot as `flowbudget-export-YYYY-MM-DD.json` | `/settings` | FR-05.3 |
| S9 | Factory reset | Confirmed deletion of all FlowBudget data in this browser | `/settings` | FR-05.4 |
| S10 | Responsive layout and navigation | Five routes, 404 fallback, sidebar at ≥ 1024px and bottom navigation below; 360–1280px+ without horizontal overflow | all | FR-07, NFR-02 |

#### 1.4.2 Excluded from the MVP

| Excluded | Reason |
| --- | --- |
| Authentication and user accounts | Single-user, browser-only app; the assignment allows localStorage persistence |
| Cloud synchronization, backend or database | No backend in the architecture (TDD §1) |
| Banking or payment integrations; money transfers | Out of course scope; privacy (NFR-05) |
| Automatic currency conversion or exchange rates | Needs live rates; a currency switch clears records instead (DEC-19) |
| AI financial advice | Not part of the selected project brief |
| Data **import** (JSON restore or transaction import) | Not approved; export is a one-way backup (BR-EXP-03) |

#### 1.4.3 Design-level exclusions (finalized in this revision)

These items came up during specification and are deliberately **not** part of the MVP. They need no implementation: custom or editable categories (DEC-03), recurring transactions, sorting by amount or other columns (DEC-13), pagination (DEC-33), editing a contribution in place (DEC-16), copying budgets to the next month, "near limit" budget warnings (DEC-14), cross-tab synchronization (DEC-31), localization other than English UI text, PWA or offline install, and notifications.

### 1.5 Definitions

| Term | Meaning |
| --- | --- |
| Minor units | Integer money: USD cents or whole KHR riel. `1250` = $12.50; `25000` = 25,000៛ |
| Active currency | `settings.currency`; every stored amount is read in this currency |
| Selected month | The `YYYY-MM` shown by a page's month selector (Dashboard, Budgets); local UI state, not persisted |
| Financial records | Transactions, budgets and savings goals (including contributions) |
| Snapshot | The persisted object `{ schemaVersion, transactions, budgets, goals, settings }` |
| Today | The device's local calendar date at the time of the action |

### 1.6 References

| Document | Location | Role |
| --- | --- | --- |
| Official assignment and rubric | Drive: *Frontend Development Final Project Assignment.pdf* (`final-project` folder) | Course requirements baseline |
| Data contracts | [data-contracts.md](data-contracts.md) | Schemas, Context and selector contracts (TDD addendum) |
| Business rules | [business-rules.md](business-rules.md) | Validation, calculations, storage, error messages (TDD addendum) |
| User journeys | [user-journeys.md](user-journeys.md) | Flows, edge cases, UX states and copy (UI/UX addendum) |
| Traceability matrix | [traceability-matrix.md](traceability-matrix.md) | Rubric → requirement → acceptance → verification |
| Decision log | [decision-log.md](decision-log.md) | Assumptions and resolved decisions |
| WBS updates | [wbs-updates.md](wbs-updates.md) | Proposed WBS status, evidence and references |
| TDD, UI/UX Spec, WBS, Team Guide | Google Drive, `final-project` folder (links in [README](README.md#source-documents)) | Earlier baselines, still valid unless superseded here |

## 2. Project team

| Member | Role | Responsibilities |
| --- | --- | --- |
| Rithy | Project Lead & Architecture | Architecture, routing and shell, Finance Context and persistence, selectors, dashboard cards and recent activity, integration, deployment, final submission |
| Narith | Transactions & Budgets Lead | Transaction CRUD, validation and filters, monthly budgets, dashboard chart components, calculation tests |
| Menghor | Savings & UI Lead | Wireframes, shared UI and forms, theme and responsive styles, savings goals, settings, accessibility review |

All members test features, review PRs and review final deliverables. The WBS *Detailed Tasks → Owner* column is authoritative for individual tasks.

## 3. Functional requirements

All sub-requirements are **Must** for the MVP. There are **41** functional sub-requirements (FR-01 to FR-07). The rubric's "at least 90% of planned functionality" therefore means at least **37** must pass; the team target is 41/41 (§12). Acceptance criterion `AC-x.y` verifies requirement `FR-x.y`. "Fixture" means [fixtures/sample-snapshot.json](fixtures/sample-snapshot.json) with today = 2026-11-18. Expected fixture values are in [business-rules.md §11](business-rules.md#11-shared-fixture-and-expected-results).

### FR-01 Transaction management (`/transactions`, owner: Narith, WBS 1.3.1–1.3.2)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-01.1 | The user can add an income or expense transaction with type, amount, category, optional description and date. | **AC-01.1** (a) The form opens with type = Expense, empty amount and category, and date = today. (b) Valid input saves, closes the form, shows "Transaction added." and the record appears at the top of the newest-first list. (c) Each invalid case in business-rules §2.1–§3.1 shows its §10 message beside the field and saves nothing. (d) The category select offers only categories of the chosen type; changing type clears the category (BR-CAT-02). |
| FR-01.2 | The user can edit any transaction. | **AC-01.2** (a) The edit form is pre-filled, with amounts formatted by BR-MONEY-08. (b) Saving updates the row in place and shows "Transaction updated."; the ID and list position for equal dates do not change. (c) Cancel or Escape discards changes. (d) Dashboard and budget values recalculate immediately, including both months when the date moves (BR-TXN-03). |
| FR-01.3 | The user can delete a transaction after confirmation. | **AC-01.3** (a) Delete opens a confirmation naming the category, amount and date. (b) Confirm removes the record and shows "Transaction deleted."; derived values return to their previous values (INV-7). (c) Cancel or Escape keeps the record. |
| FR-01.4 | Transactions are listed in chronological order, newest first by default, with an oldest-first toggle. | **AC-01.4** With the fixture, newest first starts `t-11, t-10, t-09, t-12, t-08` and oldest first matches business-rules §11.4. Each row shows date, description or category label, category, type in text, and a signed amount. |
| FR-01.5 | The user can filter by type, category and inclusive date range, and clear filters. | **AC-01.5** (a) The fixture filter cases in business-rules §11.4 return exactly the listed IDs. (b) `from > to` shows "Start date must be on or before end date." and ignores only the date range. (c) Changing the type resets an incompatible category filter. (d) "Clear filters" restores all records, newest first. (e) "Showing n of N transactions" appears while a filter is active. |
| FR-01.6 | Empty and no-results states explain the next action. | **AC-01.6** With no transactions, the empty state and "Add transaction" button show. With filters that match nothing, "No transactions match these filters." and "Clear filters" show (copy: user-journeys §9.1). |

### FR-02 Financial dashboard (`/`, owners: Rithy for cards and activity, Narith for charts, WBS 1.3.4)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-02.1 | The dashboard reports one selected month: the current month by default, with previous/next navigation and no months after the current one. | **AC-02.1** On load the header shows the current month (e.g. "November 2026"). Previous moves back one month. Next is disabled on the current month. When another month is shown, a "This month" control returns to the current one. |
| FR-02.2 | KPI cards show total income, total expenses and net balance (income − expenses) for the selected month. | **AC-02.2** Fixture: Nov 2026 → $510.00 / $277.51 / $232.49; Oct 2026 → $800.00 / $56.99 / $743.01. A negative net shows a leading "-" and a text label, not color alone. Values match INV-1 and INV-3. |
| FR-02.3 | An interactive grouped bar chart compares income and expenses for the 6 months ending at the selected month. | **AC-02.3** (a) Fixture with Nov 2026 selected: bars for Jun–Nov 2026 with the values in business-rules §11.3, zero months included. (b) Hover, tap or keyboard focus shows a tooltip with the month, income and expenses formatted by BR-MONEY-06. (c) Axes are labelled with compact values (BR-MONEY-07) and there is a legend. (d) A text alternative (an accessible table, or the visible values) exposes the same numbers. (e) If all 6 months are zero, the no-data message shows instead of an empty chart. |
| FR-02.4 | An interactive donut chart shows expenses by category for the selected month, with a text legend. | **AC-02.4** Fixture Nov 2026: Housing & rent $200.00 (72%), Food & dining $37.51 (14%), Education $25.00 (9%), Entertainment $15.00 (5%), in that order. A tooltip on hover or tap shows label, amount and share. With no expenses in the month, "No expenses in {Month YYYY}." shows. |
| FR-02.5 | The 5 most recent transactions (all months) are listed with a link to `/transactions`. | **AC-02.5** Fixture: `t-11, t-10, t-09, t-12, t-08`. "View all" navigates to `/transactions`. |
| FR-02.6 | A savings summary shows the total saved against the total target, plus up to 3 goal previews with progress. | **AC-02.6** Fixture: "Saved $1,180.00 of $2,150.00 across 4 goals"; previews `g-01`, `g-03`, `g-02` with the same % and bars as `/goals` (INV-5). "View goals" navigates to `/goals`. With no goals, "No savings goals yet." and a "Create a goal" link show. |
| FR-02.7 | Empty states guide a first-time user. | **AC-02.7** With no transactions at all, the dashboard shows "No transactions yet" with an "Add transaction" link to `/transactions`. Cards show $0.00 and charts show their no-data messages without errors. |

### FR-03 Budget management (`/budgets`, owner: Narith, WBS 1.3.3)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-03.1 | The page shows the budgets of one selected month (current by default) with previous/next navigation between 2000-01 and 2099-12. | **AC-03.1** On load the current month shows. Navigation changes the list to that month's budgets only. Future months can be selected. |
| FR-03.2 | The user can create a budget with an expense category and a positive limit for the selected month; only one budget per category per month is allowed. | **AC-03.2** (a) The form shows the selected month read-only ("New budget · November 2026") and lists only the 9 expense categories. (b) A valid budget saves, shows "Budget created." and appears in that month's list. (c) A second `food` budget for 2026-11 is rejected with "A Food & dining budget already exists for November 2026. Edit that budget instead." (d) A zero or invalid limit is rejected per business-rules §10. |
| FR-03.3 | The user can edit a budget's category and limit (its month stays fixed). | **AC-03.3** Changes save in place with "Budget updated." Changing the category to one already budgeted that month is rejected with BUDGET_DUPLICATE. Cancel discards changes. |
| FR-03.4 | The user can delete a budget after confirmation. | **AC-03.4** The confirmation says transactions are not affected. Confirm removes only the budget ("Budget deleted."). Cancel keeps it. |
| FR-03.5 | Each budget shows its limit, the amount spent in that category and month, remaining or over amount, % used and a progress bar. | **AC-03.5** Fixture values match business-rules §11.5 for `b-01`…`b-06`. Only expense transactions of that category and month count. Bar width = `barPercent`. |
| FR-03.6 | Over-budget budgets are clearly identified. | **AC-03.6** `b-02` and `b-04` show the text "Over budget" and "Over by $5.00" / "Over by $2.49", plus warning styling. `b-03` (exactly at the limit) shows "On track" and "$0.00 left". |
| FR-03.7 | An empty state explains how to create a budget. | **AC-03.7** A month with no budgets shows "No budgets for {Month YYYY}" and a "Create budget" button. |

### FR-04 Savings goal management (`/goals`, owner: Menghor, WBS 1.3.5)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-04.1 | The user can create a goal with a name, a target amount and an optional target date. | **AC-04.1** A valid goal saves with no contributions and shows "Goal created." An empty name, a target of zero or below, an invalid date, or a duplicate name (ignoring case and spaces) is rejected with the business-rules §10 message. |
| FR-04.2 | The user can edit a goal's name, target and target date without losing contributions. | **AC-04.2** Contributions are unchanged after an edit. Lowering the target to or below the saved amount shows "Goal reached"; raising it above shows "{remaining} to go". |
| FR-04.3 | The user can delete a goal after confirmation, which removes its contributions. | **AC-04.3** The confirmation states the number of contributions and the saved amount being removed. Confirm deletes ("Goal deleted."). Cancel keeps it. Transactions are unchanged. |
| FR-04.4 | The user can add a dated, positive contribution to any goal. | **AC-04.4** A valid contribution updates saved, %, bar and remaining immediately ("Contribution added."). A future date or a zero amount is rejected. Contributions that exceed the target are accepted. |
| FR-04.5 | The user can remove a contribution after confirmation. | **AC-04.5** Confirm removes it ("Contribution removed.") and recalculates progress. Removing `c-05` makes `g-04` incomplete. Cancel keeps it. |
| FR-04.6 | Each goal shows saved, target, remaining or overfunded amount, % and a progress bar capped at 100%, plus complete and past-target-date states. | **AC-04.6** Fixture values match business-rules §11.6. `g-02` shows "110%", a full bar, "Goal reached" and "$80.00 over target". `g-03` shows "Past target date". |
| FR-04.7 | Contributions are tracked separately from transactions. | **AC-04.7** Adding or removing contributions never changes Dashboard income, expenses, net, charts or budgets (INV-6). /goals shows the note "Contributions are tracked separately and don't change your income, expenses, or balance." |
| FR-04.8 | Each goal shows its contribution history, newest first. | **AC-04.8** History shows date and amount, newest first (BR-GOAL-07). A goal with none shows "No contributions yet." |

### FR-05 Application settings (`/settings`, owner: Menghor, WBS 1.3.6)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-05.1 | The user can switch between dark (default) and light themes. | **AC-05.1** First run uses dark. Toggling changes every page immediately and persists after refresh. Both themes meet NFR-06 contrast. |
| FR-05.2 | The user can choose USD or KHR as the single active currency. With financial records present, switching requires confirmation and clears them; amounts are never converted. | **AC-05.2** (a) With no records, the switch happens immediately ("Currency set to KHR."). (b) With records, the dialog shows the counts, "doesn't convert amounts", Export, Cancel (initial focus) and "Delete records and switch" (BR-CUR-03). (c) Cancel or Escape leaves the records and currency unchanged. (d) Confirm clears transactions, budgets and goals, sets the currency, keeps the theme, and shows "Records cleared. Currency set to KHR." (e) After switching to KHR, amount fields accept whole riel only and amounts display as `25,000៛`. |
| FR-05.3 | The user can export all data as JSON. | **AC-05.3** The download is named `flowbudget-export-YYYY-MM-DD.json`. Its parsed content deep-equals the current snapshot and passes `validateSnapshot` with nothing dropped (BR-EXP-01/02). This works with empty data. |
| FR-05.4 | The user can reset all FlowBudget data after confirmation. | **AC-05.4** Confirm clears all records and restores USD and the dark theme ("All data reset."). Other `localStorage` keys are untouched. Cancel changes nothing. |
| FR-05.5 | Settings explains that data stays in this browser and can be lost. | **AC-05.5** The storage notice (user-journeys §9.4) is visible on /settings without any interaction. |

### FR-06 Data persistence (owner: Rithy, WBS 1.2.4, 1.4.3, 1.5.3)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-06.1 | Every change to transactions, budgets, goals, contributions or settings is saved to `localStorage` key `flowbudget:v1` as a versioned snapshot. | **AC-06.1** After any action, the stored value parses to a snapshot with `schemaVersion: 1` that reflects the change. |
| FR-06.2 | Saved data and settings are restored when the app reloads in the same browser profile. | **AC-06.2** After a refresh or browser restart, all records, the theme and the currency are identical, with no flash of empty data and no overwrite. |
| FR-06.3 | Missing, corrupted or partly invalid stored data never crashes the app. | **AC-06.3** (a) Stored value `{not json` → the app loads empty, shows the load error banner, and `flowbudget:v1:backup` holds the raw value. (b) A snapshot with one invalid transaction → the other records load and the banner says "1 saved item couldn't be read and was skipped." (c) No stored key → a normal first run with no banner. |
| FR-06.4 | Unavailable storage and failed saves are reported without losing in-memory work. | **AC-06.4** (a) With `localStorage` access throwing, the app works in memory and shows the persistent storage-unavailable banner. (b) With `setItem` throwing a quota error, the change stays visible, the save-failed banner shows, and it clears after the next successful save. |

### FR-07 Navigation and routing (owner: Rithy, WBS 1.2.2)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-07.1 | Five distinct pages are served at `/`, `/transactions`, `/budgets`, `/goals` and `/settings`. | **AC-07.1** Each route renders its page with a unique `<h1>` (Dashboard, Transactions, Budgets, Savings Goals, Settings). |
| FR-07.2 | A persistent navigation shows all five destinations with the active page indicated. | **AC-07.2** At ≥ 1024px a sidebar shows; below 1024px a sticky bottom bar shows. Each item has a text label. The active item has `aria-current="page"` and a non-color indicator. |
| FR-07.3 | Unknown routes show a not-found page. | **AC-07.3** `/nope` shows "Page not found" with a "Go to dashboard" link. |
| FR-07.4 | Direct URLs, refresh and browser back/forward work, including on the deployed site. | **AC-07.4** On the Vercel URL, opening each of the five routes directly and refreshing loads that page (SPA rewrite, DEC-30). Back and forward move between visited pages. |

## 4. Application pages

| Page | Route | Main features | Requirements |
| --- | --- | --- | --- |
| Dashboard | `/` | Month selector, KPI cards, two charts, recent activity, savings summary | FR-02 |
| Transactions | `/transactions` | CRUD, filters, sort | FR-01 |
| Budgets | `/budgets` | Monthly budgets, progress, over-budget states | FR-03 |
| Savings Goals | `/goals` | Goals, contributions, progress | FR-04 |
| Settings | `/settings` | Theme, currency, export, reset, storage notice | FR-05 |
| Not found | `*` | Fallback with link to Dashboard | FR-07.3 |

## 5. Technical requirements (React rubric criteria)

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| TR-01 | Shared state lives in React Context: `FinanceProvider` wraps the router, and `useFinance()` is the only way pages read or change transactions, budgets, goals and settings ([data-contracts.md §11](data-contracts.md#11-finance-context-contract-usefinance)). | **AC-TR-01** All five pages consume `useFinance()`. No page imports `localStorage` or keeps a private copy of finance data. A change on one page appears on the others without a reload. |
| TR-02 | `useState` manages component and form state: form fields and errors, filters and sort, selected months, open dialogs and toasts, and the provider's snapshot (lazy initializer). | **AC-TR-02** Code review finds `useState` in the provider, every form, the filter bar and both month selectors. |
| TR-03 | `useEffect` handles side effects: persisting the snapshot after each change (BR-STO-01), applying the theme class to `<html>`, and auto-dismissing toasts. | **AC-TR-03** Code review finds these effects with correct dependency arrays. Changing the theme updates `<html class>`. Each change triggers exactly one save. |
| TR-04 | Code is organized by component and responsibility, following the existing scaffold (`pages/`, `components/{layout,ui,charts,forms}/`, `context/`, `hooks/`, `lib/`, `data/`). | **AC-TR-04** Shared calculations and validation exist only in `src/lib/`. Charts receive data through props. Reusable UI lives in `components/ui/`. |

## 6. Non-functional requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| NFR-01 Usability | Consistent navigation and layout; every field has a visible label; required fields are marked; invalid input gives specific, corrective feedback; empty states explain the next action. | Required fields show `*` with `aria-required="true"` and forms show "* Required". Every message comes from business-rules §10. Every empty state in user-journeys §9.1 is implemented. |
| NFR-02 Responsiveness | Works on mobile, tablet and desktop without horizontal overflow of content. | At 360, 390, 768 and 1280px every page has no horizontal scrollbar. Primary actions are visible and reachable. Touch targets are ≥ 44×44px below 768px. The maximum amounts (`$999,999,999.99`, `99,999,999,999៛`) display fully at 360px (they may wrap, never clip). Transaction rows become cards below 768px. |
| NFR-03 Performance | Responds promptly with typical personal data. | With 1,000 transactions over 12 months, filtering, sorting, month changes and adding a record update in under 200 ms on a mid-range laptop (measured with the React Profiler or Performance panel). The production build on Vercel shows the dashboard within 3 s on a typical broadband connection. |
| NFR-04 Reliability | Calculations are consistent, invalid amounts are rejected, data survives refresh and restart, and storage problems never crash the app. | INV-1…INV-7 hold for the fixture and after the mutation checks (business-rules §11.7). FR-06 acceptance criteria pass. No uncaught errors in the console during the regression run. |
| NFR-05 Security & privacy | No credentials or bank data are collected. Financial data never leaves the browser except through a user-initiated export. User text is rendered safely. Storage limits are disclosed. | The app makes no network requests with user data. There is no `dangerouslySetInnerHTML`. Entering `<img src=x onerror=alert(1)>` as a description shows literal text. FR-05.5 passes. |
| NFR-06 Accessibility | WCAG 2.2 AA as the practical target (UI/UX Rev 1.1). Verified, not just claimed. | Keyboard-only users can complete J1–J5 (user-journeys). Focus is visible on every control. Dialogs trap focus, close on Escape and return focus to the trigger. Text contrast is ≥ 4.5:1 and UI-component contrast ≥ 3:1 in both themes. Status (income/expense, over budget, goal reached) is never conveyed by color alone. Charts have text alternatives. Headings are hierarchical (one `<h1>` per page). |
| NFR-07 Maintainability | Code is organized, readable and documented. | TR-04 passes. README documents prerequisites, install, run and build, the architecture and storage (WBS 1.6.2). `npm run build` succeeds with no errors. |
| NFR-08 Compatibility | Current evergreen browsers. | The latest two major versions of Chrome, Edge, Firefox and Safari (macOS and iOS), and Chrome on Android. No polyfills required beyond the `createId` fallback (data-contracts §2.1). |
| NFR-09 Availability | Publicly reachable deployment. | A public Vercel URL loads without login, and FR-07.4 passes on it. |

## 7. Data models

The full contracts (fields, types, defaults, validation, relationships, JSDoc and JSON examples) are in [data-contracts.md](data-contracts.md). Summary, unchanged from v1.1 except for the clarifications listed in data-contracts §1:

| Entity | Fields |
| --- | --- |
| Transaction | `id`, `type` (income/expense), `amountMinor` (integer > 0), `category` (category ID), `description` (optional, ≤ 120), `date` (YYYY-MM-DD) |
| Budget | `id`, `category` (expense category ID), `month` (YYYY-MM), `limitMinor` (integer > 0); unique per category + month |
| SavingsGoal | `id`, `name` (1–60), `targetAmountMinor` (integer > 0), `targetDate` (YYYY-MM-DD or null), `contributions[]` |
| SavingsContribution | `id`, `amountMinor` (integer > 0), `date` (YYYY-MM-DD) |
| Settings | `currency` (USD/KHR, default USD), `theme` (light/dark, default dark) |
| Snapshot | `schemaVersion: 1`, `transactions`, `budgets`, `goals`, `settings`, stored under `flowbudget:v1` |

## 8. Technical architecture

| Technology | Usage |
| --- | --- |
| React + Vite (JavaScript) | Application and build tooling |
| React Router | Five routes plus fallback, browser history |
| Context API | Shared finance state and actions (TR-01) |
| `useState`, `useEffect` | Component state and side effects (TR-02, TR-03) |
| Tailwind CSS | Responsive layout; class-based dark mode on `<html>` |
| Recharts | Bar and donut charts with tooltips |
| `localStorage` | Versioned persistence |
| GitHub, Vercel | Version control and public hosting (with SPA rewrite) |

**Data flow:** user action → form validation (shared validators) → Context action (validates again, updates state) → `useEffect` saves the snapshot → selectors recompute derived values → pages and charts re-render. No backend API is used.

## 9. User stories

| ID | User story | Verified by |
| --- | --- | --- |
| US-01 | I want to record my spending. | AC-01.1, AC-01.4 |
| US-02 | I want to correct financial records. | AC-01.2, AC-01.3 |
| US-03 | I want to find past transactions. | AC-01.5, AC-01.6 |
| US-04 | I want to understand my finances. | AC-02.1, AC-02.2, AC-02.5, AC-02.6 |
| US-05 | I want to monitor spending patterns. | AC-02.3, AC-02.4 |
| US-06 | I want to control monthly spending. | AC-03.1 … AC-03.7 |
| US-07 | I want to save toward a goal. | AC-04.1 … AC-04.8 |
| US-08 | I want my data to remain saved. | AC-06.1 … AC-06.4 |
| US-09 | I want to use my phone. | NFR-02, AC-07.2 |
| US-10 | I want to customize the app. | AC-05.1, AC-05.2 |

## 10. Testing and verification plan

| Level | What | Evidence (recorded in WBS) |
| --- | --- | --- |
| Unit | `money.js`, `dates.js`, `validation.js`, `selectors.js`, `storage.js` against the boundary tables and fixture results in business-rules §2, §3, §11 | Test output or checklist (WBS 1.2.4.3, 1.3.3.4, 1.4.2) |
| Feature acceptance | Every AC in §3 and §5 | Checklist with pass/fail per AC ID (WBS 1.3.x.4, 1.5.1, 1.5.2) |
| Integration | INV-1…INV-7, cross-page updates, persistence after each action | WBS 1.4.2, 1.4.3, 1.5.3 |
| Resilience | AC-06.3, AC-06.4 using DevTools (edit the stored value; simulate quota or blocked storage) | WBS 1.5.3.3 |
| UI and accessibility | NFR-02 at 360, 390, 768, 1280px; NFR-06 keyboard and contrast checks; both themes | WBS 1.5.2.2 |
| Deployment | AC-07.4 and smoke tests J1–J5 on the public URL | WBS 1.6.1.2 |

A test tooling choice (for example Vitest) is not mandated. Pure-function tests or a recorded manual checklist are both acceptable evidence.

## 11. Development and collaboration

Unchanged from v1.1 and the Team Development Guide: `main` is release-only, `develop` is integration, and work happens in `feature/*`, `fix/*`, `test/*`, `integration/*`, `chore/*`, `docs/*` and `design/*` branches. PRs target `develop` and need one teammate review. Changes to shared Context, routes, storage schema or money calculations need review by the affected teammate. **Note (2026-11-18):** the remote repository currently has only `main`, so `develop` must be created before the first feature PR ([wbs-updates.md §3](wbs-updates.md#3-discrepancies-found-not-changed)).

| Period | Milestone |
| --- | --- |
| Nov 11–13 | Requirements, architecture, UI planning (this revision completes the specification part) |
| Nov 14–18 | Core state, transactions, budgets, goals |
| Nov 19–22 | Charts, settings, responsiveness, integration |
| Nov 23–25 | Testing, deployment, documentation |
| Nov 26–27 | Final verification and submission |

## 12. Evaluation criteria alignment

Point values are confirmed from the official Canvas rubric. The full matrix is in [traceability-matrix.md](traceability-matrix.md).

| Rubric criterion | Points | Satisfied by |
| --- | --- | --- |
| At least 5 distinct pages, organized by component | 10 | FR-07, TR-04 |
| Use React context management | 15 | TR-01 |
| useEffect and useState implementation | 15 | TR-02, TR-03 |
| Data persistency | 10 | FR-06, FR-05.3 |
| Live on the Internet | 10 | FR-07.4, NFR-09, DR-01 |
| At least 90% of the overall planned functionality | 25 | FR-01…FR-07 (≥ 37 of 41 sub-requirements; target 41) |
| UX and UI | 10 | NFR-01, NFR-02, NFR-06, FR-07.2 |
| Deliverable requirement | 5 | DR-01…DR-04 |
| **Total** | **100** | |

## 13. Final deliverables

| ID | Deliverable | Acceptance criteria |
| --- | --- | --- |
| DR-01 | Publicly accessible deployed application URL | Opens without login from a fresh browser; AC-07.4 passes |
| DR-02 | Public or readable GitHub repository with a clear README | README has prerequisites, install, `npm run dev` and `npm run build`, feature list, architecture, data-storage note, screenshots, and both links |
| DR-03 | 1–2-page PDF report | Covers approach, challenges, how Context is used, how `useState`/`useEffect` are used, the GitHub link and the live link; at most 2 pages; links verified working |
| DR-04 | Group submission on Canvas | One PDF submitted for the group by Nov 27, 2026, 11:59 PM course time; receipt or screenshot saved (WBS 1.6.4.2) |

## 14. WBS traceability

| Requirement | WBS work packages |
| --- | --- |
| FR-01 Transactions | 1.3.1, 1.3.2, 1.5.1 |
| FR-02 Dashboard | 1.3.4, 1.5.3 |
| FR-03 Budgets | 1.3.3, 1.5.1 |
| FR-04 Savings goals | 1.3.5, 1.5.2 |
| FR-05 Settings | 1.3.6, 1.5.2 |
| FR-06 Persistence | 1.2.4, 1.4.3, 1.5.3 |
| FR-07 Navigation | 1.2.2, 1.5.3.1 |
| TR-01…TR-04 | 1.2.1, 1.2.3, 1.2.4, 1.4.1 |
| NFR-02, NFR-06 | 1.2.3, 1.4.3.1, 1.5.2.2 |
| INV-1…INV-7 | 1.4.2 |
| DR-01…DR-04 | 1.6.1–1.6.4 |

Each subtask's document references are in [wbs-updates.md §2](wbs-updates.md#2-documentation-references-per-work-package). A WBS completion label cannot substitute for passing the linked acceptance criteria (SRS v1.1 §14).

## 15. Approval and evidence status

| Member | Review status | Date |
| --- | --- | --- |
| Rithy | **Pending** | — |
| Narith | **Pending** | — |
| Menghor | **Pending** | — |

No team member has approved v1.2. Approval is recorded here (and in the Drive SRS) only after each member confirms (WBS 1.1.1.3, 1.1.4). Until then the document is *finalized for implementation* but not team-approved.

| Evidence | Status |
| --- | --- |
| Official rubric criteria and points | **Available**: Canvas PDF in Drive (added 2026-11-18) |
| Rubric "longer description" text for each rating | **Unavailable**: not captured in the PDF; open the rubric in Canvas to confirm |
| Wireframes (WBS 1.1.3) | **Unavailable**: no wireframe files in the Drive folder or repository |
| Team approval of SRS, TDD, UI/UX, scope | **Pending** |
| Drive documents updated with v1.2 content | **Pending**: the connector can read but not edit Docs or Sheets (see README) |

## 16. Change log

| Version | Date | Changes |
| --- | --- | --- |
| 1.1 | 2026-11-11 | Draft for team review (Drive); Rev 1.2 addendum added WBS traceability |
| 1.2 | 2026-11-18 | Finalized MVP scope and exclusions (§1.4); FR-01…FR-07 split into 41 testable sub-requirements with acceptance criteria; added FR-07 (navigation, previously SRS §4), TR-01…TR-04 and DR-01…DR-04; measurable NFRs, including NFR-06 accessibility, NFR-08 compatibility and NFR-09 availability; linked to the official rubric; data model clarifications (category IDs, defaults, limits); decision log; approval still pending |
