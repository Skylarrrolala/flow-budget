// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinanceProvider } from '../context/FinanceContext';
import TransactionsPage from './TransactionsPage';
import BudgetsPage from './BudgetsPage';

const records = {
  transactions: [{ id: 'txn-1', type: 'expense', amountMinor: 500, category: 'Food', description: '', date: '2026-11-25' }],
  budgets: [{ id: 'budget-1', month: '2026-11', limitMinor: 10000 }],
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

async function enterAmount(value) {
  const input = container.querySelector('input[type="number"]');
  await act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

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
