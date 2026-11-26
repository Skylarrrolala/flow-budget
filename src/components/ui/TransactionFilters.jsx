import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/categories';
import Button from './Button';

export default function TransactionFilters({ filters, onChange }) {
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  // when user picks a month, clear the from/to dates (they conflict)
  function handleMonthChange(value) {
    onChange({ ...filters, month: value, from: '', to: '' });
  }

  // when user picks a from or to date, clear the month filter
  function handleDateChange(key, value) {
    onChange({ ...filters, [key]: value, month: '' });
  }

  function clearAll() {
    onChange({
      type: 'all',
      category: 'all',
      sortBy: filters.sortBy,  // keep the sort — it's not really a "filter"
      month: '',
      from: '',
      to: '',
    });
  }

  // check if any filter is active (besides sort)
  const hasActiveFilter =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.month !== '' ||
    filters.from !== '' ||
    filters.to !== '';

  // validate: from date is after to date
  const dateRangeError =
    filters.from && filters.to && filters.from > filters.to
      ? 'From date cannot be after To date.'
      : '';

  const selectClass =
    'px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm';

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Type</label>
          <select value={filters.type} onChange={(e) => update('type', e.target.value)} className={selectClass}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Category</label>
          <select value={filters.category} onChange={(e) => update('category', e.target.value)} className={selectClass}>
            <option value="all">All</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Month</label>
          <input
            type="month"
            value={filters.month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className={selectClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">From</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            className={selectClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">To</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={selectClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Sort</label>
          <select value={filters.sortBy} onChange={(e) => update('sortBy', e.target.value)} className={selectClass}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
        {hasActiveFilter && (
          <div className="flex items-end">
            <Button variant="secondary" size="sm" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
      {dateRangeError && (
        <p className="text-xs text-danger-500 mt-2">{dateRangeError}</p>
      )}
    </div>
  );
}