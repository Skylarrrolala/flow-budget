# FlowBudget — Validation and Business Rules (TDD Addendum, Revision 1.2)

| | |
| --- | --- |
| **Status** | Finalized for implementation. Team approval pending; see [README](README.md#status-and-evidence). |
| **Extends** | TDD v1.0 §5 "Money and calculation rules", §7 "Interaction and UX contracts"; TDD Rev 1.1 verification examples |
| **WBS** | 1.1.2.2 (money/date/category rules), 1.2.4.3, 1.3.x calculations, 1.4.2, 1.5.3.3 |
| **Implemented in** | `src/lib/money.js`, `src/lib/dates.js`, `src/lib/validation.js`, `src/lib/selectors.js`, `src/lib/storage.js` |
| **Contracts** | [data-contracts.md](data-contracts.md) |

Every rule has an ID (`BR-…`) that tests, PRs and WBS evidence can cite. Error messages are referenced by code and listed in §10. All rules are deterministic: the same inputs and the same local "today" always give the same result.

## 1. Conventions

- **"Today"** means the local calendar date from `todayLocal()` at the moment of validation, meaning form submit, not page load (BR-DATE-06).
- **Write rules** apply when a user creates or edits a record. **Stored-record rules** apply when a snapshot is loaded (BR-STO-04). Stored-record rules are the write rules minus "date ≤ today" and goal-name uniqueness.
- Validation runs in two places with the **same functions**: in the form on submit, to show inline errors, and inside the Context action as a backstop. Forms do not re-implement rules (DEC-27).
- Inline errors appear after the first submit attempt, then update as the user edits that field. The first invalid field receives focus.

## 2. Money

| ID | Rule |
| --- | --- |
| BR-MONEY-01 | Stored amounts (`amountMinor`, `limitMinor`, `targetAmountMinor`) are integers with `Number.isSafeInteger(n)` and `1 ≤ n ≤ 99,999,999,999` (`MAX_AMOUNT_MINOR`). USD minor unit = 1 cent. KHR minor unit = 1 riel. |
| BR-MONEY-02 | Amount fields are `<input type="text" inputmode="decimal">` with the currency symbol shown next to the field. `parseAmountInput(text, currency)` applies these steps in order and stops at the first failure: **1.** trim; empty → `AMOUNT_REQUIRED`. **2.** Starts with `-` → `AMOUNT_NOT_POSITIVE`. **3. USD:** must match `^\d+(\.\d+)?$`, else `AMOUNT_INVALID_USD`; more than 2 fraction digits → `AMOUNT_TOO_MANY_DECIMALS`. **3. KHR:** must match `^\d+$`, else `AMOUNT_INVALID_KHR`. **4.** Remove leading zeros from the integer part (keep at least one digit); more than 9 digits (USD) or 11 digits (KHR) → `AMOUNT_TOO_LARGE`. **5.** USD: `Number(int) * 100 + Number(fraction.padEnd(2, "0"))`; KHR: `Number(int)`. **6.** Result `0` → `AMOUNT_NOT_POSITIVE`. Step 4 guarantees the result is ≤ `MAX_AMOUNT_MINOR`. |
| BR-MONEY-03 | No floating-point arithmetic on money. Never use `parseFloat`, `Number("12.5") * 100` or `toFixed` for amounts. Sums, differences and comparisons use integer minor units. Converting to major units (`/ 100`) is allowed only inside display formatters. |
| BR-MONEY-04 | Commas, currency symbols, spaces inside the number, exponents (`1e3`) and a leading or trailing dot (`.5`, `12.`) are rejected rather than guessed. This avoids `1,5` being read as 15 or as 1.5. |
| BR-MONEY-05 | **Integer safety.** A single amount is at most 99,999,999,999, so sums stay exact (≤ `Number.MAX_SAFE_INTEGER`) for up to 90,000 maximum-size records. Percentages use `Math.floor((a * 100) / b)`, which is exact while `a ≤ 90,071,992,547,409`. Both bounds are far beyond MVP data. |
| BR-MONEY-06 | `formatMoney(minor, currency)` is deterministic and does not depend on the browser locale. **USD:** `[-]$` + integer part grouped with commas + `.` + 2-digit cents → `$1,234.56`, `-$12.50`, `$0.05`. **KHR:** `[-]` + riel grouped with commas + `៛` (no space) → `1,234,500៛`, `-4,000៛`. Zero → `$0.00` / `0៛`. Grouping uses `Intl.NumberFormat('en-US')` or the equivalent regex. |
| BR-MONEY-07 | Chart axes use `formatMoneyCompact`: `Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })` applied to major units, with `$` prefixed for USD or `៛` appended for KHR. For example `123456` cents → `$1.2K`, `1500000` riel → `1.5M៛`. Tooltips and every non-axis number use full `formatMoney`. |
| BR-MONEY-08 | Edit forms pre-fill amounts with `minorToInputString`: USD `1250` → `"12.50"`, `5` → `"0.05"`; KHR `25000` → `"25000"`. Saving an unchanged pre-filled value gives back the identical integer. |
| BR-MONEY-09 | Sign display: transaction rows show `+` before income and `-` before expense amounts, with the type also written as text (not color only). KPI cards show income and expenses unsigned. Net balance is signed only when negative (BR-CALC-02). Semantic colors always come with a text label. |

### 2.1 Boundary cases — USD

| Input | Result | Code / value |
| --- | --- | --- |
| `12.50` | valid | `1250` |
| `12.5` | valid | `1250` |
| ` 7 ` | valid (trimmed) | `700` |
| `007.10` | valid | `710` |
| `0.01` | valid (minimum) | `1` |
| `999999999.99` | valid (maximum) | `99999999999` |
| `""` | invalid | `AMOUNT_REQUIRED` |
| `0`, `0.00` | invalid | `AMOUNT_NOT_POSITIVE` |
| `-5` | invalid | `AMOUNT_NOT_POSITIVE` |
| `12.345` | invalid | `AMOUNT_TOO_MANY_DECIMALS` |
| `1,000`, `$12`, `.5`, `12.`, `1e3`, `12.50.1` | invalid | `AMOUNT_INVALID_USD` |
| `1000000000` | invalid | `AMOUNT_TOO_LARGE` |

### 2.2 Boundary cases — KHR

| Input | Result | Code / value |
| --- | --- | --- |
| `25000` | valid | `25000` |
| `000123` | valid | `123` |
| `99999999999` | valid (maximum) | `99999999999` |
| `0` | invalid | `AMOUNT_NOT_POSITIVE` |
| `-100` | invalid | `AMOUNT_NOT_POSITIVE` |
| `25000.5`, `4,000` | invalid | `AMOUNT_INVALID_KHR` |
| `100000000000` | invalid | `AMOUNT_TOO_LARGE` |

### 2.3 Formatting examples

| Minor units | USD | KHR |
| --- | --- | --- |
| `0` | `$0.00` | `0៛` |
| `5` | `$0.05` | `5៛` |
| `4000` | `$40.00` | `4,000៛` |
| `123456` | `$1,234.56` | `123,456៛` |
| `-1250` | `-$12.50` | `-1,250៛` |
| `99999999999` | `$999,999,999.99` | `99,999,999,999៛` |

## 3. Dates

| ID | Rule |
| --- | --- |
| BR-DATE-01 | Build local dates from `getFullYear()`, `getMonth() + 1` and `getDate()`, each zero-padded. **Never** use `toISOString().slice(0, 10)`: at 03:00 on 18 Nov 2026 in Phnom Penh (UTC+7) it returns `2026-11-17`. **Never** parse `YYYY-MM-DD` with `new Date(string)`, which treats it as UTC midnight. Compare dates as strings: `YYYY-MM-DD` sorts lexicographically. |
| BR-DATE-02 | Write rule for `Transaction.date` and `SavingsContribution.date`: required (`DATE_REQUIRED`); a real calendar date (`DATE_INVALID`); `≥ 2000-01-01` (`DATE_TOO_EARLY`); `≤ today` (`DATE_IN_FUTURE`). Forms set the date input's `min="2000-01-01"` and `max={today}` and still validate on submit. |
| BR-DATE-03 | A real calendar date matches `^\d{4}-\d{2}-\d{2}$`, has month 01–12, and has a day no larger than that month's length. Leap years: divisible by 4, except centuries not divisible by 400. |
| BR-DATE-04 | Months match `^\d{4}-(0[1-9]|1[0-2])$` and lie in `2000-01`…`2099-12` (`MONTH_REQUIRED`, `MONTH_INVALID`, `MONTH_OUT_OF_RANGE`). The Dashboard month selector covers `2000-01` up to the **current month** (transactions cannot be in the future). The Budgets month selector covers `2000-01`…`2099-12`, so future months can be planned. Both start on the current month. |
| BR-DATE-05 | Display: `formatDate("2026-11-18")` → `Nov 18, 2026`; `formatMonth("2026-11")` → `November 2026`; `formatMonthShort("2026-11")` → `Nov 2026`. Month names come from a fixed English array, not from the browser locale. |
| BR-DATE-06 | "Today" is evaluated at submit. A tab left open past midnight therefore accepts the new day without a reload. Defaults shown in forms (date = today, month = current) are computed when the form opens. |
| BR-DATE-07 | `Goal.targetDate`, when set, follows BR-DATE-03 with range `2000-01-01`…`2099-12-31` (`TARGET_DATE_INVALID`, `TARGET_DATE_OUT_OF_RANGE`). Past dates are allowed (BR-GOAL-02). An empty field saves as `null`. |

### 3.1 Date boundary cases (today = `2026-11-18`)

| Input | Result |
| --- | --- |
| `2026-11-18` | valid (today is allowed) |
| `2026-11-19` | `DATE_IN_FUTURE` |
| `2000-01-01` | valid (minimum) |
| `1999-12-31` | `DATE_TOO_EARLY` |
| `2000-02-29` | valid (leap year) |
| `2026-02-29`, `1900-02-29`, `2026-04-31`, `2026-13-01` | `DATE_INVALID` |
| `2026-1-5` | `DATE_INVALID` (needs zero padding) |
| `""` | `DATE_REQUIRED` |

Month arithmetic: `addMonths("2026-11", -5)` → `2026-06`; `addMonths("2026-01", -1)` → `2025-12`; `addMonths("2026-12", 1)` → `2027-01`.

## 4. Categories, transactions, filtering and sorting

| ID | Rule |
| --- | --- |
| BR-CAT-01 | `category` must be an ID from the controlled list ([data-contracts.md §3](data-contracts.md#3-category-list-controlled)). Empty → `CATEGORY_REQUIRED`. Unknown ID, or an ID of the other type → `CATEGORY_TYPE_MISMATCH`. |
| BR-CAT-02 | Changing **Type** in the transaction form clears **Category**, so an income category can never be saved on an expense. |
| BR-CAT-03 | Category selects list only the categories of the selected type, in list order. When the Transactions filter type is "All", the category filter shows both groups (`Income`, `Expense`) as `<optgroup>`s. |
| BR-TXN-01 | `type` must be `income` or `expense` (`TYPE_REQUIRED`). The form preselects `expense`. |
| BR-TXN-02 | `description` is trimmed. Empty is allowed and stored as `""`. More than 120 characters → `DESCRIPTION_TOO_LONG`. Lists show the description, or the category label when the description is empty. Long text is truncated visually with an ellipsis and shown in full in the edit form. |
| BR-TXN-03 | Edit replaces type, amount, category, description and date in place; `id` and array position stay the same. Every derived value (dashboard, charts, budgets) recalculates from the new values, including budgets in the **old and new** month when the date moves across months. |
| BR-TXN-04 | Delete removes the record after confirmation. Derived values recalculate. Nothing else is deleted. |
| BR-SORT-01 | Chronological order: sort by `date` ascending, breaking ties by array index ascending (stable sort), which gives **oldest first**. **Newest first** is exactly the reverse of that list, so among records with the same date, the one added later appears first. The Transactions list defaults to newest first, and a "Sort: Newest first / Oldest first" toggle switches between them. Date is the only sort key in the MVP (DEC-13). |
| BR-FLT-01 | Filters combine with AND: `type` (`all`/`income`/`expense`), `category` (`all` or one ID), `from` and `to` (inclusive `YYYY-MM-DD`; empty means no bound). Comparison is a string comparison on `date`. |
| BR-FLT-02 | When the type filter changes and the selected category belongs to the other type, the category filter resets to `all`. |
| BR-FLT-03 | If both `from` and `to` are set and `from > to`, show `FILTER_RANGE_INVALID` under the date fields and **do not apply the date range**. Type and category filters still apply. A date field holding an incomplete or invalid value counts as empty. |
| BR-FLT-04 | Filter and sort state is local `useState` on the Transactions page. It is not persisted and resets when the user leaves the page. "Clear filters" restores type `all`, category `all`, empty dates and newest first. The page shows "Showing *n* of *N* transactions" whenever a filter is active. |

## 5. Budgets

| ID | Rule |
| --- | --- |
| BR-BUD-01 | `category` must be an **expense** category: empty → `BUDGET_CATEGORY_REQUIRED`; income or unknown → `BUDGET_CATEGORY_INVALID`. The budget form lists only expense categories. |
| BR-BUD-02 | **One budget per category per month.** On create, reject if any budget has the same `category` and `month`. On edit, the same check excludes the budget's own `id`. Error `BUDGET_DUPLICATE` (on the category field), for example *"A Food & dining budget already exists for November 2026. Edit that budget instead."* |
| BR-BUD-03 | `month` follows BR-DATE-04. The budget form has **no month input**: it uses the month selected on /budgets and shows it read-only ("New budget · November 2026"). `<input type="month">` is not supported in desktop Firefox and Safari (NFR-08). Edit can change category and limit; the month stays fixed, and BR-BUD-02 is re-checked. To move a budget to another month, delete it and create it there. The `MONTH_*` codes therefore come up only in programmatic and stored-record validation. |
| BR-BUD-04 | `limitMinor` follows BR-MONEY-01/02, using the "limit" wording in §10. |
| BR-BUD-05 | /budgets lists the budgets whose `month` equals the selected month, ordered by the category list order. Each card shows: category label, limit, spent, `percentUsed%`, a progress bar at `barPercent`, and a status line. **Within:** `"{remaining} left"` with the text "On track". **Over:** `"Over by {overBy}"` with the text "Over budget" and the warning color. Status is always written in text (UI/UX §8). |
| BR-BUD-06 | Budgets for future months are allowed and show spent `0`. A budget's spent amount counts **only expense transactions** in its category and month. Income never counts. |
| BR-BUD-07 | Deleting a budget never changes transactions. Adding, editing or deleting transactions never changes stored budgets, only their derived usage. |

## 6. Savings goals and contributions

| ID | Rule |
| --- | --- |
| BR-GOAL-01 | `name` is trimmed: empty → `GOAL_NAME_REQUIRED`; more than 60 characters → `GOAL_NAME_TOO_LONG`. Must not equal another goal's name after `trim().toLowerCase()` (on edit, the goal itself is excluded) → `GOAL_NAME_DUPLICATE`. |
| BR-GOAL-02 | `targetDate` is optional (BR-DATE-07). If the goal is **not** complete and `targetDate < today`, the card shows the text label "Past target date". No other behavior depends on `targetDate`. |
| BR-GOAL-03 | `targetAmountMinor` follows BR-MONEY-01/02, using the "target amount" wording. |
| BR-GOAL-04 | Contributions: amount follows BR-MONEY-01/02; date follows BR-DATE-02. **Overfunding is allowed**: a contribution may push the saved amount past the target, and there is no "remaining" cap. Completed goals still accept contributions. |
| BR-GOAL-05 | Display: `percent%` is shown uncapped (for example `110%`); the bar uses `barPercent` (≤ 100). **Incomplete:** `"{remaining} to go"`. **Complete:** the text "Goal reached", plus `"{overBy} over target"` when `overBy > 0`. When an `addContribution` takes a goal from incomplete to complete, the success toast reads "Contribution added. You reached “{name}”!" instead of the normal toast. This is the goal-completion message from UI/UX §7. |
| BR-GOAL-06 | Editing a goal changes only name, target and target date; contributions are kept. Lowering the target to or below the saved amount makes the goal complete; raising it above makes it incomplete again. No contribution is changed. |
| BR-GOAL-07 | Contributions can be added and removed (with confirmation) but **not edited** in the MVP (DEC-16). Removing one can turn a complete goal back into an incomplete one. Each goal's history is ordered newest first using BR-SORT-01. |
| BR-GOAL-08 | Deleting a goal deletes its embedded contributions. No transaction changes. |
| BR-GOAL-09 | /goals lists goals in array (creation) order. |

## 7. Financial calculations and cross-page consistency

All derived numbers come from the selectors in [data-contracts.md §12](data-contracts.md#12-selector-contract-srclibselectorsjs).

| ID | Calculation |
| --- | --- |
| BR-CALC-01 | **Month membership:** a transaction belongs to month `m` if and only if `date.slice(0, 7) === m`. A transaction on `2026-10-31` is in October only; one on `2026-11-01` is in November only. |
| BR-CALC-02 | **Monthly summary** for month `m`: `incomeMinor` = Σ income amounts in `m`; `expenseMinor` = Σ expense amounts in `m`; `netMinor = incomeMinor − expenseMinor` (can be negative). Net display: positive gets the positive color, negative gets a leading `-` and the negative color, zero is neutral. |
| BR-CALC-03 | **Expense by category** for `m`: one row per expense category with a total > 0 in `m`, sorted by amount descending, ties broken by category list order. `sharePercent = Math.round(amount * 100 / expenseMinor)`. Shares may not sum to exactly 100 because of rounding. Categories with zero spend are omitted. |
| BR-CALC-04 | **Budget usage** for budget `b`: `spent` = Σ expense amounts with `category === b.category` and month `b.month`; `remaining = max(0, limit − spent)`; `overBy = max(0, spent − limit)`; `percentUsed = Math.floor(spent * 100 / limit)`; `barPercent = min(100, percentUsed)`; `status = spent > limit ? 'over' : 'within'`. **Exactly at the limit is "within"** (100%, `$0.00 left`). |
| BR-CALC-05 | **Goal progress:** `saved` = Σ contribution amounts; `remaining = max(0, target − saved)`; `overBy = max(0, saved − target)`; `percent = Math.floor(saved * 100 / target)`; `barPercent = min(100, percent)`; `isComplete = saved ≥ target`. Flooring means `100%` appears only once a goal is actually complete. |
| BR-CALC-06 | **Savings totals:** `savedMinor` = Σ saved over all goals; `targetMinor` = Σ targets over all goals. The Dashboard shows "Saved {saved} of {target} across {n} goals". |
| BR-CALC-07 | **Separation:** savings contributions never affect income, expenses, net balance, category breakdown or budget spent. (TDD v1.0 §5; SRS FR-04 note.) |
| BR-CALC-08 | **Income vs expenses series:** the 6 calendar months ending at the selected Dashboard month (inclusive), oldest first. Every month is present, with zeros when there is no data. Each point is `{ month, label: formatMonthShort(month), incomeMinor, expenseMinor }` from BR-CALC-02. |
| BR-CALC-09 | **Single source of truth:** pages and charts must not sum, filter or round amounts themselves. They call selectors and format the result at render time. Charts receive selector output through props and keep no finance state of their own (TDD Rev 1.1). |
| BR-CALC-10 | **Recent transactions:** the first 5 items of `sortTransactions(all, 'desc')` across **all** months (not only the selected month). |
| BR-CALC-11 | **Goals preview:** up to 3 goals: incomplete goals first, then complete goals, each group in array order. |

### 7.1 Invariants (WBS 1.4.2 must check all of them)

| ID | Invariant |
| --- | --- |
| INV-1 | For any month, Dashboard expenses = Σ of the category breakdown rows for that month. |
| INV-2 | For any budget `(c, m)`, budget spent = the category-breakdown amount for `c` in month `m` (0 if absent) = Σ of the Transactions list filtered to type `expense`, category `c`, from = first day of `m`, to = last day of `m`. |
| INV-3 | Net = income − expenses on the KPI cards for every month. |
| INV-4 | The income-vs-expenses chart point for month `m` equals the Dashboard KPI income and expenses for `m`. |
| INV-5 | A goal's saved amount is identical on /goals and in the Dashboard preview, and Σ goals saved equals the Dashboard savings total. |
| INV-6 | Adding, editing or removing a contribution leaves every value in INV-1…INV-4 unchanged. |
| INV-7 | Adding an expense of amount `a` in month `m` and category `c` increases Dashboard expenses (if `m` is the selected month), the `c` breakdown row and any `(c, m)` budget's spent by exactly `a`. Deleting it decreases each by exactly `a`, back to the original values (TDD Rev 1.1 verification example). |

## 8. Currency switching and data reset

| ID | Rule |
| --- | --- |
| BR-CUR-01 | `settings.currency` changes only through `switchCurrency`. FlowBudget **never converts** amounts and never reinterprets stored numbers in another currency. |
| BR-CUR-02 | `switchCurrency(next)`: if `next === current` → no-op success. If `hasFinancialRecords` is false (no transactions, budgets or goals) → set the currency immediately. Otherwise → set `transactions = []`, `budgets = []`, `goals = []` and `currency = next` in one state update, keeping `theme`. The UI calls the clearing path only after the confirmation in BR-CUR-03. |
| BR-CUR-03 | The switch confirmation (copy in [user-journeys.md §9.3](user-journeys.md#93-confirmation-dialogs)) must: name the new currency; state the counts of transactions, budgets and goals that will be **permanently deleted**; state that amounts are **not converted**; offer **Export data** before confirming; use a destructive button labelled "Delete records and switch"; give **Cancel** initial focus; and on Cancel or Escape, put the currency control back to the current value with no state change. |
| BR-CUR-04 | `resetData()` is a factory reset: state becomes `createDefaultSnapshot()` (USD, dark theme, empty collections). `flowbudget:v1` is overwritten with that snapshot and `flowbudget:v1:backup` is removed. Other sites' and apps' `localStorage` keys are never touched (WBS 1.3.6.3). Confirmation copy is in user-journeys.md §9.3. |

## 9. Storage, recovery and export

| ID | Rule |
| --- | --- |
| BR-STO-01 | **Hydrate then sync.** The provider's `useState` lazy initializer calls `loadSnapshot()` synchronously, so there is no loading state and no empty first render that could overwrite data. A `useEffect` keyed on the snapshot calls `saveSnapshot()` after every change, and on the first run it writes the hydrated (possibly repaired) snapshot. When `storageStatus.persistent` is false, writes are skipped. |
| BR-STO-02 | **Load algorithm:** 1. `localStorage.getItem(STORAGE_KEY)` inside `try`; if it throws → `unavailable` (defaults in memory). 2. `null` → `new`. 3. `JSON.parse` throws → **unreadable**. 4. `validateSnapshot` top-level check fails (BR-STO-03) → **unreadable**. 5. Otherwise apply record-level rules (BR-STO-04): if `droppedCount > 0` → `repaired`, else `ok`. **Unreadable** → back up the raw string (BR-STO-05), use defaults, result `reset`. |
| BR-STO-03 | **Unreadable** if any of these hold: the parsed value is not a plain object; `schemaVersion !== 1`; `transactions`, `budgets` or `goals` is not an array; `settings` is not an object; `settings.currency` is not `USD`/`KHR` (amounts are meaningless without it). An invalid `settings.theme` alone is **not** unreadable: it becomes `"dark"` silently and does not count as dropped. |
| BR-STO-04 | **Record-level salvage** (in this order): each transaction, budget, goal and contribution is checked against its stored-record rules ([data-contracts.md §9](data-contracts.md#9-localstorage-snapshot)), and invalid ones are dropped. Repeated IDs within a collection keep the first occurrence; contribution IDs must be unique across the snapshot. Budgets repeating an earlier `(category, month)` are dropped. A goal that fails its own fields is dropped together with its contributions and counts as **1**. Invalid contributions inside a valid goal are dropped one by one, and each counts as 1. Unknown keys are ignored. |
| BR-STO-05 | **Backup:** when the result is `reset` or `repaired`, write the raw string to `flowbudget:v1:backup` (overwriting any earlier backup) before the first sync overwrites `flowbudget:v1`. If the backup write fails, continue anyway. |
| BR-STO-06 | **Notices:** `reset` → load error banner (dismissible); `repaired` → repaired banner with the count (dismissible); `unavailable` → persistent storage-unavailable banner (not dismissible); `new`/`ok` → nothing. Copy is in user-journeys.md §9.4. Dismissal lasts until the next page load. |
| BR-STO-07 | **Save failure:** `setItem` throws `QuotaExceededError` (or any error) → keep the in-memory state, set `lastSaveError` (`quota` or `unavailable`) and show the save-failed banner. The next successful save clears it automatically. The app never crashes or rolls back the user's change because of a save failure. |
| BR-STO-08 | **Multiple tabs** are not synchronized in the MVP: whichever tab saved last wins. There is no `storage` event listener (DEC-31). |
| BR-EXP-01 | **Export** downloads `flowbudget-export-YYYY-MM-DD.json` (local date) containing `JSON.stringify(snapshot, null, 2)`, where `snapshot` is exactly the persisted shape (`schemaVersion`, `transactions`, `budgets`, `goals`, `settings`). There are no extra fields and no conversion (DEC-22). Export works with empty data and when storage is unavailable, because it reads in-memory state. |
| BR-EXP-02 | **Integrity self-check:** before triggering the download, `validateSnapshot(JSON.parse(text))` must return `ok: true` with `droppedCount === 0`. Otherwise show the export-failed toast and download nothing. If Blob or object-URL creation throws, show the same toast. Success toast: "Data exported." |
| BR-EXP-03 | **No import.** The MVP has no JSON import or transaction import (SRS §1.4). The export is a backup for the user only. |

## 10. Validation message catalog

Messages are short, say what to do, and never blame the user (UI/UX §3.3, NFR-01). `{…}` parts are filled at render time.

| Code | Field(s) | Message |
| --- | --- | --- |
| `AMOUNT_REQUIRED` | amount / limit / target | Transaction or contribution: "Enter an amount." · Budget: "Enter a limit." · Goal: "Enter a target amount." |
| `AMOUNT_NOT_POSITIVE` | same | "Amount must be greater than 0." · "Limit must be greater than 0." · "Target amount must be greater than 0." |
| `AMOUNT_INVALID_USD` | same | "Enter a number like 12.50 (no commas or symbols)." |
| `AMOUNT_INVALID_KHR` | same | "Enter whole riel like 25000 (no commas, symbols, or decimals)." |
| `AMOUNT_TOO_MANY_DECIMALS` | same | "Use at most 2 decimal places." |
| `AMOUNT_TOO_LARGE` | same | USD: "Enter $999,999,999.99 or less." · KHR: "Enter 99,999,999,999៛ or less." |
| `TYPE_REQUIRED` | type | "Choose income or expense." |
| `CATEGORY_REQUIRED` | category | "Choose a category." |
| `CATEGORY_TYPE_MISMATCH` | category | "Choose a category that matches the transaction type." |
| `DESCRIPTION_TOO_LONG` | description | "Keep the description to 120 characters or fewer." |
| `DATE_REQUIRED` | date | "Enter a date." |
| `DATE_INVALID` | date | "Enter a real date." |
| `DATE_TOO_EARLY` | date | "Date must be on or after Jan 1, 2000." |
| `DATE_IN_FUTURE` | date | "Date can't be in the future." |
| `FILTER_RANGE_INVALID` | from/to filter | "Start date must be on or before end date." |
| `BUDGET_CATEGORY_REQUIRED` | budget category | "Choose an expense category." |
| `BUDGET_CATEGORY_INVALID` | budget category | "Budgets can only use expense categories." |
| `MONTH_REQUIRED` | month | "Choose a month." |
| `MONTH_INVALID` | month | "Enter a real month." |
| `MONTH_OUT_OF_RANGE` | month | "Choose a month between January 2000 and December 2099." |
| `BUDGET_DUPLICATE` | budget category | "A {Category} budget already exists for {Month YYYY}. Edit that budget instead." |
| `GOAL_NAME_REQUIRED` | name | "Enter a goal name." |
| `GOAL_NAME_TOO_LONG` | name | "Keep the goal name to 60 characters or fewer." |
| `GOAL_NAME_DUPLICATE` | name | "You already have a goal with this name." |
| `TARGET_DATE_INVALID` | targetDate | "Enter a real date, or leave it empty." |
| `TARGET_DATE_OUT_OF_RANGE` | targetDate | "Choose a date between Jan 1, 2000 and Dec 31, 2099." |
| `NOT_FOUND` | `_form` | "This item no longer exists. It may have been deleted." |
| `THEME_INVALID`, `CURRENCY_INVALID` | settings | Programmer errors (the UI only offers valid values). Log to the console; no user message. |

## 11. Shared fixture and expected results

Fixture: [fixtures/sample-snapshot.json](fixtures/sample-snapshot.json) (USD). **Assume today = `2026-11-18`.** Every value below was computed with a reference implementation of the rules above, and invariants INV-1 and INV-2 were checked for every month and budget in the fixture.

### 11.1 Monthly summaries (BR-CALC-02)

| Month | Income | Expenses | Net |
| --- | --- | --- | --- |
| 2026-09 | `50000` → $500.00 | `4500` → $45.00 | `45500` → $455.00 |
| 2026-10 | `80000` → $800.00 | `5699` → $56.99 | `74301` → $743.01 |
| 2026-11 | `51000` → $510.00 | `27751` → $277.51 | `23249` → $232.49 |

`t-04` and `t-05` (`2026-10-31`) count in October, and `t-06` and `t-07` (`2026-11-01`) count in November (BR-CALC-01).

### 11.2 Expense by category (BR-CALC-03)

| Month | Rows (amount · share) |
| --- | --- |
| 2026-11 | Housing & rent `20000` · 72% → Food & dining `3751` · 14% → Education `2500` · 9% → Entertainment `1500` · 5% (sum `27751` = INV-1 ✔) |
| 2026-10 | Food & dining `5249` · 92% → Transport `450` · 8% (sum `5699` ✔) |

### 11.3 Income vs expenses series, selected month 2026-11 (BR-CALC-08)

| Jun 2026 | Jul 2026 | Aug 2026 | Sep 2026 | Oct 2026 | Nov 2026 |
| --- | --- | --- | --- | --- | --- |
| 0 / 0 | 0 / 0 | 0 / 0 | 50000 / 4500 | 80000 / 5699 | 51000 / 27751 |

### 11.4 Ordering and filtering

| Check | Expected |
| --- | --- |
| Recent 5 (BR-CALC-10) | `t-11`, `t-10`, `t-09`, `t-12`, `t-08` (`t-11` is before `t-10`: same date, added later) |
| Oldest first (BR-SORT-01) | `t-14`, `t-13`, `t-01`, `t-02`, `t-03`, `t-04`, `t-05`, `t-06`, `t-07`, `t-08`, `t-12`, `t-09`, `t-10`, `t-11` |
| Filter expense + food + 2026-10-01…2026-10-31 | `t-02`, `t-04`, total `5249` (= budget `b-04` spent, INV-2 ✔) |
| Filter from = 2026-11-12 only | `t-09`, `t-10`, `t-11` |
| Filter from 2026-11-30 to 2026-11-01 | `FILTER_RANGE_INVALID` shown; date range ignored; all 14 shown (with type/category = All) |

### 11.5 Budgets (BR-CALC-04)

| Budget | Category · Month | Limit | Spent | Remaining | Over by | % used | Bar | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| b-01 | food · 2026-11 | 5000 | 3751 | 1249 | 0 | 75 | 75 | within |
| b-02 | entertainment · 2026-11 | 1000 | 1500 | 0 | 500 | 150 | 100 | **over** |
| b-03 | housing · 2026-11 | 20000 | 20000 | 0 | 0 | 100 | 100 | within (exactly at limit) |
| b-04 | food · 2026-10 | 5000 | 5249 | 0 | 249 | 104 | 100 | **over** (104.98 floors to 104) |
| b-05 | transport · 2026-12 | 3000 | 0 | 3000 | 0 | 0 | 0 | within (future month) |
| b-06 | shopping · 2026-11 | 3000 | 0 | 3000 | 0 | 0 | 0 | within (shopping spend was in Sep) |

Creating another `food` budget for `2026-11` → `BUDGET_DUPLICATE`. Creating `food` for `2026-12` → valid. Creating `salary` for any month → `BUDGET_CATEGORY_INVALID`.

### 11.6 Goals (BR-CALC-05/06/11, BR-GOAL-02)

| Goal | Target | Saved | Remaining | Over by | % | Bar | Complete | Past target date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| g-01 Emergency fund | 100000 | 25000 | 75000 | 0 | 25 | 25 | no | no |
| g-02 New laptop | 80000 | 88000 | 0 | 8000 | 110 | 100 | **yes** (overfunded) | no |
| g-03 Trip to Kampot | 30000 | 0 | 30000 | 0 | 0 | 0 | no | **yes** (2026-10-01) |
| g-04 Concert ticket | 5000 | 5000 | 0 | 0 | 100 | 100 | **yes** (exact) | no |

Savings totals: saved `118000` ($1,180.00) of target `215000` ($2,150.00) across 4 goals. Dashboard preview: `g-01`, `g-03`, `g-02`. Creating a goal named `" new LAPTOP "` → `GOAL_NAME_DUPLICATE`.

### 11.7 Mutation checks (INV-6, INV-7)

| Action on the fixture | Expected change |
| --- | --- |
| Add expense `food` `500` on `2026-11-18` | Nov expenses 27751 → 28251; net 23249 → 22749; food row 3751 → 4251; b-01 spent → 4251 (85%, `$7.49 left`); recent list starts with the new record |
| Then delete that expense | Every value returns to §11.1–§11.5 |
| Edit `t-07` date `2026-11-01` → `2026-10-30` | Oct expenses 5699 → 7700; Nov expenses 27751 → 25750; b-04 spent → 7250 (145%, over by 2250); b-01 spent → 1750 (35%) |
| Add contribution `2000` to g-01 | g-01 saved 27000 (27%); totals saved 120000; **no** change to §11.1–§11.5 |
| Remove `c-05` from g-04 | g-04 saved 0, incomplete; preview becomes `g-01`, `g-03`, `g-04` |
