# FlowBudget — Decision Log and Assumptions (Revision 1.2)

| | |
| --- | --- |
| **Status** | Every decision below is **resolved in the specification** so implementation can proceed. **None has been ratified by the team yet** (WBS 1.1.4). |
| **Rule used** | Reuse the existing SRS/TDD/UI/UX decisions. Where they were silent or ambiguous, pick the simplest option consistent with them (task brief, rule 4). |
| **Changing a decision** | Edit this log in a PR, update every document that cites the decision ID, and get review from the affected owner (Team Guide §5). |

"Source" names where the issue came from. "Affects" names the documents and owners that must follow it.

## 1. Assumptions

| ID | Assumption | If it turns out to be false |
| --- | --- | --- |
| A-01 | One person uses FlowBudget per browser profile; there are no accounts. | Out of MVP scope (SRS §1.4.2). |
| A-02 | A user keeps all records in one currency at a time. | Multi-currency would need a currency field per record; excluded. |
| A-03 | Typical data: up to about 1,000 transactions, 50 goals and 100 budgets. NFR-03 is measured at 1,000 transactions. | Revisit pagination (DEC-33). |
| A-04 | The device's local clock and timezone define "today" and "this month". | Records are never deleted because of clock changes (stored-record rules, BR-STO-04). |
| A-05 | The deadline is Nov 27, 2026, 11:59 PM in the course's Canvas timezone (Team Guide §10). The Canvas PDF shows the due date 11/27/2026 but no time or timezone. It also shows "12/4/2026" next to "Unlimited Attempts Allowed", which is presumably when submissions close, not the due date. | Confirm in Canvas (traceability-matrix §4). |
| A-06 | The rubric criterion titles and point values define what is graded. The per-rating long descriptions were not available. | Re-check the traceability matrix once the long descriptions have been read in Canvas. |
| A-07 | React Router, Tailwind CSS and Recharts will be installed in WBS 1.2.1/1.2.3/1.3.4. Exact versions are the implementer's choice within the agreed stack. | No spec change needed. |
| A-08 | The UI text is English only. KHR is a currency option, not a language option. | Localization is excluded (SRS §1.4.3). |
| A-09 | Team roles and WBS ownership are as in the WBS *Detailed Tasks* sheet as of 2026-11-18. | WBS owners take precedence over this package. |

## 2. Resolved decisions

### 2.1 Process and sources

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-01 | The official requirements baseline is the Canvas assignment PDF in the Drive `final-project` folder. Its 8 criteria and points (10/15/15/10/10/25/10/5) match SRS v1.1 §11. | Found during the rubric review; it removes the need for a provisional baseline. | WBS 1.1.1.1 | SRS §12, traceability matrix |
| DEC-02 | The Markdown package in `docs/specification/` is the implementation source of truth until its content is copied into the Drive documents. Order of precedence on conflict: SRS v1.2 > business-rules/data-contracts (TDD addendum) > user-journeys (UI/UX addendum) > the original Drive documents. | The Drive docs could not be edited with the available connector. A single precedence order stops "which doc wins" arguments. | Task brief, Drive access check | All |
| DEC-36 | WBS status discrepancies are **reported, not changed** (see wbs-updates §3). | Status changes need owner confirmation (Team Guide §12). | WBS review | WBS |

