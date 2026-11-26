// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinanceProvider } from '../context/FinanceContext';
import TransactionForm from '../components/forms/TransactionForm';
import BudgetForm from '../components/forms/BudgetForm';
import GoalsPage from './GoalsPage';
import SettingsPage from './SettingsPage';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './BudgetsPage';

const goal = {
  id: 'goal-1', name: 'Emergency fund', targetAmountMinor: 10000, targetDate: null,
  contributions: [{ id: 'contribution-1', amountMinor: 2500, date: '2026-11-25' }],
};
const records = {
  transactions: [{ id: 'txn-1', type: 'expense', amountMinor: 500, category: 'Food', description: '', date: '2026-11-25' }],
  budgets: [{ id: 'budget-1', month: '2026-11', limitMinor: 10000 }],
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
  await act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('currency changes (WBS 1.3.6.2)', () => {
  it.each(Object.keys(records))('requires confirmation when only %s exist, and cancel preserves them', async (kind) => {
    localStorage.setItem(`flowbudget_${kind}`, JSON.stringify(records[kind]));
    await render(<SettingsPage />);
    await click(/KHR$/);

    const dialog = container.querySelector('[role="alertdialog"]');
    expect(dialog).not.toBeNull();
    expect(JSON.parse(localStorage.getItem('flowbudget_settings')).currency).toBe('USD');
    await click(/^Cancel$/, dialog);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    expect(JSON.parse(localStorage.getItem(`flowbudget_${kind}`))).toEqual(records[kind]);
    expect(JSON.parse(localStorage.getItem('flowbudget_settings')).currency).toBe('USD');
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
      expect(JSON.parse(localStorage.getItem(`flowbudget_${kind}`)) || []).toEqual([]);
    }
    expect(JSON.parse(localStorage.getItem('flowbudget_settings'))).toEqual({ theme: 'light', currency: to });
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
    expect(JSON.parse(localStorage.getItem('flowbudget_settings')).currency).toBe('KHR');
  });

  it('clicking the current currency preserves records without prompting', async () => {
    localStorage.setItem('flowbudget_goals', JSON.stringify(records.goals));
    await render(<SettingsPage />);
    await click(/USD$/);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();
    expect(JSON.parse(localStorage.getItem('flowbudget_goals'))).toEqual(records.goals);
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
    expect(JSON.parse(localStorage.getItem('flowbudget_goals'))[0].contributions).toEqual(goal.contributions);

    await enterAmount('25000');
    await click(/^\+ Add$/);
    expect(JSON.parse(localStorage.getItem('flowbudget_goals'))[0].contributions[0].amountMinor).toBe(25000);
    expect(JSON.parse(localStorage.getItem('flowbudget_goals'))[0].contributions).toHaveLength(2);
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
      : { ...original, id: 'budget-2', month: '2026-10', limitMinor: 900 };
    localStorage.setItem(`flowbudget_${kind}`, JSON.stringify([original, second]));
    await render(kind === 'transactions' ? <TransactionsPage /> : <BudgetsPage />);

    const editButtons = () => [...container.querySelectorAll('button')].filter((button) => button.textContent.trim() === 'Edit');
    await act(() => editButtons()[0].click());
    expect(container.querySelector('input[type="number"]').value).toBe(kind === 'transactions' ? '5.00' : '100.00');
    await act(() => editButtons()[1].click());
    expect(container.querySelector('input[type="number"]').value).toBe('9.00');
    await enterAmount('12.50');
    await act(() => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

    const saved = JSON.parse(localStorage.getItem(`flowbudget_${kind}`));
    expect(saved[0]).toEqual(original);
    expect(saved[1][kind === 'transactions' ? 'amountMinor' : 'limitMinor']).toBe(1250);
    expect(saved).toHaveLength(2);
  });
});
