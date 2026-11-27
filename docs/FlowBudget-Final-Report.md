# FlowBudget Final Project Report

INF 651 Frontend Development  
Fall 2026  
Rithy, Narith, and Menghor

## Project Overview

FlowBudget is a browser-based personal finance tracker built with React and Vite. It provides five routed views for an overview dashboard, transactions, monthly category budgets, savings goals, and settings. The application stores its data in the browser, so it works without a backend or user account. The implemented version supports responsive navigation, USD and KHR display rules, JSON export, demo data, and light and dark themes.

## Implementation Approach

We organized the application around small page, form, layout, and user-interface components. React Router handles navigation between the five views. A shared `FinanceProvider` owns transactions, budgets, goals, contributions, and settings. It exposes actions such as adding or updating a transaction, adding a category budget, recording a goal contribution, changing the theme, exporting data, and resetting financial records.

Financial records are saved as a versioned snapshot under `flowbudget:v1` in `localStorage`. The storage utility can also migrate the earlier separate keys used during development. All monetary values use integers: cents for USD and whole riel for KHR. This avoids floating-point errors when totals, remaining balances, and percentages are calculated.

Budget records contain a month, an expense category, and a limit. The three demo budgets are individual category allocations for Food, Transport, and Entertainment, not one overall monthly cap. Each budget card sums only expense transactions that have the same month and category. The page also combines the visible category budgets into a monthly summary. The final fix changed budget uniqueness from month-only to the combination of month and category, which allows several category budgets in one month while still blocking duplicates.

Savings goals store an amount, an optional target date, and a separate contribution history. Contributions update goal progress but do not change transaction balances. Settings controls the theme, display currency, JSON export, demo-data loading, and a confirmed factory reset. Changing currency when financial records exist requires confirmation because the app does not perform exchange-rate conversion.

## Challenges and Solutions

- **Persistence and schema changes:** We used a versioned `localStorage` snapshot with migration from the earlier keys and a safe default when stored JSON is malformed.
- **Category budget accuracy:** Budget spending filters on both `month` and `category`. Uniqueness now uses the same pair instead of rejecting every second budget in a month.
- **USD and KHR precision:** Shared money helpers parse, store, validate, and format integer minor units. Fractional KHR values are rejected.
- **Currency changes:** The settings page warns the user, offers export first, and resets financial records only after confirmation.
- **Fixed demo dates:** Demo loading shifts the newest transaction to the current date while preserving the spacing between all sample dates and aligning budgets with the current month.

## React Concepts Used

The project uses Context API to share finance data and approved update actions without passing props through every page. `useState` manages forms, filters, selected months, dialogs, notifications, and other local interface state. `useEffect` applies the selected theme, writes the current snapshot to `localStorage`, and clears timed notifications. `useCallback` keeps Context actions stable when they are passed to consumers. Derived values such as monthly totals, category spending, remaining budget, and goal progress are calculated from stored records during rendering rather than stored as duplicate state. Reusable components such as `Button`, `Card`, `Modal`, `ConfirmDialog`, `ProgressBar`, and `EmptyState` keep behavior and styling consistent across the application.

## Verification

We tested Goals and Settings on the deployed application. Goal checks covered required fields, zero amounts, duplicate names, editing, contributions, 100 percent completion, overfunding, confirmation dialogs, and refresh persistence. Settings checks covered theme persistence, selecting the current currency, canceling a currency reset, export feedback, demo-data replacement confirmation, and factory-reset confirmation. We did not execute the destructive confirmation actions during the live test.

The final local verification passed 41 automated tests. These tests cover storage migration, malformed storage recovery, goal target-date persistence, contribution behavior, theme changes, currency reset rules, KHR validation, demo-date shifting, transaction editing, and same-month category budgets. ESLint and the Vite production build also completed successfully. A browser check confirmed that Food, Transport, Entertainment, and a newly added Housing budget each used only their matching category expenses and remained available after refresh.

## Project Links

- GitHub repository: https://github.com/Skylarrrolala/flow-budget
- Live application: https://flow-budget-navy.vercel.app
