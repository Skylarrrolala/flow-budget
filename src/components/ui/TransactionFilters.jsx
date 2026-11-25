import { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/categories';

/*
  TransactionFilters — filter bar for the transactions list.

  Props:
    filters        current filter/sort state object
    onChange(f)    called with updated filters object
*/
export default function TransactionFilters({ filters, onChange }) {
  // combine all categories for the dropdown
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div>
      <label>Type: </label>
      <select
        value={filters.type}
        onChange={(e) => update('type', e.target.value)}
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <label> Category: </label>
      <select
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="all">All</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label> Sort: </label>
      <select
        value={filters.sortBy}
        onChange={(e) => update('sortBy', e.target.value)}
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Highest amount</option>
        <option value="amount-asc">Lowest amount</option>
      </select>
    </div>
  );
}