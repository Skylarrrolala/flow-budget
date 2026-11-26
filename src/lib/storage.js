const KEYS = {
  transactions: 'flowbudget_transactions',
  budgets: 'flowbudget_budgets',
  goals: 'flowbudget_goals',
  settings: 'flowbudget_settings',
};

export function createDefaultSnapshot(){
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
    const data = localStorage.getItem('flowbudget:v1');
    if (!data){
      return createDefaultSnapshot(); 
    } 
    const snapshot = JSON.parse(data);

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

    }    return snapshot;
    
  } catch {
    return createDefaultSnapshot(); 
  }
}

export function saveSnapshot(snapshot) {
  try {
    const data = JSON.stringify(snapshot);
    localStorage.setItem('flowbudget:v1', data);
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
