import { useState, useEffect } from 'react';
import { getCategoriesForType } from '../../data/categories';
import { parseToMinor, minorToInput } from '../../lib/money';
import { todayString } from '../../lib/dates';
import './TransactionForm.css';

/*
  TransactionForm — used for both adding and editing.

  Props:
    onSave(txn)           called with the validated transaction object
    onCancel()            called on cancel / escape
    editingTransaction    pass an existing txn to enter edit mode
    currency              'USD' or 'KHR'
*/
export default function TransactionForm({
  onSave,
  onCancel,
  editingTransaction = null,
  currency = 'USD',
}) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayString());
  const [errors, setErrors] = useState({});

  // pre-fill when editing
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(minorToInput(editingTransaction.amountMinor, currency));
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description || '');
      setDate(editingTransaction.date);
    }
  }, [editingTransaction, currency]);

  // switching type clears category since the lists are different
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
      if (dec && dec.length > 2) {
        errs.amount = 'Maximum 2 decimal places for USD.';
      }
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

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="txn-form">
      <h3>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h3>

      {/* type toggle */}
      <div className="field">
        <label>Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'expense' ? 'active-expense' : ''}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? 'active-income' : ''}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>
      </div>

      {/* amount */}
      <div className="field">
        <label>Amount ({currency === 'KHR' ? '៛' : '$'})</label>
        <input
          type="number"
          step={currency === 'KHR' ? '1' : '0.01'}
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={currency === 'KHR' ? '25000' : '12.50'}
        />
        {errors.amount && <p className="error-msg">{errors.amount}</p>}
      </div>

      {/* category */}
      <div className="field">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">— Select category —</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="error-msg">{errors.category}</p>}
      </div>

      {/* description */}
      <div className="field">
        <label>Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Lunch with friends"
          maxLength={100}
        />
      </div>

      {/* date */}
      <div className="field">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="error-msg">{errors.date}</p>}
      </div>

      {/* buttons */}
      <div className="form-actions">
        <button type="submit" className="btn-save">
          {isEditing ? 'Save Changes' : 'Add Transaction'}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}