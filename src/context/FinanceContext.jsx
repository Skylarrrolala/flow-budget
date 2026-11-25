import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { exportAllData, clearAllData } from '../lib/storage';

const FinanceContext = createContext();

const DEFAULT_SETTINGS = { theme: 'dark', currency: 'USD' };

export function FinanceProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('flowbudget_settings', DEFAULT_SETTINGS);
  const [goals, setGoals] = useLocalStorage('flowbudget_goals', []);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
    showToast(settings.theme === 'dark' ? 'Switched to light theme' : 'Switched to dark theme');
  }, [settings.theme, setSettings, showToast]);

  const setCurrency = useCallback((currency) => {
    setSettings((prev) => ({ ...prev, currency }));
    showToast(`Currency changed to ${currency}`);
  }, [setSettings, showToast]);

  const addGoal = useCallback((goal) => {
    const newGoal = {
      ...goal,
      id: crypto.randomUUID(),
      contributions: [],
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast('Goal created!');
  }, [setGoals, showToast]);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Goal updated!');
  }, [setGoals, showToast]);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted.');
  }, [setGoals, showToast]);

  const addContribution = useCallback((goalId, amountMinor) => {
    const contribution = {
      id: crypto.randomUUID(),
      amountMinor,
      date: new Date().toISOString().slice(0, 10),
    };
    let reachedGoal = null;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updated = { ...g, contributions: [contribution, ...g.contributions] };
        const totalSaved = updated.contributions.reduce((s, c) => s + c.amountMinor, 0);
        const wasBelowTarget = g.contributions.reduce((s, c) => s + c.amountMinor, 0) < g.targetAmountMinor;
        if (wasBelowTarget && totalSaved >= g.targetAmountMinor) {
          reachedGoal = g.name;
        }
        return updated;
      })
    );
    if (reachedGoal) {
      showToast(`You reached ${reachedGoal}!`);
    } else {
      showToast('Contribution added!');
    }
  }, [setGoals, showToast]);

  const removeContribution = useCallback((goalId, contributionId) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return { ...g, contributions: g.contributions.filter((c) => c.id !== contributionId) };
      })
    );
    showToast('Contribution removed.');
  }, [setGoals, showToast]);

  const handleExport = useCallback(() => {
    const data = exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowbudget-export-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
  }, [showToast]);

  const factoryReset = useCallback(() => {
    clearAllData();
    setGoals([]);
    setSettings(DEFAULT_SETTINGS);
    showToast('All data has been reset.');
  }, [setGoals, setSettings, showToast]);

  const value = {
    settings,
    goals,
    toast,
    showToast,
    dismissToast,
    toggleTheme,
    setCurrency,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    removeContribution,
    handleExport,
    factoryReset,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export default FinanceContext;
