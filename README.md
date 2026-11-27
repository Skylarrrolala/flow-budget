# FlowBudget

**Personal Finance Tracker — INF 651 Frontend Development Final Project, Fall 2026**

FlowBudget is a personal finance tracker for students and young professionals, with a responsive dashboard, income and expense records, monthly category budgets, savings goals, and application settings.

**Live demo:** [flow-budget-navy.vercel.app](https://flow-budget-navy.vercel.app)

## Implemented Features

- **Transaction Management** — Add, edit, and delete income/expense transactions with validation
- **Filtering & Sorting** — Filter transactions by type or category, sort by date or amount
- **Monthly Category Budgets** — Set one limit per expense category and month, then compare that category's actual spending with its allocation
- **Dashboard** — Expense breakdown pie chart, income vs expenses bar chart, and summary totals
- **Navigation** — Client-side routing between Dashboard, Transactions, Budgets, Savings Goals, and Settings pages
- **Data Persistence** — All data saved to localStorage (survives page refresh)
- **Multi-Currency** — Supports USD (cents) and KHR (whole riel) using integer minor units

## Technology

| Technology | Use |
| --- | --- |
| React 19.3.1 and JavaScript | Single-page application and interface behavior |
| Vite 8.3.8 | Local development and production builds |
| React Router DOM | Navigation across pages |
| Recharts | Dashboard charts derived from finance data |
| Tailwind CSS | Utility-first styling and dark mode |
| Context API, useState, useEffect | Shared finance data, local form state, and synchronization |
| Browser localStorage | Data persistence in the same browser profile |
| GitHub | Collaboration and version control |

The application is browser-only. A backend, authentication, banking integration, live currency conversion, and cloud synchronization are outside its scope.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Skylarrrolala/flow-budget.git
   cd flow-budget
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Checks

```bash
npm run lint
npm test
npm run build
```

Tests include money/date utilities, KHR amount validation, edit switching, and currency-reset confirmation and persistence. Changing currency with existing transactions, budgets, or goals requires confirmation and resets all financial records, including contributions. Export data first to keep a copy. The theme and unrelated browser data are preserved (WBS 1.3.6.2).

## Folder Organization

| Path | Responsibility |
| --- | --- |
| `public/` | Static assets served directly |
| `src/components/layout/` | Navigation bar and page layout |
| `src/components/ui/` | Reusable controls (transaction filters, progress bars, cards, buttons) |
| `src/components/charts/` | Presentational dashboard charts |
| `src/components/forms/` | Transaction and budget forms |
| `src/context/` | Shared finance state and approved actions |
| `src/hooks/` | Browser persistence synchronization |
| `src/pages/` | Dashboard, Transactions, Budgets, Goals, Settings, and Not Found views |
| `src/routes/` | React Router page navigation |
| `src/lib/` | Shared money, date, validation, and storage utilities |
| `src/data/` | Category constants |
| `src/styles/` | Shared styling |
| `src/App.jsx`, `src/main.jsx` | Application composition and React entry point |
| `docs/` | Local architecture and responsibility documentation |

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for the complete tree, individual file purposes, and WBS mapping.

## Data Design

### Transactions
Stored in localStorage as an array of objects:
```json
{
  "id": "uuid",
  "type": "income | expense",
  "amountMinor": 1250,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-11-25"
}
```
Amounts are stored as integer minor units (cents for USD, whole riel for KHR) to avoid floating-point rounding errors.

### Budgets
```json
{
  "id": "uuid",
  "category": "Food",
  "month": "2026-11",
  "category": "Food",
  "limitMinor": 100000
}
```
Each budget targets a single expense category. Progress bars indicate spending status: green (under 80%), yellow (80–100%), and red (over budget).

Budget uniqueness is based on the combination of `month` and `category`. Spending for a budget is the sum of expense transactions with the same month and category; expenses in other categories are not included.

## Team Responsibilities

The WBS **Detailed Tasks Owner** column takes precedence over broad module ownership.

| Member | Responsibilities |
| --- | --- |
| Rithy | Project setup, architecture and data contracts, routing and shell, Finance Context and persistence, shared selectors, dashboard cards and recent activity, integration, release coordination, and final submission |
| Narith | Transaction CRUD, validation and filters, monthly budgets, dashboard chart components, financial calculation checks, selected routing and integration tests, and README setup documentation |
| Menghor | Wireframes, shared UI and forms, themes and responsive styling, savings goals and contributions, settings, accessibility review, screenshots, and report drafting |
| All members | Requirements review, feature verification, peer review, integration checks, and final deliverable review |

Shared Context, storage schemas, routes, and monetary calculations require coordination with affected teammates. Chart components receive calculated inputs rather than maintaining separate finance state.

## Project References

- [Software Requirements Specification](https://docs.google.com/document/d/1_zqyIHclxDBRhXXjo3lwfPdarfxrrPljWjon4XLyqpY/edit)
- [Technical Design Document](https://docs.google.com/document/d/1D7AKyv1Vnc7Vk-6_WcsIsArW1sSsRdoS97CYxMdZaLY/edit)
- [Work Breakdown Structure](https://docs.google.com/spreadsheets/d/1yJ1o-4ZDTQG6k2BxUvF8Jv4M8fFhYwhVnpoF5QMppt4/edit)
- [Team Development Guide](https://docs.google.com/document/d/1N03xmlT3ymyNoWY32Dm3A3xlq28ozV-UydcLOHMjOas/edit)

## License

This project was created for academic purposes as part of INF 651 at AUPP.