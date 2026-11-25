import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/categories';

export default function TransactionFilters({ filters, onChange }) {
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  const selectClass = 'px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm';

  return (
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
        <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Sort</label>
        <select value={filters.sortBy} onChange={(e) => update('sortBy', e.target.value)} className={selectClass}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>
    </div>
  );
}