### 2.2 Data and validation

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-03 | A controlled list of 5 income and 9 expense categories (data-contracts §3). No custom or editable categories in the MVP. | TDD §4 "controlled list for the MVP"; TDD §10 asked to finalize it. Custom categories would add CRUD, migration and chart-color work. | TDD §10 open decision | Narith (forms, budgets), charts |
| DEC-04 | Records store the category **ID** (`"food"`), not the label. | Labels can change wording without breaking stored data or budget matching. | TDD §4 ambiguity | All persisted records |
| DEC-05 | `description` is optional, trimmed, ≤ 120 characters, stored as `""` when empty. Lists fall back to the category label. | SRS v1.1 lists the field but does not require it. Optional means less friction for quick expense entry. | SRS FR-01 | Transactions |
| DEC-06 | Amount fields are text inputs with strict formats: USD up to 2 decimals, KHR whole riel, no commas or symbols. Maximum 99,999,999,999 minor units. Parsing uses integer arithmetic only. | Avoids float rounding and ambiguous `1,5`. The bound keeps sums exact. | TDD §5, WBS 1.1.2.2 | money.js, all forms |
| DEC-07 | Deterministic money display that does not depend on the browser locale: `$1,234.56`; `1,234,500៛` (symbol after the number); compact values only on chart axes. | Locale-dependent output varies by browser and breaks fixture tests. | WBS 1.2.4.3 | money.js, charts |
| DEC-08 | Dates are local `YYYY-MM-DD`. Transactions and contributions cannot be dated in the future or before 2000-01-01. Goal target dates are optional and may be in the past. | A tracker records money that has already moved. A lower bound catches year typos. A past target date is informative, not invalid. | TDD §4 | dates.js, validation.js |
| DEC-13 | Date is the only sort key. Equal dates are ordered by insertion (array) order. No `createdAt` field. | WBS 1.3.2.3 only requires date sorting. Array order gives a deterministic tie-break without changing the schema. | TDD §2 "column sorting" ambiguity | Transactions, selectors |
| DEC-15 | The budget form has no month input: it uses the page's selected month (read-only). Edit may change category and limit, with the duplicate check re-run; to move a budget to another month, delete and recreate it. Future months are allowed. The form lists all expense categories; duplicates are caught on submit. | `<input type="month">` is unsupported in desktop Firefox and Safari (NFR-08). Using the page month removes a field and its validation states. Planning next month's budget is a natural use. | SRS FR-03 | Budgets |
| DEC-17 | Goal names are 1–60 characters and unique ignoring case. `targetDate` is optional. An incomplete goal past its date shows "Past target date". | Duplicate names make the dashboard preview ambiguous. | SRS FR-04 | Goals |
| DEC-26 | IDs come from `crypto.randomUUID()`, with a fallback for non-secure contexts (phone testing over LAN HTTP). | `randomUUID` is undefined on `http://192.168.x.x`. | TDD §4 | createId |
| DEC-27 | Context actions validate with the same `lib/validation.js` functions as the forms and return `{ ok, value }` or `{ ok: false, errors }`. They never throw for user errors. | One rule implementation; predictable form handling. | TDD §4 "validate inputs on all write operations" | Context, all forms |

### 2.3 Calculations and dashboard

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-09 | The dashboard reports **one selected month**: current by default, with previous/next navigation, never later than the current month. | TDD §5 "default to the active month"; the UI/UX spec asks for a reporting-period selector. Future months cannot contain transactions. | TDD §10 open decision | Dashboard |
| DEC-10 | The income-vs-expenses chart is a grouped bar chart of the 6 months ending at the selected month. | A single-month, two-bar chart would just repeat the KPI cards. Six months shows the pattern for one extra pure selector, and the budget logic stays single-month (TDD Rev 1.1). | TDD §10 "chart types" | Narith charts |
| DEC-11 | The category chart is a donut for the selected month with a text legend (label, amount, share). | The text legend doubles as the accessible alternative. | TDD §10 | Narith charts |
| DEC-12 | Recent activity shows the 5 newest transactions across all months. | Matches WBS 1.3.4.4 "latest 5". | WBS | Dashboard |
| DEC-14 | Budget status is "within" (spent ≤ limit) or "over" (spent > limit). Exactly at the limit counts as within. `% used` is floored and shown uncapped; the bar is capped at 100%. No "near limit" state. | SRS FR-03 only asks to identify budgets that **exceed** their limits. Flooring never shows 100% early. | SRS FR-03, WBS 1.3.3.3 | Budgets |
| DEC-16 | Goals can be overfunded. The bar is capped at 100% and the text shows the true % plus "over target". Contributions can be added and removed, not edited. | WBS 1.3.5.3 requires overfunding without a bar above 100%. SRS FR-04 lists "record and remove" only. | WBS, SRS | Goals |
| DEC-18 | Contributions stay separate from transactions (existing decision, reaffirmed). /goals tells users so in one sentence. | SRS FR-04 note, TDD §5. The note prevents "why didn't my balance change?" confusion. | SRS/TDD | Goals, Dashboard |

### 2.4 Settings, currency and data management

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-19 | Currency switch: immediate when there are no financial records. Otherwise, after a confirmation that shows counts, says there is no conversion and offers Export, it clears transactions, budgets and goals and keeps the theme. This is implemented as an explicit `switchCurrency` action, not as a side effect of `updateSettings`. | SRS FR-05 note and TDD Rev 1.1 require a reset rather than conversion. A dedicated action makes the destructive path explicit. | TDD §10 "currency reset warnings" | Settings, Context |
| DEC-20 | "Reset all data" is a full factory reset: empty records, USD, dark theme, backup key removed. Only FlowBudget keys are touched. | Matches "factory reset" (TDD §2) and WBS 1.3.6.3 "clears only app data". | TDD | Settings, storage.js |
| DEC-21 | The default theme is **dark**. Light is fully supported. | Visual direction: "Dark Modern Fintech … with light-theme support". | Task brief / UI direction | Theme tokens |
| DEC-22 | Export is the exact persisted snapshot (pretty-printed), named `flowbudget-export-YYYY-MM-DD.json`, and self-validated before download. There is no import. | The simplest format with provable integrity. Import was not approved. | SRS FR-05, task brief | storage.js, Settings |

