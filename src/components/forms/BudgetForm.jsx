import { useState, useEffect } from 'react';
import { currentMonthString } from '../../lib/dates';

/*
  BudgetForm — set a monthly spending budget.

  Props:
    onSave(budget)        called with { month, limitMinor }
    onCancel()            close the form
    editingBudget         pass existing budget to edit
    currency              'USD' or 'KHR'
*/
export default function BudgetForm({
  onSave,
  onCancel,
  editingBudget = null,
  currency = 'USD',
}) {
  const [month, setMonth] = useState(currentMonthString());
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  // pre-fill when editing
  useEffect(() => {
    if (editingBudget) {
      setMonth(editingBudget.month);
      if (currency === 'KHR') {
        setLimit(String(editingBudget.limitMinor));
      } else {
        setLimit((editingBudget.limitMinor / 100).toFixed(2));
      }
    }
  }, [editingBudget, currency]);

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

    const limitMinor = currency === 'KHR'
      ? Math.round(parsed)
      : Math.round(parsed * 100);

    onSave({
      id: editingBudget?.id || crypto.randomUUID(),
      month,
      limitMinor,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}</h3>

      <div>
        <label>Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div>
        <label>Budget Limit ({currency === 'KHR' ? '៛' : '$'})</label>
        <input
          type="number"
          step={currency === 'KHR' ? '1' : '0.01'}
          min="0.01"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder={currency === 'KHR' ? '500000' : '1000.00'}
        />
      </div>

      {error && <p>{error}</p>}

      <div>
        <button type="submit">
          {editingBudget ? 'Save Changes' : 'Set Budget'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}