import { useState, useEffect } from 'react';
import TransactionForm from '../components/forms/TransactionForm';
import TransactionFilters from '../components/ui/TransactionFilters';
import { formatMoney } from '../lib/money';
import { formatDate } from '../lib/dates';

const STORAGE_KEY = 'flowbudget_transactions';

// read saved transactions from localStorage
function loadTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// write transactions array to localStorage
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

  // save to localStorage whenever transactions change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // auto-hide toast after 2.5s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSave(txn) {
    if (editing) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === txn.id ? txn : t))
      );
      setToast({ message: 'Transaction updated!', type: 'success' });
    } else {
      setTransactions((prev) => [txn, ...prev]);
      setToast({ message: 'Transaction added!', type: 'success' });
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(txn) {
    setEditing(txn);
    setShowForm(true);
  }

  function handleDeleteClick(txn) {
    setDeleteTarget(txn);
  }

  function confirmDelete() {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== deleteTarget.id)
    );
    setToast({ message: 'Transaction deleted.', type: 'delete' });
    setDeleteTarget(null);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
  }

  // apply filters
  let filtered = transactions;

  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // apply sort
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-asc':
        return a.date.localeCompare(b.date);
      case 'amount-desc':
        return b.amountMinor - a.amountMinor;
      case 'amount-asc':
        return a.amountMinor - b.amountMinor;
      default:
        return b.date.localeCompare(a.date);
    }
  });

  return (
    <div className="txn-page">
      <h2>Transactions</h2>

      {showForm ? (
        <TransactionForm
          onSave={handleSave}
          onCancel={cancelForm}
          editingTransaction={editing}
          currency={currency}
        />
      ) : (
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Add Transaction
        </button>
      )}

      <TransactionFilters filters={filters} onChange={setFilters} />

      <div className="txn-list">
        {sorted.length === 0 && (
          <p className="txn-empty">No transactions yet. Add one above!</p>
        )}

        {sorted.map((txn) => (
          <div key={txn.id} className="txn-row">
            <div className="txn-info">
              <div className="txn-top">
                <span className="txn-category">{txn.category}</span>
                {txn.description && (
                  <span className="txn-desc">— {txn.description}</span>
                )}
              </div>
              <span className="txn-date">{formatDate(txn.date)}</span>
            </div>

            <span className={`txn-amount ${
              txn.type === 'expense' ? 'amount-expense' : 'amount-income'
            }`}>
              {txn.type === 'expense' ? '−' : '+'}
              {formatMoney(txn.amountMinor, currency)}
            </span>

            <div className="txn-actions">
              <button onClick={() => handleEdit(txn)}>Edit</button>
              <button onClick={() => handleDeleteClick(txn)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>Delete this {deleteTarget.category} transaction?</p>
            <div className="modal-buttons">
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="btn-modal-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${
          toast.type === 'delete' ? 'toast-delete' : 'toast-success'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}