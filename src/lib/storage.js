const KEYS = {
  transactions: 'flowbudget_transactions',
  budgets: 'flowbudget_budgets',
  goals: 'flowbudget_goals',
  settings: 'flowbudget_settings',
};

const STORAGE_KEY = 'flowbudget:v1';

export function createDefaultSnapshot() {
  return {
    schemaVersion: 1,
    transactions: [],
    budgets: [],
    goals: [],
    settings: {
      currency: 'USD',
      theme: 'dark',
    },
  };
}

export function loadSnapshot() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    // Carry over records saved by the earlier pages on the first snapshot load.
    const snapshot = data ? JSON.parse(data) : {
      ...createDefaultSnapshot(),
      transactions: loadFromStorage(KEYS.transactions) ?? [],
      budgets: loadFromStorage(KEYS.budgets) ?? [],
      goals: loadFromStorage(KEYS.goals) ?? [],
      settings: loadFromStorage(KEYS.settings) ?? createDefaultSnapshot().settings,
    };

    if (
      !snapshot ||
      snapshot.schemaVersion !== 1 ||
      !Array.isArray(snapshot.transactions) ||
      !Array.isArray(snapshot.budgets) ||
      !Array.isArray(snapshot.goals) ||
      !snapshot.settings ||
      !['USD', 'KHR'].includes(snapshot.settings.currency) ||
      !['light', 'dark'].includes(snapshot.settings.theme)
    ) {
      return createDefaultSnapshot();
    }
    return snapshot;
  } catch {
    return createDefaultSnapshot();
  }
}

export function saveSnapshot(snapshot) {
  try {
    const data = JSON.stringify(snapshot);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch {
    return false;
  }
}

export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function exportAllData(snapshot = loadSnapshot()) {
  return {
    ...snapshot,
    exportedAt: new Date().toISOString(),
  };
}

export function clearAllData() {
  try {
    [STORAGE_KEY, ...Object.values(KEYS)].forEach((key) => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}

export { KEYS };
