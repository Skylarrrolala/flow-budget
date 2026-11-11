# FlowBudget project structure

**Status: planned frontend scaffold; application implementation has not started.**

This hierarchy follows TDD section 3 and the requested scaffold. WBS references describe future responsibilities, not completed tasks. No extra feature modules, test files, dependencies, or build configuration have been added.

## Complete hierarchy

```text
flow-budget/
├── public/
│   └── .gitkeep
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── .gitkeep
│   │   ├── ui/
│   │   │   └── .gitkeep
│   │   ├── charts/
│   │   │   └── .gitkeep
│   │   └── forms/
│   │       └── .gitkeep
│   ├── context/
│   │   └── FinanceContext.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── GoalsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── lib/
│   │   ├── money.js
│   │   ├── dates.js
│   │   ├── validation.js
│   │   ├── selectors.js
│   │   └── storage.js
│   ├── data/
│   │   └── categories.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   └── PROJECT_STRUCTURE.md
├── README.md
└── .gitignore
```

The existing `flow-budget/` repository is the application root. The tree shows its project files; existing `.git/` metadata is omitted. This README and the scaffold belong directly in this repository, with no nested project folder.

## Folder and file responsibilities

Every JavaScript/JSX file contains one brief `//` purpose comment; the stylesheet contains one `/* ... */` purpose comment. No imports, exports, JSX markup, functions, hooks, state, routes, CSS rules, or runtime behavior are present.

| Directory or file | Intended responsibility |
| --- | --- |
| `public/` | Static assets that do not need module imports; no assets are supplied yet. |
| `src/components/layout/` | Application shell, desktop/mobile navigation, and layout elements. |
| `src/components/ui/` | Buttons, inputs, cards, modals, progress indicators, and empty/error/confirmation states. |
| `src/components/charts/` | Recharts views receiving calculated data through props. |
| `src/components/forms/` | Reusable transaction, budget, goal, and contribution form elements. |
| `src/context/FinanceContext.jsx` | Finance provider and shared consumer interface for transactions, budgets, goals, contributions, and settings; actions must follow agreed contracts. |
| `src/hooks/useLocalStorage.js` | Hydration and synchronization lifecycle for browser persistence. |
| `src/pages/DashboardPage.jsx` | Current-month totals, charts, recent activity, and savings summary. |
| `src/pages/TransactionsPage.jsx` | Income/expense records, add/edit/delete interactions, filtering, and sorting. |
| `src/pages/BudgetsPage.jsx` | Category/month spending limits, spent/remaining amounts, and utilization. |
| `src/pages/GoalsPage.jsx` | Savings targets, contribution management, and completion progress. |
| `src/pages/SettingsPage.jsx` | Theme and currency preferences, JSON export, storage explanation, and confirmed reset. |
| `src/routes/AppRoutes.jsx` | Map the five page destinations and a fallback through React Router. |
| `src/lib/money.js` | Minor-unit money handling and active-currency formatting. |
| `src/lib/dates.js` | Local `YYYY-MM-DD` dates and `YYYY-MM` reporting boundaries without UTC shifts. |
| `src/lib/validation.js` | Shared finance input and stored-record validation, including positive amounts and budget uniqueness. |
| `src/lib/selectors.js` | Pure derived summaries, category/month expenses, budget comparisons, and savings progress. |
| `src/lib/storage.js` | Versioned snapshot serialization, safe browser storage access, and JSON export from current state. |
| `src/data/categories.js` | Controlled income/expense category constants, once agreed by the team. |
| `src/styles/index.css` | Future Tailwind integration, theme tokens, focus styles, and shared responsive rules. |
| `src/App.jsx` | Compose the application shell, finance provider, and routing. |
| `src/main.jsx` | Mount the application in the future HTML entry point and load global styles. |
| `docs/PROJECT_STRUCTURE.md` | Explain the scaffold, module boundaries, and planned ownership. |
| `README.md` | Introduce the project, status, stack, team responsibilities, references, and remaining setup. |
| `.gitignore` | Exclude dependencies, generated builds, local environment files, logs, and OS metadata from future tracking. |
| `.gitkeep` files | Empty markers preserving `public/` and the four component folders; they contain no comments or application data. |

Individual component filenames remain undecided. Keeping the four component directories empty avoids inventing architecture beyond the TDD.

## Planned page boundaries

These paths are documented only; none is configured or rendered.

| Planned URL | Placeholder |
| --- | --- |
| `/` | `DashboardPage.jsx` |
| `/transactions` | `TransactionsPage.jsx` |
| `/budgets` | `BudgetsPage.jsx` |
| `/goals` | `GoalsPage.jsx` |
| `/settings` | `SettingsPage.jsx` |

## WBS and ownership alignment

Assignments are proposed. The WBS Detailed Tasks Owner column overrides broad ownership; shared files require coordination before implementation.

| Area | WBS reference | Planned ownership |
| --- | --- | --- |
| Project layout and later tooling | 1.2.1; layout portion of 1.2.1.2 only here | Rithy |
| Shell and routing | 1.2.2 | Rithy; Menghor checks mobile navigation |
| Shared UI, forms, and styles | 1.2.3 | Menghor |
| Finance Context, persistence, money/date utilities, selectors, and contracts | 1.1.2, 1.2.4 | Rithy establishes shared contracts; affected teammates review changes |
| Transactions, validation use, and filtering | 1.3.1–1.3.2 | Narith |
| Monthly category budgets and calculation checks | 1.3.3 | Narith |
| Dashboard cards, activity, and integration | 1.3.4.1, 1.3.4.4–1.3.4.5 | Rithy |
| Dashboard chart components | 1.3.4.2–1.3.4.3 | Narith |
| Goals, contributions, and settings | 1.3.5–1.3.6 | Menghor |
| Integration and verification | 1.4–1.5 | Shared, following individual WBS task assignments |
| Final README and screenshots | 1.6.2.1–1.6.2.2 | Narith writes setup/architecture notes; Menghor adds screenshots/test notes; all review |

This scaffold neither completes WBS 1.2.1.2 nor implements the later work packages. It supplies no build scripts or branch configuration, and leaves WBS status/evidence unchanged.

## Boundaries for future implementation

Pages will compose reusable views and use shared Context actions and selectors. Component-local filters and form state should stay local. Presentational charts should receive derived data rather than create duplicate finance state. Validation and financial calculations belong in shared utilities.

Context will own shared finance state; the persistence hook will coordinate its lifecycle, while `lib/storage.js` will handle snapshot/storage operations. The planned storage key is `flowbudget:v1`. Validated, versioned data should survive refresh and handle malformed or unavailable storage safely.

Monetary values will use integer minor units: USD cents or whole KHR riel. Budget totals depend on expense category and selected month. Savings contributions remain separate from transaction balances. Currency changes with existing records require confirmed financial-data reset rather than automatic conversion. None of these rules is implemented here.

## Deferred setup

After approval, configure the package manifest, React/Vite dependencies, HTML entry point, Tailwind integration, lint/build scripts, and test tooling. Select supported Node/browser versions and finalize categories and shared action contracts. Add focused calculation/validation tests and fixtures when those modules are implemented; no test architecture has been invented for this scaffold.

Git workflows, branches, commits, pushes, and Vercel deployment remain deferred. No runnable application or build/test commands exist yet. See the [README project references](../README.md#project-references) for the four planning sources.
