# FlowBudget Specification Package — Revision 1.2

This folder is the implementation-ready specification for FlowBudget (INF 651, Fall 2026). It finalizes the planning work in WBS 1.1.1 and 1.1.2 so that Rithy, Narith and Menghor can build features without making independent architecture or business-rule decisions.

## Status and evidence

| Item | Status |
| --- | --- |
| Documentation | **Complete: finalized for implementation** (2026-11-18) |
| Team approval | **Pending** for all three members (SRS §15). No approval has been recorded or implied. |
| Official rubric | **Verified** from the Canvas PDF in Drive: 8 criteria, 100 points. The per-rating "longer descriptions" are **not available** (OPEN-04). |
| Implementation | **Not started.** `main` @ `ef72f18` is the scaffold only. Every rubric row is "Build ⏳" in the traceability matrix. |
| Wireframes / visual tokens | **Not found** in Drive or the repository (OPEN-05) |
| Drive documents | **Not yet updated** with this content (see [Drive synchronization](#drive-synchronization)) |

## Document map

| # | Deliverable | File | Extends |
| --- | --- | --- | --- |
| 1 | Requirements traceability against the INF 651 rubric | [traceability-matrix.md](traceability-matrix.md) | SRS v1.1 §11, §14 |
| 2 | Final MVP scope and exclusions | [SRS.md §1.4](SRS.md#14-finalized-mvp-scope) | SRS v1.1 §1.4 |
| 3 | Final SRS: functional and non-functional requirements, acceptance criteria | [SRS.md](SRS.md) | Replaces SRS v1.1 for implementation |
| 3 | Decision log and assumptions | [decision-log.md](decision-log.md) | TDD §10 open decisions |
| 4 | Data models: field tables, JSDoc, JSON, Context and selector APIs | [data-contracts.md](data-contracts.md) | TDD §4, Rev 1.1 |
| 4 | Shared test fixture | [fixtures/sample-snapshot.json](fixtures/sample-snapshot.json) | TDD Rev 1.1 "shared fixtures" |
| 5 | Validation and business logic, error messages, expected results | [business-rules.md](business-rules.md) | TDD §5, §7 |
| 6 | User journeys, edge cases, UX states and copy | [user-journeys.md](user-journeys.md) | UI/UX §4, §5, §7 |
| — | WBS status proposals and per-task references | [wbs-updates.md](wbs-updates.md) | WBS Detailed Tasks |

## Where to start

| You are… | Read first |
| --- | --- |
| **Rithy**: Context, storage, selectors, dashboard, routing | data-contracts §9–§13 → business-rules §7, §9 → SRS FR-02, FR-06, FR-07, TR-01–TR-03 |
| **Narith**: transactions, budgets, charts | SRS FR-01, FR-03, FR-02.3–02.4 → business-rules §2–§5, §7 → user-journeys J1, J2 |
| **Menghor**: shared UI, goals, settings | user-journeys §1, §9 → SRS FR-04, FR-05, NFR-02, NFR-06 → business-rules §6, §8 |
| **Anyone testing** | SRS §10 → business-rules §11 (fixture expectations) → user-journeys E2E checks |

## Precedence

If two documents disagree, the higher one wins (DEC-02):

1. **SRS.md** (what must work)
2. **business-rules.md**, **data-contracts.md** (how data and logic behave; TDD addendum)
3. **user-journeys.md** (how the experience behaves; UI/UX addendum)
4. The original Drive documents (SRS v1.1, TDD v1.0/Rev 1.1, UI/UX v1.0/Rev 1.1), wherever this package is silent
5. **WBS** for owners, dates and status; it never overrides requirements

Report a contradiction as a PR that updates every affected file; do not resolve it locally in code.

## Source documents

| Document | Link |
| --- | --- |
| SRS v1.1 | [Google Doc](https://docs.google.com/document/d/1_zqyIHclxDBRhXXjo3lwfPdarfxrrPljWjon4XLyqpY/edit) |
| Technical Design Document | [Google Doc](https://docs.google.com/document/d/1D7AKyv1Vnc7Vk-6_WcsIsArW1sSsRdoS97CYxMdZaLY/edit) |
| UI/UX Specification | [Google Doc](https://docs.google.com/document/d/1NPD1M8ByHAb0Yu-yUyl38HKQt4AVrb4T6xb1W00TejE/edit) |
| Work Breakdown Structure | [Google Sheet](https://docs.google.com/spreadsheets/d/1yJ1o-4ZDTQG6k2BxUvF8Jv4M8fFhYwhVnpoF5QMppt4/edit) |
| Team Development Guide | [Google Doc](https://docs.google.com/document/d/1N03xmlT3ymyNoWY32Dm3A3xlq28ozV-UydcLOHMjOas/edit) |
| Assignment and rubric | [Frontend Development Final Project Assignment.pdf](https://drive.google.com/file/d/18eXbVngo8fzHr8Odj5r3eRhSkcE8Ohkl/view) |
| Drive folder | [final-project](https://drive.google.com/drive/folders/1c90Uqa-h_-SKhzuKvXlTPtuo3Yrd1x20) |

## Drive synchronization

The connector used to prepare this package can **read** Drive files and create new ones, but it cannot **edit** existing Google Docs or Sheets. So none of the Drive documents above has been changed. To bring them in line without creating duplicate documents:

| Drive document | Update to make | Content |
| --- | --- | --- |
| SRS | Add a "Revision 1.2" section, or replace §1.4, §3, §5, §6, §8, §11–§15 | [SRS.md](SRS.md), [traceability-matrix.md](traceability-matrix.md), [decision-log.md](decision-log.md) |
| TDD | Add "Revision 1.2 Addendum: Data contracts and business rules"; replace §4–§5; close §10 open decisions | [data-contracts.md](data-contracts.md), [business-rules.md](business-rules.md) |
| UI/UX Specification | Add "Revision 1.2 Addendum: Journeys, edge cases and UX states"; extend §5 and §7 | [user-journeys.md](user-journeys.md) |
| WBS | Apply proposed statuses, evidence links and notes | [wbs-updates.md](wbs-updates.md) §1, §2, §4 |
| Team Development Guide | No change needed; note that `develop` must be created (OPEN-03) | — |

With the **Google Docs** and **Google Sheets** connectors enabled, these edits can be applied directly to the existing files, keeping the same links.

## Verification performed

- Every expected value in business-rules §2.1–§3.1 and §11 was computed with a throwaway reference implementation of these rules (not committed), and invariants INV-1/INV-2 were checked on every month and budget in the fixture.
- The fixture was validated against the stored-record rules in data-contracts §9 (0 records dropped).
- Requirement, acceptance, rule, decision and invariant IDs were cross-checked: every ID referenced in one file is defined in another.
- Relative links and section anchors in this folder were checked.
- Mermaid flowcharts were checked with the Mermaid parser.