### 2.5 Persistence and resilience

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-23 | Hydration is synchronous in the `useState` lazy initializer. There are no loading skeletons. | Avoids the "empty first render overwrites saved data" bug. `localStorage` is synchronous anyway. The UI/UX loading state is therefore not needed. | UI/UX §7 | Context, UI/UX |
| DEC-24 | On load, corrupted data is reset to defaults and partly invalid data is salvaged record by record. The raw value is copied to `flowbudget:v1:backup`, and a banner tells the user. Status is exposed as `storageStatus` in Context. | SRS 5.4 "without crashing". Salvage keeps as much user data as possible. The backup makes recovery possible. | SRS NFR 5.4, WBS 1.2.4.2 | storage.js, Context, layout banner |
| DEC-25 | If `localStorage` is unavailable, the app runs in memory with a persistent, non-dismissible warning. Failed saves show a banner and never roll back the change. | Users can keep working and export before closing. | SRS 5.4 | storage.js, layout |
| DEC-31 | No cross-tab synchronization; the last save wins. | Not required. A `storage` listener adds merge problems. | — | Documented limitation |
| DEC-32 | Filters, sort, selected months, form fields and dialog state are local and not persisted (existing TDD Rev 1.1 rule). | Keeps the snapshot to domain data only. | TDD Rev 1.1 | All pages |

### 2.6 UI, platform and delivery

| ID | Decision | Rationale | Source | Affects |
| --- | --- | --- | --- | --- |
| DEC-28 | Supported browsers: the latest two major versions of Chrome, Edge, Firefox, Safari (macOS/iOS) and Chrome Android. | Resolves the TDD §10 open decision. All support ES2020, `localStorage` and `Intl`. | TDD §10 | NFR-08 |
| DEC-29 | Breakpoints follow Tailwind: mobile < 768px (`md`), tablet 768–1023px, desktop ≥ 1024px (`lg`). Sidebar at ≥ 1024px, sticky bottom navigation below. | Matches the UI/UX §6 ranges with standard tokens. "Desktop > 1024" is read as ≥ 1024. | UI/UX §6 | Layout |
| DEC-30 | Vercel must rewrite every path to `/index.html` (`vercel.json`: `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`) so direct URLs and refresh work. | Without it, `/budgets` returns 404 on refresh, which fails the rubric's live-deployment check. | WBS 1.2.2.2, 1.6.1.2 | Rithy (deployment) |
| DEC-33 | No pagination in the transaction list; NFR-03 is measured at 1,000 records. | Typical student data is small; this avoids extra UI states. | — | Transactions |
| DEC-34 | Interaction patterns: create and edit in modal dialogs (full-screen sheet below 768px); destructive actions confirmed in a dialog with Cancel focused first; success feedback as a polite toast (4 s); errors inline. | Consistent with UI/UX §3.3 and §4. One pattern for every page. | UI/UX §3.3 | Shared UI (Menghor) |
| DEC-35 | Charts count as "interactive" through tooltips on hover, tap or keyboard focus, and react to the dashboard month selector. They also provide text alternatives. | The assignment asks for "interactive charts". UI/UX Rev 1.1 asks for accessible alternatives. | Assignment PDF | Charts |
| DEC-37 | Dashboard empty-state calls to action link to `/transactions`; they do not open the add dialog automatically. | Simplest cross-page behavior; no router-state coupling. | UI/UX §4 | Dashboard |

## 3. Decisions still open (need the team, not the spec)

| ID | Open item | Owner | Needed by |
| --- | --- | --- | --- |
| OPEN-01 | Ratify DEC-01…DEC-37 and the SRS v1.2 scope (WBS 1.1.1.3, 1.1.4.1, 1.1.4.2). | All | Before the feature PRs merge |
| OPEN-02 | Confirm the revised WBS owners and hour estimates (SRS v1.1 Rev 1.2 "Outstanding approval"). | All | 1.1.4.2 |
| OPEN-03 | Create the `develop` branch and branch protection (WBS 1.2.1.2). | Rithy | Before the first feature PR |
| OPEN-04 | Read the rubric long descriptions in Canvas and confirm the matrix still holds. | Rithy | 1.1.1.1 sign-off |
| OPEN-05 | Wireframes and visual tokens (WBS 1.1.3): not found in Drive or the repo. The journeys in this package define behavior, not visuals. | Menghor | 1.2.3 |
