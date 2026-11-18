# FlowBudget — WBS Status and Documentation References (2026-11-18)

| | |
| --- | --- |
| **Target** | [FlowBudget - WBS](https://docs.google.com/spreadsheets/d/1yJ1o-4ZDTQG6k2BxUvF8Jv4M8fFhYwhVnpoF5QMppt4/edit) (Google Sheet) |
| **Why this file exists** | The available Drive connector can read the WBS but not edit it. These are **proposed** updates for a teammate to apply. Nothing in the sheet has been changed. |
| **Rules followed** | Team Guide §6 and §12: a task is **Done** only after its acceptance check passes **and** review evidence is linked; parent status is derived and must not be overridden by hand. |

## 1. Proposed status updates (Detailed Tasks sheet)

Only tasks that this specification package directly addresses are listed. **None is proposed as Done**, because none has teammate review yet.

| Detail ID | Task | Current | Proposed | Evidence / PR (column J) | Notes (column L) |
| --- | --- | --- | --- | --- | --- |
| 1.1.1.1 | Review requirements against INF 651 rubric | Not Started | **In Review** | `docs/specification/traceability-matrix.md` (branch `docs/spec-finalization`) | All 8 rubric criteria mapped; 9 gaps with owners. Rubric long descriptions not available (OPEN-04). |
| 1.1.1.2 | Agree project MVP and exclusions | Not Started | **In Review** | `docs/specification/SRS.md` §1.4 | Scope written; the acceptance check needs the team to agree **in writing**. |
| 1.1.1.3 | Record team approval on SRS | Not Started | Not Started (unchanged) | Approval table ready: SRS.md §15 | Waiting for all 3 members. |
| 1.1.2.1 | Define transaction, budget, goal and settings schemas | Not Started | **In Review** | `docs/specification/data-contracts.md` | Covers 6 contracts (plus contribution and snapshot), JSDoc, JSON examples, Context and selector APIs. |
| 1.1.2.2 | Define money/date/category validation rules | Not Started | **In Review** | `docs/specification/business-rules.md` §2–§4, §10 | Includes USD/KHR boundary tables and the message catalog. |
| 1.1.2.3 | Map main user journeys and edge cases | Not Started | **In Review** | `docs/specification/user-journeys.md` | 6 journeys with Mermaid flowcharts, 25 edge cases, UX copy. |
| 1.1.4.1 | Review technical architecture and UI as a team | Not Started | Not Started (unchanged) | Review input: `docs/specification/README.md` | Start when 1.1.2.x reviews begin. |

Parent effect once applied: 1.1.2 stays **In Progress** until 1.1.2.1–1.1.2.3 are reviewed and Done. 1.1.1 should become **In Progress** (see D-1).

## 2. Documentation references per work package

Paste into the *Detailed Tasks → Notes* column, or keep here as the lookup. Abbreviations: **SRS** = [SRS.md](SRS.md), **DC** = [data-contracts.md](data-contracts.md), **BR** = [business-rules.md](business-rules.md), **UJ** = [user-journeys.md](user-journeys.md), **DL** = [decision-log.md](decision-log.md), **RTM** = [traceability-matrix.md](traceability-matrix.md).

| Detail ID | Owner | Follow these sections |
| --- | --- | --- |
| 1.1.1.1 | Rithy | RTM §1–§4 |
| 1.1.1.2 | Rithy | SRS §1.4; DL §2 |
| 1.1.1.3 | Rithy | SRS §15 |
| 1.1.2.1 | Rithy | DC §3–§9 |
| 1.1.2.2 | Rithy | BR §2–§4, §10 |
| 1.1.2.3 | Rithy | UJ §2–§10 |
| 1.1.3.1 | Menghor | UJ §2, §5, §9.1 |
| 1.1.3.2 | Menghor | UJ §3, §4, §6, §9 |
| 1.1.3.3 | Menghor | SRS NFR-02, NFR-06; DL DEC-21, DEC-29 |
| 1.1.4.1 | Narith | Entire package; DL §3 |
| 1.1.4.2 | Rithy | SRS §1.4, §2; DL OPEN-01, OPEN-02 |
| 1.2.1.1 | Rithy | SRS §8; DL A-07 |
| 1.2.1.2 | Rithy | SRS §11; DL OPEN-03 |
| 1.2.2.1 | Rithy | SRS FR-07.2; DL DEC-29; UJ §1 |
| 1.2.2.2 | Rithy | SRS FR-07.1, FR-07.3, FR-07.4; DL DEC-30 |
| 1.2.2.3 | Menghor | SRS AC-07.2, NFR-02 |
| 1.2.3.1 | Menghor | UJ §1, §9.3; SRS NFR-06 |
| 1.2.3.2 | Menghor | SRS NFR-02; DL DEC-21, DEC-29 |
| 1.2.3.3 | Menghor | UJ §9.1–§9.4 |
| 1.2.4.1 | Rithy | DC §10–§13; DL DEC-27 |
| 1.2.4.2 | Rithy | BR §9; DC §9–§10; UJ §7 |
| 1.2.4.3 | Rithy | BR §2, §3, §7, §11; DC §12–§13 |
| 1.3.1.1 | Narith | SRS FR-01.1; BR §2–§4; UJ §2 |
| 1.3.1.2 | Narith | SRS FR-01.4; BR-SORT-01, BR-MONEY-06, BR-MONEY-09, BR-TXN-02 |
| 1.3.1.3 | Narith | SRS FR-01.2, FR-01.3; UJ §9.3 |
| 1.3.1.4 | Narith | SRS AC-01.1–AC-01.3, AC-06.1; BR §2.1, §2.2, §3.1 |
| 1.3.2.1 | Narith | SRS FR-01.5; BR-FLT-01, BR-FLT-02, BR-CAT-03 |
| 1.3.2.2 | Narith | BR-FLT-01, BR-FLT-03; BR §11.4 |
| 1.3.2.3 | Narith | BR-SORT-01, BR-FLT-04; UJ §9.1 |
| 1.3.3.1 | Narith | SRS FR-03.1, FR-03.2; BR-BUD-01, BR-BUD-03, BR-BUD-04 |
| 1.3.3.2 | Narith | SRS FR-03.3, FR-03.4; BR-BUD-02, BR-BUD-07 |
| 1.3.3.3 | Narith | SRS FR-03.5, FR-03.6; BR-CALC-04, BR-BUD-05 |
| 1.3.3.4 | Narith | BR §11.5, §11.7; UJ E-01, E-08–E-10 |
| 1.3.4.1 | Rithy | SRS FR-02.1, FR-02.2; BR-CALC-02 |
| 1.3.4.2 | Narith | SRS FR-02.3; BR-CALC-08, BR-MONEY-07; DL DEC-10, DEC-35 |
| 1.3.4.3 | Narith | SRS FR-02.4; BR-CALC-03; DL DEC-11 |
| 1.3.4.4 | Rithy | SRS FR-02.5, FR-02.6; BR-CALC-10, BR-CALC-11 |
| 1.3.4.5 | Rithy | SRS AC-02.7; BR §11.1–§11.3, §11.6 |
| 1.3.5.1 | Menghor | SRS FR-04.1–FR-04.3; BR-GOAL-01–03, BR-GOAL-06, BR-GOAL-08 |
| 1.3.5.2 | Menghor | SRS FR-04.4, FR-04.5, FR-04.8; BR-GOAL-04, BR-GOAL-07 |
| 1.3.5.3 | Menghor | SRS FR-04.6; BR-CALC-05, BR-GOAL-05 |
| 1.3.5.4 | Menghor | SRS AC-04.1–AC-04.8; BR §11.6, §11.7 |
| 1.3.6.1 | Menghor | SRS FR-05.1, TR-03; DL DEC-21 |
| 1.3.6.2 | Menghor | SRS FR-05.2; BR-CUR-01–03; UJ §6 |
| 1.3.6.3 | Menghor | SRS FR-05.3, FR-05.4; BR-EXP-01–03, BR-CUR-04 |
| 1.3.6.4 | Menghor | SRS FR-05.5; UJ §9.4 (N-STORAGE) |
| 1.4.1.1 | Rithy | SRS TR-01; DC §11 |
| 1.4.1.2 | Rithy | SRS TR-01; UJ §8 |
| 1.4.2.1 | Rithy | BR §7.1 (INV-1–INV-7), §11.7 |
| 1.4.2.2 | Narith | BR §11.5, §11.6; `fixtures/sample-snapshot.json` |
| 1.4.3.1 | Menghor | UJ §1, §9; SRS FR-07.2 |
| 1.4.3.2 | Narith | SRS FR-06.1, FR-06.2; UJ §8 |
| 1.5.1.1 | Narith | SRS AC-01.1–AC-01.6; UJ §2 |
| 1.5.1.2 | Narith | SRS AC-03.1–AC-03.7; UJ §3 |
| 1.5.2.1 | Menghor | SRS AC-04.x, AC-05.x; UJ §4, §6 |
| 1.5.2.2 | Menghor | SRS NFR-02, NFR-06 |
| 1.5.3.1 | Narith | SRS FR-07.4 |
| 1.5.3.2 | Rithy | SRS TR-01, FR-06.2 |
| 1.5.3.3 | Rithy | SRS FR-06.3, FR-06.4; BR §2, §3, §9; UJ §7 |
| 1.5.4.1 | Narith | Use AC and BR IDs in bug titles |
| 1.5.4.2 | Rithy | SRS §10; RTM RUB-6 (pass rate ≥ 37/41) |
| 1.6.1.1 | Rithy | DL DEC-30; SRS NFR-09 |
| 1.6.1.2 | Rithy | SRS AC-07.4; UJ E-24 |
| 1.6.2.1 | Narith | SRS DR-02, NFR-07; RTM GAP-7 |
| 1.6.2.2 | Menghor | SRS DR-02 |
| 1.6.3.1 | Menghor | SRS DR-03; RTM ASG-14 |
| 1.6.3.2 | Rithy | SRS DR-03 |
| 1.6.4.1 | Menghor | SRS §15, DR-01–DR-04 |
| 1.6.4.2 | Rithy | SRS DR-04; DL A-05 |

## 3. Discrepancies found (not changed)

| ID | Observation (2026-11-18) | Evidence | Suggested action | Owner |
| --- | --- | --- | --- | --- |
| D-1 | **1.1.1** shows *Completed* while 1.1.1.1–1.1.1.3 are all *Not Started* and Subtask Progress is 0%. Team Guide §12: a parent is Completed only if all children are Done. | WBS Tracker row 1.1.1 | Check whether the parent status formula was overwritten; restore the formula. | Rithy |
| D-2 | **1.2.1** shows *Completed*, but 1.2.1.1 and 1.2.1.2 are *Not Started*. The repo has `package.json`, `vite.config.js` and the folder scaffold (PR #1, merged Nov 11), but there is no evidence for "npm run dev/build succeed" and **no `develop` branch** exists on the remote. | `git branch -a` shows only `main` | Record build evidence; create `develop`; let the status derive. | Rithy |
| D-3 | **1.2.2** shows *Completed*, but React Router is not installed, `src/routes/AppRoutes.jsx` contains only a comment, and `App.jsx` renders a single heading. | `main` @ `ef72f18` | Set back to derived status (Not Started) unless routing exists on an unpushed branch. | Rithy |
| D-4 | Most Planning and Foundation tasks are past their due dates (Nov 11–15) and *Not Started*; 1.3.1 was due Nov 17. | WBS dates vs. today (Nov 18) | Re-plan the Nov 18–24 feature window; keep the Nov 24 regression gate and the Nov 25 release target. | All |
| D-5 | README says "no package manifest or build configuration exists", which is outdated. | `README.md` vs. `package.json` | Fix in the README task. | Narith (1.6.2.1) |

## 4. How to apply

1. Open the WBS → **Detailed Tasks**. For each row in §1, set **Status** (column H), **Evidence / PR** (J) and **Notes** (L) as proposed. Leave **Actual Hours** (N) to the person who did the work.
2. Do not edit parent rows; check that their formulas recalculate (D-1).
3. After teammates review the package, move 1.1.1.1, 1.1.1.2 and 1.1.2.1–1.1.2.3 to **Done** and record approvals in SRS §15 (WBS 1.1.1.3).
