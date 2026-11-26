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

// get spending for a specific category in a specific month
function getCategorySpending(transactions, month, category) {
  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.date.startsWith(month) &&
        t.category === category
    )
    .reduce((sum, t) => sum + t.amountMinor, 0);
}

export default function BudgetsPage({ currency = 'USD' }) {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // filter budgets for the selected month
  const monthBudgets = budgets.filter((b) => b.month === selectedMonth);

  // categories that already have a budget this month
  const existingCategories = monthBudgets.map((b) => b.category);

  // overall totals for the month
  const totalLimit = monthBudgets.reduce((sum, b) => sum + b.limitMinor, 0);
  const totalSpent = monthBudgets.reduce(
    (sum, b) => sum + getCategorySpending(transactions, selectedMonth, b.category),
    0
  );
  const overallPercent = totalLimit > 0
    ? Math.round((totalSpent / totalLimit) * 100)
    : 0;
  const overallOver = totalSpent > totalLimit;

  function handleSave(budget) {
    if (editing) {
      updateBudget(budget.id, budget);
      setToast('Budget updated!');
    } else {
      // check if this category already has a budget for this month
      const exists = budgets.find(
        (b) => b.month === budget.month && b.category === budget.category
      );
      if (exists) {
        setToast('Budget for this category already exists!');
        return;
      }
      addBudget(budget);
      setToast('Budget added!');
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

  return (
    <div>
      <PageHeader
        title="Monthly budgets"
        description="Set spending limits per category and track your progress."
        action={!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Add category budget</Button>
        )}
      />

      {/* month selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mr-2">Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm"
        />
      </div>

      {/* overall summary */}
      {monthBudgets.length > 0 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              {formatMoney(totalSpent, currency)} / {formatMoney(totalLimit, currency)}
            </h3>
            <span className={`text-sm font-medium ${overallOver ? 'text-danger-500' : 'text-surface-600 dark:text-surface-400'}`}>
              {overallOver
                ? `${formatMoney(totalSpent - totalLimit, currency)} over budget`
                : `${formatMoney(totalLimit - totalSpent, currency)} remaining`}
            </span>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
            {overallPercent}% spent
          </p>
          <ProgressBar
            percent={Math.min(overallPercent, 100)}
            variant={overallOver ? 'danger' : overallPercent >= 80 ? 'warning' : 'default'}
          />
        </Card>
      )}

      {showForm && (
        <Card className="mb-6">
          <BudgetForm
            key={`${editing?.id ?? 'new'}-${currency}`}
            onSave={handleSave}
            onCancel={cancelForm}
            editingBudget={editing}
            existingCategories={existingCategories}
            currency={currency}
          />
        </Card>
      )}

      {monthBudgets.length === 0 ? (
        <EmptyState
          icon="budgets"
          title="No budgets set for this month"
          description="Add category budgets to track your spending."
          action={
            !showForm && (
              <Button onClick={() => setShowForm(true)}>
                Add your first category budget
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {monthBudgets.map((budget) => {
            const spent = getCategorySpending(transactions, selectedMonth, budget.category);
            const remaining = budget.limitMinor - spent;
            const overBudget = remaining < 0;
            const percent = budget.limitMinor > 0
              ? Math.round((spent / budget.limitMinor) * 100)
              : 0;

            return (
              <Card key={budget.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-50">
                    {budget.category}
                  </h3>
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
                      ? `${formatMoney(Math.abs(remaining), currency)} over budget`
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
        message={`Delete the ${deleteTarget?.category} budget for ${deleteTarget?.month}?`}
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