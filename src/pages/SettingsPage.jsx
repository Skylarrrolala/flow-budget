import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { KEYS, loadFromStorage } from '../lib/storage';

export default function SettingsPage() {
  const {
    settings, goals, toggleTheme, setCurrency, handleExport, factoryReset,
  } = useFinance();

  const [showCurrencyConfirm, setShowCurrencyConfirm] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleCurrencyChange(newCurrency) {
    if (newCurrency === settings.currency) return;

    const txns = loadFromStorage(KEYS.transactions) || [];
    const budgets = loadFromStorage(KEYS.budgets) || [];
    const hasRecords = txns.length > 0 || budgets.length > 0 || goals.length > 0;

    if (hasRecords) {
      setPendingCurrency(newCurrency);
      setShowCurrencyConfirm(true);
    } else {
      setCurrency(newCurrency);
    }
  }

  function confirmCurrencyChange() {
    setCurrency(pendingCurrency);
    setShowCurrencyConfirm(false);
    setPendingCurrency(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">Settings</h1>

      <div className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Theme</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Currently using {settings.theme} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
            >
              {settings.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Currency</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Display Currency</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                All amounts shown in {settings.currency === 'USD' ? 'US Dollars ($)' : 'Khmer Riel (៛)'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCurrencyChange('USD')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  settings.currency === 'USD'
                    ? 'bg-primary-500 text-white'
                    : 'border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => handleCurrencyChange('KHR')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  settings.currency === 'KHR'
                    ? 'bg-primary-500 text-white'
                    : 'border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                ៛ KHR
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Export Data</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Download all your data as JSON
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
              >
                📥 Export JSON
              </button>
            </div>

            <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-danger-500">Factory Reset</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Delete all transactions, budgets, goals, and settings
                  </p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2.5 rounded-lg bg-danger-500 hover:bg-danger-600 text-white text-sm font-medium transition-colors"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="!bg-surface-100 dark:!bg-surface-900/50 !border-dashed">
          <p className="text-xs text-surface-500 dark:text-surface-400">
            💾 All data is stored locally in your browser using localStorage. Your data stays on this device and is not sent to any server. Clearing browser data will remove all FlowBudget records.
          </p>
        </Card>
      </div>

      <ConfirmDialog
        open={showCurrencyConfirm}
        title="Change Currency"
        message={`Switching to ${pendingCurrency} requires resetting all transactions, budgets, goals, and contributions. Amounts cannot be converted between currencies. Export your data first if you want to keep a copy.`}
        confirmLabel="Reset & Switch Currency"
        onConfirm={confirmCurrencyChange}
        onCancel={() => setShowCurrencyConfirm(false)}
      >
        <button
          onClick={() => { handleExport(); }}
          className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 text-sm font-medium transition-colors"
        >
          📥 Export data first
        </button>
      </ConfirmDialog>

      <ConfirmDialog
        open={showResetConfirm}
        title="Factory Reset"
        message="This will permanently delete all your data. This action cannot be undone."
        confirmLabel="Delete Everything"
        onConfirm={() => { factoryReset(); setShowResetConfirm(false); }}
        onCancel={() => setShowResetConfirm(false)}
      >
        <button
          onClick={() => { handleExport(); }}
          className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 text-sm font-medium transition-colors"
        >
          📥 Export data first
        </button>
      </ConfirmDialog>
    </div>
  );
}
