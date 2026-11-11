# FlowBudget

**Status: scaffold only — not yet implemented or runnable.**

FlowBudget is the INF 651 Frontend Development final project for Fall 2026. It is planned as a personal finance tracker for students and young professionals, with a responsive dashboard, income and expense records, monthly category budgets, savings goals, and application settings.

The source files currently contain purpose comments only. No components, routes, hooks, state, calculations, styles, or persistence behavior have been implemented. No dependencies are installed and no package manifest or build configuration exists.

## Planned technology

| Technology | Intended use |
| --- | --- |
| React and JavaScript | Single-page application and interface behavior |
| Vite | Local development and production builds |
| Tailwind CSS | Responsive styling and themes |
| React Router | Navigation across five pages |
| Context API, useState, useEffect | Shared finance data, local form state, and synchronization |
| Recharts | Dashboard charts derived from finance data |
| Browser localStorage | Versioned persistence in the same browser profile |
| GitHub and Vercel | Future collaboration and public hosting |

The MVP is planned as a browser-only application. A backend, authentication, banking integration, live currency conversion, and cloud synchronization are outside its scope.

## Folder organization

The existing `flow-budget/` repository is the project root. `public/`, `src/`, and `docs/` live directly here alongside this README and `.gitignore`.

| Path | Intended responsibility |
| --- | --- |
| `public/` | Static assets served directly |
| `src/components/layout/` | Shared shell and navigation |
| `src/components/ui/` | Reusable controls, cards, modals, and feedback states |
| `src/components/charts/` | Presentational dashboard charts |
| `src/components/forms/` | Reusable finance forms and field groups |
| `src/context/` | Shared finance state and approved actions |
| `src/hooks/` | Browser persistence synchronization |
| `src/pages/` | Dashboard, Transactions, Budgets, Goals, and Settings views |
| `src/routes/` | Planned page navigation and fallback |
| `src/lib/` | Shared money, date, validation, calculation, and storage utilities |
| `src/data/` | Agreed category constants |
| `src/styles/` | Future Tailwind entry point and shared styling |
| `src/App.jsx`, `src/main.jsx` | Future application composition and React entry point |
| `docs/` | Local architecture and responsibility documentation |

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for the complete tree, individual file purposes, and WBS mapping. Empty asset and component folders contain empty `.gitkeep` files. `.gitignore` reserves standard exclusions for dependencies, builds, local environment files, logs, and OS metadata.

## Proposed team responsibilities

The WBS **Detailed Tasks Owner** column takes precedence over broad module ownership. Assignments remain subject to team approval.

| Member | Planned responsibilities |
| --- | --- |
| Rithy | Project setup, architecture and data contracts, routing and shell, Finance Context and persistence, shared selectors, dashboard cards and recent activity, integration, release coordination, and final submission |
| Narith | Transaction CRUD, validation and filters, monthly budgets, dashboard chart components, financial calculation checks, selected routing and integration tests, and README setup documentation |
| Menghor | Wireframes, shared UI and forms, themes and responsive styling, savings goals and contributions, settings, accessibility review, screenshots, and report drafting |
| All members | Requirements review, feature verification, peer review, integration checks, and final deliverable review |

Shared Context, storage schemas, routes, and monetary calculations require coordination with affected teammates. Chart components should receive calculated inputs rather than maintain separate finance state.

## Next setup work

After approval, agree the shared data/action contracts and category list, then configure React/Vite, dependencies, scripts, the HTML entry point, Tailwind, linting, and test tooling. Node and dependency versions still need to be selected. There are no install, development, build, or test commands available yet.

The TDD plans integer minor-unit money (USD cents or whole KHR riel), local calendar dates, and a versioned `flowbudget:v1` storage snapshot. These are documentation commitments only at this stage. Future implementation must preserve the separate savings-contribution model and require confirmation for destructive resets and currency changes with existing records.

This scaffold covers only the folder-layout portion of WBS 1.2.1.2. It does not complete React/Vite setup, branch configuration, route shells, shared components, or Context work. The WBS has not been updated.

The team guide plans reviewed PRs into `develop` and release approval before promotion to `main`. This scaffolding step performs no Git operations or deployment. Actual application code and Git changes must wait for approval.

## Project references

- [Software Requirements Specification](https://docs.google.com/document/d/1_zqyIHclxDBRhXXjo3lwfPdarfxrrPljWjon4XLyqpY/edit): scope and acceptance requirements.
- [Technical Design Document](https://docs.google.com/document/d/1D7AKyv1Vnc7Vk-6_WcsIsArW1sSsRdoS97CYxMdZaLY/edit): frontend hierarchy, shared contracts, and module boundaries.
- [Work Breakdown Structure](https://docs.google.com/spreadsheets/d/1yJ1o-4ZDTQG6k2BxUvF8Jv4M8fFhYwhVnpoF5QMppt4/edit): task owners, dependencies, acceptance checks, and evidence.
- [Team Development Guide](https://docs.google.com/document/d/1N03xmlT3ymyNoWY32Dm3A3xlq28ozV-UydcLOHMjOas/edit): collaboration, ownership, review, and release rules.

The November 11, 2026 addenda clarify ownership and tracking. Pending team approvals remain pending; creating this scaffold does not approve the architecture or complete future work packages.
