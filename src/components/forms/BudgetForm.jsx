import { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../data/categories';
import { currentMonthString } from '../../lib/dates';
import { minorToInput } from '../../lib/money';
import Button from '../ui/Button';

export default function BudgetForm({
  onSave,
  onCancel,
  editingBudget = null,
  existingCategories = [],
  currency = 'USD',
}) {
  const [month, setMonth] = useState(() => editingBudget?.month ?? currentMonthString());
  const [category, setCategory] = useState(() => editingBudget?.category ?? '');
  const [limit, setLimit] = useState(() => editingBudget
    ? minorToInput(editingBudget.limitMinor, currency) : '');
  const [error, setError] = useState('');

  // filter out categories that already have a budget this month
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !existingCategories.includes(cat) || cat === editingBudget?.category
  );

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = parseFloat(limit);

    if (!category) {
      setError('Select a category.');
      return;
    }
    if (!limit || isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive budget amount.');
      return;
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      setError('Pick a valid month.');
      return;
    }
    setError('');
    const limitMinor = currency === 'KHR' ? Math.round(parsed) : Math.round(parsed * 100);
    onSave({
      id: editingBudget?.id || crypto.randomUUID(),
      month,
      category,
      limitMinor,
    });
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
        {editingBudget ? 'Edit Category Budget' : 'Add Category Budget'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">— Select category —</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Budget Limit ({currency === 'KHR' ? '៛' : '$'})
        </label>
        <input
          type="number"
          step={currency === 'KHR' ? '1' : '0.01'}
          min={currency === 'KHR' ? '1' : '0.01'}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder={currency === 'KHR' ? '500000' : '100.00'}
          className={inputClass}
        />
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1"
        >
          {editingBudget ? 'Save Changes' : 'Add Budget'}
        </Button>
      </div>
    </form>
  );
}