// Will organize monthly category budgets and spending progress.
import { useState, useEffect } from 'react';
import BudgetForm from '../components/forms/BudgetForm';
import { formatMoney } from '../lib/money';

const BUDGET_KEY = 'flowbudget_budgets';
const TXN_KEY = 'flowbudget_transactions';

function loadBudgets() {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveBudgets(budgets) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
}

// pull transactions from localStorage to calculate spending
function loadTransactions() {
  try {
    const data = localStorage.getItem(TXN_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// add up all expense transactions for a given month
function getMonthlySpending(transactions, month) {
  return transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amountMinor, 0);
}

export default function BudgetsPage({ currency = 'USD' }) {
  const [budgets, setBudgets] = useState(loadBudgets);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const transactions = loadTransactions();

  // save budgets to localStorage
  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSave(budget) {
    if (editing) {
      setBudgets((prev) =>
        prev.map((b) => (b.id === budget.id ? budget : b))
      );
      setToast({ message: 'Budget updated!', type: 'success' });
    } else {
      // check if a budget for this month already exists
      const exists = budgets.find((b) => b.month === budget.month);
      if (exists) {
        setToast({ message: 'Budget for this month already exists!', type: 'delete' });
        return;
      }
      setBudgets((prev) => [budget, ...prev]);
      setToast({ message: 'Budget set!', type: 'success' });
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(budget) {
    setEditing(budget);
    setShowForm(true);
  }

  function handleDelete(budget) {
    setBudgets((prev) => prev.filter((b) => b.id !== budget.id));
    setToast({ message: 'Budget removed.', type: 'delete' });
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
  }

  // sort by month, newest first
  const sorted = [...budgets].sort(
    (a, b) => b.month.localeCompare(a.month)
  );

  return (
    <div>
      <h2>Monthly Budgets</h2>

      {showForm ? (
        <BudgetForm
          onSave={handleSave}
          onCancel={cancelForm}
          editingBudget={editing}
          currency={currency}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>
          + Set Budget
        </button>
      )}

      <div>
        {sorted.length === 0 && (
          <p>No budgets set yet.</p>
        )}

        {sorted.map((budget) => {
          const spent = getMonthlySpending(transactions, budget.month);
          const remaining = budget.limitMinor - spent;
          const overBudget = remaining < 0;
          const percent = Math.min(
            Math.round((spent / budget.limitMinor) * 100),
            100
          );

          return (
            <div key={budget.id}>
              <div>
                <strong>{budget.month}</strong>
                <span>
                  {formatMoney(spent, currency)} / {formatMoney(budget.limitMinor, currency)}
                </span>
              </div>

              {/* simple progress bar */}
              <div style={{ background: '#333', borderRadius: '4px', height: '8px', margin: '0.5rem 0' }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: overBudget ? '#e74c3c' : '#27ae60',
                  }}
                />
              </div>

              <div>
                {overBudget ? (
                  <span style={{ color: '#e74c3c' }}>
                    Over budget by {formatMoney(Math.abs(remaining), currency)}
                  </span>
                ) : (
                  <span>
                    {formatMoney(remaining, currency)} remaining
                  </span>
                )}
              </div>

              <div>
                <button onClick={() => handleEdit(budget)}>Edit</button>
                <button onClick={() => handleDelete(budget)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div>
          {toast.message}
        </div>
      )}
    </div>
  );
}