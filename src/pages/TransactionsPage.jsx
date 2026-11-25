import { useState, useEffect } from 'react';
import TransactionForm from '../components/forms/TransactionForm';
import TransactionFilters from '../components/ui/TransactionFilters';
import { formatMoney } from '../lib/money';
import { formatDate } from '../lib/dates';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';

const STORAGE_KEY = 'flowbudget_transactions';

function loadTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export default function TransactionsPage({ currency = 'USD' }) {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    sortBy: 'date-desc',
  });

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSave(txn) {
    if (editing) {
      setTransactions((prev) => prev.map((t) => (t.id === txn.id ? txn : t)));
      setToast('Transaction updated!');
    } else {
      setTransactions((prev) => [txn, ...prev]);
      setToast('Transaction added!');
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(txn) {
    setEditing(txn);
    setShowForm(true);
  }

  function confirmDelete() {
    setTransactions((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setToast('Transaction deleted.');
    setDeleteTarget(null);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
  }

  let filtered = transactions;
  if (filters.type !== 'all') filtered = filtered.filter((t) => t.type === filters.type);
  if (filters.category !== 'all') filtered = filtered.filter((t) => t.category === filters.category);

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-asc': return a.date.localeCompare(b.date);
      case 'amount-desc': return b.amountMinor - a.amountMinor;
      case 'amount-asc': return a.amountMinor - b.amountMinor;
      default: return b.date.localeCompare(a.date);
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Transactions</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <TransactionForm
            onSave={handleSave}
            onCancel={cancelForm}
            editingTransaction={editing}
            currency={currency}
          />
        </Card>
      )}

      <Card className="mb-4">
        <TransactionFilters filters={filters} onChange={setFilters} />
      </Card>

      {sorted.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No transactions yet"
          description="Add a transaction to start tracking your finances."
          action={
            !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add your first transaction
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((txn) => (
            <Card key={txn.id} className="!p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{txn.category}</span>
                    {txn.description && (
                      <span className="text-sm text-surface-500 dark:text-surface-400 truncate">— {txn.description}</span>
                    )}
                  </div>
                  <span className="text-xs text-surface-400 dark:text-surface-500">{formatDate(txn.date)}</span>
                </div>

                <span className={`text-sm font-semibold mr-4 ${
                  txn.type === 'expense' ? 'text-danger-500' : 'text-success-600 dark:text-success-500'
                }`}>
                  {txn.type === 'expense' ? '-' : '+'}{formatMoney(txn.amountMinor, currency)}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(txn)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(txn)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-danger-300 dark:border-danger-500/50 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Transaction"
        message={`Delete this ${deleteTarget?.category} transaction?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-success-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}
