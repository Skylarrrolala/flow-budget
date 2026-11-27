// Keep these labels aligned with the persisted transaction and demo-data categories.
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Allowance',
  'Investment',
  'Gift',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Other Expense',
];

export function getCategoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
