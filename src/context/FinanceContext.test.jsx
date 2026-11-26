// @vitest-environment jsdom
import { act, createRef, useImperativeHandle } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';
import { FinanceProvider, useFinance } from './FinanceContext';
import { createDefaultSnapshot, exportAllData } from '../lib/storage';
import BudgetsPage from '../pages/BudgetsPage';

const transaction = { id: 'txn-1', type: 'expense', amountMinor: 500, category: 'Food', description: '', date: '2026-11-25' };
const budget = { id: 'budget-1', month: '2026-11', limitMinor: 10000 };
const goal = {
  id: 'goal-1', name: 'Emergency fund', targetAmountMinor: 10000, targetDate: null,
  contributions: [{ id: 'contribution-1', amountMinor: 2500, date: '2026-11-25' }],
};
let root;
let container;
let api;

function Consumer({ apiRef }) {
  const finance = useFinance();
  useImperativeHandle(apiRef, () => finance, [finance]);
  return <output>{finance.transactions?.length} transactions</output>;
}

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true));
afterAll(() => vi.unstubAllGlobals());
beforeEach(() => {
  localStorage.clear();
  api = createRef();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  vi.restoreAllMocks();
  container.remove();
  localStorage.clear();
});

async function render(children) {
  await act(() => root.render(
    <FinanceProvider><Consumer apiRef={api} />{children}</FinanceProvider>
  ));
}

it('loads old saved records into one versioned snapshot and keeps them after remount', async () => {
  localStorage.setItem('flowbudget_transactions', JSON.stringify([transaction]));
  localStorage.setItem('flowbudget_budgets', JSON.stringify([budget]));
  localStorage.setItem('flowbudget_goals', JSON.stringify([goal]));
  localStorage.setItem('flowbudget_settings', JSON.stringify({ currency: 'KHR', theme: 'light' }));
  await render();
  expect(api.current.transactions).toEqual([transaction]);
  expect(api.current.budgets).toEqual([budget]);
  expect(api.current.goals).toEqual([goal]);
  const saved = JSON.parse(localStorage.getItem('flowbudget:v1'));
  expect(saved).toEqual({
    schemaVersion: 1, transactions: [transaction], budgets: [budget], goals: [goal],
    settings: { currency: 'KHR', theme: 'light' },
  });
  await act(() => root.unmount());
  root = createRoot(container);
  await render();
  expect(api.current.transactions).toEqual(saved.transactions);
  expect(api.current.goals).toEqual(saved.goals);
});

it('keeps consecutive transaction updates and updates budget spending without remounting', async () => {
  await render(<BudgetsPage />);
  expect(api.current.transactions).toEqual([]);
  await act(() => {
    api.current.addBudget(budget);
    api.current.addBudget({ ...budget, id: 'duplicate-budget' });
    api.current.addTransaction(transaction);
    api.current.addTransaction({ ...transaction, id: 'txn-2', amountMinor: 700 });
  });
  expect(api.current.transactions).toHaveLength(2);
  expect(api.current.budgets).toHaveLength(1);
  expect(container.textContent).toContain('2 transactions');
  expect(container.textContent).toContain('$12.00 / $100.00');
  await act(() => api.current.updateTransaction('txn-1', { ...transaction, amountMinor: 1000 }));
  expect(container.textContent).toContain('$17.00 / $100.00');
  await act(() => {
    api.current.deleteTransaction('txn-2');
    api.current.updateBudget('budget-1', { ...budget, limitMinor: 20000 });
  });
  expect(container.textContent).toContain('$10.00 / $200.00');
  await act(() => api.current.deleteBudget('budget-1'));
  expect(api.current.budgets).toEqual([]);
  expect(JSON.parse(localStorage.getItem('flowbudget:v1')).transactions).toHaveLength(1);
});

it('preserves records on theme changes and keeps contributions when editing a goal', async () => {
  const initial = { ...createDefaultSnapshot(), transactions: [transaction], budgets: [budget], goals: [goal] };
  localStorage.setItem('flowbudget:v1', JSON.stringify(initial));
  await render();
  expect(api.current.goals).toEqual([goal]);
  await act(() => api.current.toggleTheme());
  expect(api.current.settings.theme).toBe('light');
  expect(api.current.transactions).toEqual([transaction]);
  expect(api.current.goals).toEqual([goal]);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await act(() => api.current.updateGoal('goal-1', { name: 'New target', targetAmountMinor: 5000 }));
  expect(api.current.goals[0].contributions).toEqual(goal.contributions);
  await act(() => api.current.addContribution('goal-1', 2500));
  expect(api.current.goals[0].contributions).toHaveLength(2);
  expect(api.current.toast.message).toBe('You reached New target!');
  const contributionId = api.current.goals[0].contributions[0].id;
  await act(() => api.current.removeContribution('goal-1', contributionId));
  expect(api.current.goals[0].contributions).toEqual(goal.contributions);
  await act(() => {
    api.current.addGoal({ name: 'Laptop', targetAmountMinor: 100000, targetDate: null });
    api.current.addGoal({ name: 'Trip', targetAmountMinor: 200000, targetDate: null });
  });
  expect(api.current.goals).toHaveLength(3);
  await act(() => api.current.deleteGoal('goal-1'));
  expect(api.current.goals).toHaveLength(2);
  expect(JSON.parse(localStorage.getItem('flowbudget:v1')).goals).toHaveLength(2);
  expect(exportAllData()).toMatchObject({ transactions: [transaction], budgets: [budget], goals: api.current.goals });
});

it('factory reset persists defaults and preserves unrelated browser data', async () => {
  localStorage.setItem('flowbudget:v1', JSON.stringify({
    ...createDefaultSnapshot(), transactions: [transaction], goals: [goal],
    settings: { currency: 'KHR', theme: 'light' },
  }));
  localStorage.setItem('another-app', 'keep me');
  await render();
  expect(api.current.settings.currency).toBe('KHR');
  await act(() => api.current.factoryReset());
  expect(JSON.parse(localStorage.getItem('flowbudget:v1'))).toEqual(createDefaultSnapshot());
  expect(api.current.settings).toEqual({ currency: 'USD', theme: 'dark' });
  expect(localStorage.getItem('another-app')).toBe('keep me');
});

it('recovers from malformed saved JSON and stays usable when saving fails', async () => {
  localStorage.setItem('flowbudget:v1', '{broken');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
  await render();
  expect(api.current.transactions).toEqual([]);
  await act(() => api.current.addGoal({ name: 'Laptop', targetAmountMinor: 100000, targetDate: null }));
  expect(api.current.goals).toHaveLength(1);
  expect(api.current.toast.type).toBe('error');
  expect(api.current.toast.message).toContain('could not be saved');
});
