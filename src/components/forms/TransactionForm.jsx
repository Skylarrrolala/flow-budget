import { useState } from 'react';
import { getCategoriesForType } from '../../data/categories';
import { parseToMinor, minorToInput } from '../../lib/money';
import { todayString } from '../../lib/dates';

export default function TransactionForm({
  onSave,
  onCancel,
  editingTransaction = null,
  currency = 'USD',
}) {
  const [type, setType] = useState(editingTransaction?.type ?? 'expense');
  const [amount, setAmount] = useState(() => editingTransaction
    ? minorToInput(editingTransaction.amountMinor, currency) : '');
  const [category, setCategory] = useState(editingTransaction?.category ?? '');
  const [description, setDescription] = useState(editingTransaction?.description ?? '');
  const [date, setDate] = useState(() => editingTransaction?.date ?? todayString());
  const [errors, setErrors] = useState({});

  function handleTypeChange(newType) {
    setType(newType);
    setCategory('');
    setErrors((prev) => ({ ...prev, category: undefined }));
  }

  function validate() {
    const errs = {};
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      errs.amount = 'Enter a positive amount.';
    } else if (currency === 'USD' && amount.includes('.')) {
      const dec = amount.split('.')[1];
      if (dec && dec.length > 2) errs.amount = 'Maximum 2 decimal places for USD.';
    }
    if (!category) errs.category = 'Select a category.';
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errs.date = 'Enter a valid date.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      id: editingTransaction?.id || crypto.randomUUID(),
      type,
      amountMinor: parseToMinor(amount, currency),
      category,
      description: description.trim(),
      date,
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && onCancel) onCancel();
  }

  const categories = getCategoriesForType(type);
  const isEditing = !!editingTransaction;

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm';

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
        {isEditing ? 'Edit Transaction' : 'Add Transaction'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'expense'
                ? 'bg-danger-500 text-white'
                : 'border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'income'
                ? 'bg-success-500 text-white'
                : 'border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Amount ({currency === 'KHR' ? '៛' : '$'})
        </label>
        <input
          type="number"
          step={currency === 'KHR' ? '1' : '0.01'}
          min={currency === 'KHR' ? '1' : '0.01'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={currency === 'KHR' ? '25000' : '12.50'}
          className={inputClass}
          aria-required="true"
          aria-invalid={!!errors.amount}
        />
        {errors.amount && <p className="text-xs text-danger-500 mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
          aria-required="true"
          aria-invalid={!!errors.category}
        >
          <option value="">— Select category —</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-danger-500 mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Lunch with friends"
          maxLength={100}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
          aria-required="true"
          aria-invalid={!!errors.date}
        />
        {errors.date && <p className="text-xs text-danger-500 mt-1">{errors.date}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
