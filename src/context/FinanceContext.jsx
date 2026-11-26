import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createDefaultSnapshot, loadSnapshot, saveSnapshot, exportAllData, clearAllData } from '../lib/storage';
import { todayString } from '../lib/dates';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [snapshot, setSnapshot] = useState(loadSnapshot);
  const { settings, goals } = snapshot;

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

  useEffect(() => {
    if (!saveSnapshot(snapshot)) {
      // Report the result of browser storage I/O; it cannot be derived during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      showToast('Changes could not be saved. Export your data before closing this page.', 'error');
    }
  }, [snapshot, showToast]);

  const toggleTheme = useCallback(() => {
    setSnapshot((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
    showToast(settings.theme === 'dark' ? 'Switched to light theme' : 'Switched to dark theme');
  }, [settings.theme, showToast]);

  const setCurrency = useCallback((currency) => {
    if (currency === settings.currency) return;
    clearAllData();
    setSnapshot((prev) => ({
      ...prev,
      transactions: [],
      budgets: [],
      goals: [],
      settings: { ...prev.settings, currency },
    }));
    showToast(`Currency changed to ${currency}`);
  }, [settings.currency, showToast]);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = { ...transaction, id: transaction.id || crypto.randomUUID() };
    setSnapshot((prev) => ({ ...prev, transactions: [newTransaction, ...prev.transactions] }));
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setSnapshot((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates, id } : transaction
      ),
    }));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setSnapshot((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((transaction) => transaction.id !== id),
    }));
  }, []);

  const addBudget = useCallback((budget) => {
    const newBudget = { ...budget, id: budget.id || crypto.randomUUID() };
    setSnapshot((prev) => ({
      ...prev,
      budgets: prev.budgets.some((item) => item.month === budget.month)
        ? prev.budgets : [newBudget, ...prev.budgets],
    }));
  }, []);

  const updateBudget = useCallback((id, updates) => {
    setSnapshot((prev) => ({
      ...prev,
      budgets: prev.budgets.map((budget) => budget.id === id ? { ...budget, ...updates, id } : budget),
    }));
  }, []);

  const deleteBudget = useCallback((id) => {
    setSnapshot((prev) => ({ ...prev, budgets: prev.budgets.filter((budget) => budget.id !== id) }));
  }, []);

  const addGoal = useCallback((goal) => {
    const newGoal = {
      ...goal,
      id: crypto.randomUUID(),
      contributions: [],
    };
    setSnapshot((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
    showToast('Goal created!');
  }, [showToast]);

  const updateGoal = useCallback((id, updates) => {
    setSnapshot((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, ...updates, id, contributions: g.contributions } : g
      ),
    }));
    showToast('Goal updated!');
  }, [showToast]);

  const deleteGoal = useCallback((id) => {
    setSnapshot((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
    showToast('Goal deleted.');
  }, [showToast]);

  const addContribution = useCallback((goalId, amountMinor) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) return;
    const contribution = { id: crypto.randomUUID(), amountMinor, date: todayString() };
    const saved = goal.contributions.reduce((sum, item) => sum + item.amountMinor, 0);
    const reachedGoal = saved < goal.targetAmountMinor && saved + amountMinor >= goal.targetAmountMinor;
    setSnapshot((prev) => ({
      ...prev,
      goals: prev.goals.map((item) => item.id === goalId
        ? { ...item, contributions: [contribution, ...item.contributions] } : item),
    }));
    showToast(reachedGoal ? `You reached ${goal.name}!` : 'Contribution added!');
  }, [goals, showToast]);

  const removeContribution = useCallback((goalId, contributionId) => {
    setSnapshot((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => goal.id === goalId
        ? { ...goal, contributions: goal.contributions.filter((item) => item.id !== contributionId) }
        : goal),
    }));
    showToast('Contribution removed.');
  }, [showToast]);

  const handleExport = useCallback(() => {
    const data = exportAllData(snapshot);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = todayString();
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowbudget-export-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
  }, [snapshot, showToast]);

  const factoryReset = useCallback(() => {
    clearAllData();
    setSnapshot(createDefaultSnapshot());
    showToast('All data has been reset.');
  }, [showToast]);

  const value = {
    ...snapshot,
    toast,
    showToast,
    dismissToast,
    toggleTheme,
    setCurrency,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
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
