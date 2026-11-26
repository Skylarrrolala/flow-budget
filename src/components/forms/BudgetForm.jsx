import { useState } from 'react';
import { currentMonthString } from '../../lib/dates';
import { minorToInput } from '../../lib/money';
import Button from '../ui/Button';

export default function BudgetForm({
  onSave,
  onCancel,
  editingBudget = null,
  currency = 'USD',
}) {
  const [month, setMonth] = useState(() => editingBudget?.month ?? currentMonthString());
  const [limit, setLimit] = useState(() => editingBudget
    ? minorToInput(editingBudget.limitMinor, currency) : '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = parseFloat(limit);
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
      limitMinor,
    });
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
        {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
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
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Budget Limit ({currency === 'KHR' ? '៛' : '$'})
        </label>
        <input
          type="number"
          step={currency === 'KHR' ? '1' : '0.01'}
          min={currency === 'KHR' ? '1' : '0.01'}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder={currency === 'KHR' ? '500000' : '1000.00'}
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
          {editingBudget ? 'Save Changes' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}
