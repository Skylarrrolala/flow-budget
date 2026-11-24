// Will hold the agreed income and expense category lists.
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
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