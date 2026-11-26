const KEYS = {
  transactions: 'flowbudget_transactions',
  budgets: 'flowbudget_budgets',
  goals: 'flowbudget_goals',
  settings: 'flowbudget_settings',
};

export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function exportAllData() {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    transactions: loadFromStorage(KEYS.transactions) || [],
    budgets: loadFromStorage(KEYS.budgets) || [],
    goals: loadFromStorage(KEYS.goals) || [],
    settings: loadFromStorage(KEYS.settings) || { theme: 'dark', currency: 'USD' },
  };
}

export function clearAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export { KEYS };
