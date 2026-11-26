import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import BudgetForm from '../components/forms/BudgetForm';
import { formatMoney } from '../lib/money';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

function getMonthlySpending(transactions, month) {
  return transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amountMinor, 0);
}

export default function BudgetsPage({ currency = 'USD' }) {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSave(budget) {
    if (editing) {
      updateBudget(budget.id, budget);
      setToast('Budget updated!');
    } else {
      const exists = budgets.find((b) => b.month === budget.month);
      if (exists) {
        setToast('Budget for this month already exists!');
        return;
      }
      addBudget(budget);
      setToast('Budget set!');
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(budget) {
    setEditing(budget);
    setShowForm(true);
  }

  function confirmDelete() {
    deleteBudget(deleteTarget.id);
    setToast('Budget removed.');
    setDeleteTarget(null);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
  }

  const sorted = [...budgets].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div>
      <PageHeader
        title="Monthly budgets"
        description="Set a spending limit and keep your month on track."
        action={!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Set budget</Button>
        )}
      />

      {showForm && (
        <Card className="mb-6">
          <BudgetForm
            key={`${editing?.id ?? 'new'}-${currency}`}
            onSave={handleSave}
            onCancel={cancelForm}
            editingBudget={editing}
            currency={currency}
          />
        </Card>
      )}

      {sorted.length === 0 ? (
        <EmptyState
          icon="budgets"
          title="No budgets set yet"
          description="Set a monthly budget to track your spending."
          action={
            !showForm && (
              <Button onClick={() => setShowForm(true)}>
                Set your first budget
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((budget) => {
            const spent = getMonthlySpending(transactions, budget.month);
            const remaining = budget.limitMinor - spent;
            const overBudget = remaining < 0;
            const percent = budget.limitMinor > 0
              ? Math.round((spent / budget.limitMinor) * 100)
              : 0;

            return (
              <Card key={budget.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-50">{budget.month}</h3>
                  <span className="text-sm text-surface-600 dark:text-surface-400">
                    {formatMoney(spent, currency)} / {formatMoney(budget.limitMinor, currency)}
                  </span>
                </div>

                <ProgressBar
                  percent={Math.min(percent, 100)}
                  variant={overBudget ? 'danger' : percent >= 80 ? 'warning' : 'default'}
                />

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-sm font-medium ${overBudget ? 'text-danger-500' : 'text-surface-600 dark:text-surface-400'}`}>
                    {overBudget
                      ? `Over budget by ${formatMoney(Math.abs(remaining), currency)}`
                      : `${formatMoney(remaining, currency)} remaining`}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(budget)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Budget"
        message={`Delete the budget for ${deleteTarget?.month}?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-success-500 px-5 py-3 text-sm font-medium text-surface-950 shadow-lg lg:bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
}
