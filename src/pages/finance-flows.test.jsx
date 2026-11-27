// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinanceProvider } from '../context/FinanceContext';
import { DEMO_TRANSACTIONS } from '../data/demoData';
import { currentMonthString } from '../lib/dates';
import DashboardPage from './DashboardPage';
import TransactionForm from '../components/forms/TransactionForm';
import BudgetForm from '../components/forms/BudgetForm';
import GoalsPage from './GoalsPage';
import SettingsPage from './SettingsPage';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './BudgetsPage';

const readSaved = () => JSON.parse(localStorage.getItem('flowbudget:v1'));

function expectDemoTransactions(transactions) {
  const withoutDate = (transaction) => Object.fromEntries(
    Object.entries(transaction).filter(([key]) => key !== 'date')
  );
  expect(transactions).toHaveLength(DEMO_TRANSACTIONS.length);
  expect(transactions.map(withoutDate)).toEqual(
    DEMO_TRANSACTIONS.map(withoutDate)
  );
}

const goal = {
  id: 'goal-1', name: 'Emergency fund', targetAmountMinor: 10000, targetDate: null,
  contributions: [{ id: 'contribution-1', amountMinor: 2500, date: '2026-11-25' }],
};
const records = {
  transactions: [{ id: 'txn-1', type: 'expense', amountMinor: 500, category: 'Food', description: '', date: '2026-11-25' }],
  budgets: [{ id: 'budget-1', month: '2026-11', category: 'Food', limitMinor: 10000 }],
  goals: [goal],
};
let container;
let root;

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true));
afterAll(() => vi.unstubAllGlobals());
beforeEach(() => {
  localStorage.clear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

async function render(children) {
  await act(() => root.render(<FinanceProvider>{children}</FinanceProvider>));
}

async function click(label, scope = container) {
  const button = [...scope.querySelectorAll('button')].find((item) => label.test(item.textContent.trim()));
  expect(button, `Button matching ${label}`).toBeDefined();
  await act(() => button.click());
}

async function enterAmount(value) {
  const input = container.querySelector('input[type="number"]');
  await enterValue(input, value);
}

async function enterValue(input, value) {
  await act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

describe('currency changes (WBS 1.3.6.2)', () => {
  it.each(Object.keys(records))('requires confirmation when only %s exist, and cancel preserves them', async (kind) => {
    localStorage.setItem(`flowbudget_${kind}`, JSON.stringify(records[kind]));
    await render(<SettingsPage />);
    await click(/KHR$/);

    const dialog = container.querySelector('[role="alertdialog"]');
    expect(dialog).not.toBeNull();
    expect(readSaved().settings.currency).toBe('USD');
    await click(/^Cancel$/, dialog);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    expect(readSaved()[kind]).toEqual(records[kind]);
    expect(readSaved().settings.currency).toBe('USD');
  });

  it.each([['USD', 'KHR'], ['KHR', 'USD']])('confirmed %s to %s switching clears records, keeps theme/other data, and survives remount', async (from, to) => {
    for (const [kind, values] of Object.entries(records)) {
      localStorage.setItem(`flowbudget_${kind}`, JSON.stringify(values));
    }
    localStorage.setItem('flowbudget_settings', JSON.stringify({ theme: 'light', currency: from }));
    localStorage.setItem('another-app', 'keep me');
    await render(<><SettingsPage /><GoalsPage /></>);
    await click(new RegExp(`${to}$`));
    const dialog = container.querySelector('[role="alertdialog"]');
    expect(dialog.textContent.toLowerCase()).toContain('goals');
    await click(/Switch Currency$/i, dialog);

    for (const kind of Object.keys(records)) {
      expect(readSaved()[kind] || []).toEqual([]);
    }
    expect(readSaved().settings).toEqual({ theme: 'light', currency: to });
    expect(localStorage.getItem('another-app')).toBe('keep me');
    expect(container.textContent).toContain('No savings goals yet');

    await act(() => root.unmount());
    root = createRoot(container);
    await render(<><SettingsPage /><GoalsPage /></>);
    expect(container.textContent).toContain(`All amounts shown in ${to === 'KHR' ? 'Khmer Riel' : 'US Dollars'}`);
    expect(container.textContent).toContain('No savings goals yet');
  });

  it('switches an empty app without prompting', async () => {
    await render(<SettingsPage />);
    await click(/KHR$/);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    expect(readSaved().settings.currency).toBe('KHR');
  });

  it('clicking the current currency preserves records without prompting', async () => {
    localStorage.setItem('flowbudget_goals', JSON.stringify(records.goals));
    await render(<SettingsPage />);
    await click(/USD$/);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    expect(readSaved().goals).toEqual(records.goals);
  });
});

describe('demo data', () => {
  it('confirms replacement and preserves existing data when canceled', async () => {
    for (const [kind, values] of Object.entries(records)) {
      localStorage.setItem(`flowbudget_${kind}`, JSON.stringify(values));
    }
    localStorage.setItem('flowbudget_settings', JSON.stringify({ currency: 'KHR', theme: 'light' }));
    await render(<SettingsPage />);

    await click(/Load demo data/i);
    const dialog = container.querySelector('[role="alertdialog"]');
    expect(dialog.textContent).toContain('203 USD demo transactions, 3 budgets, and 3 goals');
    await click(/^Cancel$/, dialog);
    expect(readSaved()).toMatchObject({ ...records, settings: { currency: 'KHR', theme: 'light' } });

    await click(/Load demo data/i);
    await click(/Replace with Demo Data/i, container.querySelector('[role="alertdialog"]'));
    const saved = readSaved();
    expectDemoTransactions(saved.transactions);
    expect(saved.budgets).toHaveLength(3);
    expect(saved.budgets.every((budget) => budget.month === currentMonthString())).toBe(true);
    expect(saved.goals).toHaveLength(3);
    expect(saved.goals.find((goal) => goal.id === 'demo-goal-2').targetDate).toBe('');
    expect(saved).toMatchObject({
      settings: { currency: 'USD', theme: 'light' },
    });
  });

  it('loads the demo directly when there are no existing records', async () => {
    await render(<SettingsPage />);
    await click(/Load demo data/i);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    const saved = readSaved();
    expectDemoTransactions(saved.transactions);
    expect(saved.budgets).toHaveLength(3);
    expect(saved.budgets.every((budget) => budget.month === currentMonthString())).toBe(true);
    expect(saved.goals).toHaveLength(3);
    expect(saved.goals.find((goal) => goal.id === 'demo-goal-2').targetDate).toBe('');
    expect(saved).toMatchObject({
      settings: { currency: 'USD', theme: 'dark' },
    });
  });

  it("aligns the newest date to today and preserves every transaction's relative date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 3, 12));
    try {
      await render(<SettingsPage />);
      await click(/Load demo data/i);

      const transactions = readSaved().transactions;
      expect(transactions[0].date).toBe('2026-12-03');
      expect(transactions[transactions.length - 1].date).toBe('2026-09-08');
      expectDemoTransactions(transactions);
      const saved = readSaved();
      expect(saved.budgets.map((budget) => budget.month)).toEqual(['2026-12', '2026-12', '2026-12']);
      expect(saved.goals.find((goal) => goal.id === 'demo-goal-1').targetDate).toBe('2027-03-08');
      expect(saved.goals.find((goal) => goal.id === 'demo-goal-2').targetDate).toBe('');
      expect(saved.goals.find((goal) => goal.id === 'demo-goal-3').targetDate).toBe('2026-11-22');
      expect(
        saved.goals.find((goal) => goal.id === 'demo-goal-2').contributions
          .find((contribution) => contribution.id === 'demo-contribution-5').date
      ).toBe('2026-11-26');

      const originalNewest = Date.parse(`${DEMO_TRANSACTIONS[0].date}T00:00:00Z`);
      const shiftedNewest = Date.parse(`${transactions[0].date}T00:00:00Z`);
      transactions.forEach((transaction, index) => {
        const originalDate = Date.parse(`${DEMO_TRANSACTIONS[index].date}T00:00:00Z`);
        const shiftedDate = Date.parse(`${transaction.date}T00:00:00Z`);
        expect(shiftedDate - shiftedNewest).toBe(originalDate - originalNewest);
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('goal persistence', () => {
  it('saves an optional target date and restores it after remounting', async () => {
    await render(<GoalsPage />);
    await click(/Create Goal$/);
    await enterValue(container.querySelector('input[type="text"]'), 'Study abroad');
    await enterValue(container.querySelector('input[type="number"]'), '1000');
    await enterValue(container.querySelector('input[type="date"]'), '2027-01-15');
    await click(/^Create Goal$/);

    expect(readSaved().goals[0]).toMatchObject({
      name: 'Study abroad',
      targetAmountMinor: 100000,
      targetDate: '2027-01-15',
    });

    await act(() => root.unmount());
    root = createRoot(container);
    await render(<GoalsPage />);
    expect(container.textContent).toContain('Target: Jan 15, 2027');
    await click(/^Edit$/);
    expect(container.querySelector('input[type="date"]').value).toBe('2027-01-15');
  });
});

describe('dashboard recent transactions', () => {
  it('shows the five newest transactions across months without reordering context data', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 1, 12));
    const transactions = [
      { id: 'nov-29-first', type: 'expense', amountMinor: 125, category: 'Food', description: 'Nov 29 first', date: '2026-11-29' },
      { id: 'nov-30-first', type: 'expense', amountMinor: 100, category: 'Transport', description: 'Nov 30 first', date: '2026-11-30' },
      { id: 'nov-30-second', type: 'income', amountMinor: 500, category: 'Salary', description: 'Nov 30 second', date: '2026-11-30' },
      { id: 'nov-29-second', type: 'expense', amountMinor: 225, category: 'Food', description: 'Nov 29 second', date: '2026-11-29' },
      { id: 'nov-28', type: 'expense', amountMinor: 250, category: 'Transport', description: 'Nov 28', date: '2026-11-28' },
      { id: 'nov-27', type: 'expense', amountMinor: 300, category: 'Food', description: 'Nov 27', date: '2026-11-27' },
    ];
    localStorage.setItem('flowbudget_transactions', JSON.stringify(transactions));
    try {
      await render(<MemoryRouter><DashboardPage /></MemoryRouter>);

      const recentHeading = [...container.querySelectorAll('h2')]
        .find((heading) => heading.textContent === 'Recent transactions');
      const recentCard = recentHeading.parentElement.parentElement;
      const rows = [...recentCard.lastElementChild.children];
      expect(rows).toHaveLength(5);
      expect(rows.map((row) => row.textContent)).toEqual([
        'Transport— Nov 30 firstNov 30, 2026-$1.00',
        'Salary— Nov 30 secondNov 30, 2026+$5.00',
        'Food— Nov 29 firstNov 29, 2026-$1.25',
        'Food— Nov 29 secondNov 29, 2026-$2.25',
        'Transport— Nov 28Nov 28, 2026-$2.50',
      ]);
      expect(recentCard.querySelector('a').getAttribute('href')).toBe('/transactions');
      expect(readSaved().transactions.map((transaction) => transaction.id))
        .toEqual(transactions.map((transaction) => transaction.id));
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('amount inputs', () => {
  it('rejects fractional KHR contributions and persists a whole-riel contribution', async () => {
    localStorage.setItem('flowbudget_settings', JSON.stringify({ theme: 'dark', currency: 'KHR' }));
    localStorage.setItem('flowbudget_goals', JSON.stringify([goal]));
    await render(<GoalsPage />);
    await enterAmount('1.5');
    await click(/^\+ Add$/);
    expect(container.textContent).toContain('Enter a positive amount in whole riel.');
    expect(readSaved().goals[0].contributions).toEqual(goal.contributions);

    await enterAmount('25000');
    await click(/^\+ Add$/);
    expect(readSaved().goals[0].contributions[0].amountMinor).toBe(25000);
    expect(readSaved().goals[0].contributions).toHaveLength(2);
  });

  it.each(['transaction', 'budget', 'goal', 'contribution'])('accepts whole KHR and rejects fractional/zero amounts in the %s input', async (kind) => {
    localStorage.setItem('flowbudget_settings', JSON.stringify({ theme: 'dark', currency: 'KHR' }));
    if (kind === 'contribution') localStorage.setItem('flowbudget_goals', JSON.stringify([goal]));
    const form = kind === 'transaction' ? <TransactionForm currency="KHR" />
      : kind === 'budget' ? <BudgetForm currency="KHR" /> : <GoalsPage />;
    await render(form);
    if (kind === 'goal') await click(/Create Goal$/);
    const input = container.querySelector('input[type="number"]');

    input.value = '25000';
    expect(input.checkValidity()).toBe(true);
    input.value = '25000.5';
    expect(input.checkValidity()).toBe(false);
    input.value = '0';
    expect(input.checkValidity()).toBe(false);
  });

  it('still accepts USD cents', async () => {
    await render(<TransactionForm currency="USD" />);
    const input = container.querySelector('input[type="number"]');
    input.value = '0.01';
    expect(input.checkValidity()).toBe(true);
    input.value = '1.001';
    expect(input.checkValidity()).toBe(false);
  });
});

describe('editing records', () => {
  it.each(['transactions', 'budgets'])('switches the open %s form to the selected record and saves the right amount', async (kind) => {
    const original = records[kind][0];
    const second = kind === 'transactions'
      ? { ...original, id: 'txn-2', amountMinor: 900 }
      : { ...original, id: 'budget-2', category: 'Transport' , limitMinor: 900 };
    localStorage.setItem(`flowbudget_${kind}`, JSON.stringify([original, second]));
    await render(kind === 'transactions' ? <TransactionsPage /> : <BudgetsPage />);

    const editButtons = () => [...container.querySelectorAll('button')].filter((button) => button.textContent.trim() === 'Edit');
    await act(() => editButtons()[0].click());
    expect(container.querySelector('input[type="number"]').value).toBe(kind === 'transactions' ? '5.00' : '100.00');
    await act(() => editButtons()[1].click());
    expect(container.querySelector('input[type="number"]').value).toBe('9.00');
    await enterAmount('12.50');
    await act(() => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

    const saved = readSaved()[kind];
    expect(saved[0]).toEqual(original);
    expect(saved[1][kind === 'transactions' ? 'amountMinor' : 'limitMinor']).toBe(1250);
    expect(saved).toHaveLength(2);
  });
});
