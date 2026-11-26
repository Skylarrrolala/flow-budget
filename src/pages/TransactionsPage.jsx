import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/forms/TransactionForm';
import TransactionFilters from '../components/ui/TransactionFilters';
import { formatMoney } from '../lib/money';
import { formatDate } from '../lib/dates';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

export default function TransactionsPage({ currency = 'USD' }) {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    sortBy: 'date-desc',
    month: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSave(txn) {
    if (editing) {
      updateTransaction(txn.id, txn);
      setToast('Transaction updated!');
    } else {
      addTransaction(txn);
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
    deleteTransaction(deleteTarget.id);
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
  if (filters.month) filtered = filtered.filter((t) => t.date.startsWith(filters.month));
  const validRange = filters.from && filters.to ? filters.from <= filters.to : true;
  if (validRange && filters.from) filtered = filtered.filter((t) => t.date >= filters.from);
  if (validRange && filters.to) filtered = filtered.filter((t) => t.date <= filters.to);

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
      <PageHeader
        title="Transactions"
        description="Review and manage money coming in and going out."
        action={!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Add transaction</Button>
        )}
      />

      {showForm && (
        <Card className="mb-6">
          <TransactionForm
            key={`${editing?.id ?? 'new'}-${currency}`}
            onSave={handleSave}
            onCancel={cancelForm}
            editingTransaction={editing}
            currency={currency}
          />
        </Card>
      )}

        <Card className="mb-4">
          <TransactionFilters filters={filters} onChange={setFilters} />
          {(filters.type !== 'all' || filters.category !== 'all' || filters.month || filters.from || filters.to) && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-3">
            Showing {sorted.length} of {transactions.length} transactions
            </p>
        )}
        </Card>

      {sorted.length === 0 ? (
        <EmptyState
          icon="transactions"
          title="No transactions yet"
          description="Add a transaction to start tracking your finances."
          action={
            !showForm && (
              <Button onClick={() => setShowForm(true)}>
                Add your first transaction
              </Button>
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(txn)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(txn)}
                  >
                    Delete
                  </Button>
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
        <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-success-500 px-5 py-3 text-sm font-medium text-surface-950 shadow-lg lg:bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
}
