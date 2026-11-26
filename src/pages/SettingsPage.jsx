import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import PageHeader from '../components/ui/PageHeader';
import SegmentedControl from '../components/ui/SegmentedControl';

export default function SettingsPage() {
  const {
    settings, transactions, budgets, goals, toggleTheme, setCurrency, handleExport, factoryReset,
    loadDemoData,
  } = useFinance();

  const [showCurrencyConfirm, setShowCurrencyConfirm] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDemoDataConfirm, setShowDemoDataConfirm] = useState(false);

  function handleCurrencyChange(newCurrency) {
    if (newCurrency === settings.currency) return;

    const hasRecords = transactions.length > 0 || budgets.length > 0 || goals.length > 0;

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

  function handleDemoDataLoad() {
    const hasRecords = transactions.length > 0 || budgets.length > 0 || goals.length > 0;
    if (hasRecords) {
      setShowDemoDataConfirm(true);
      return;
    }
    loadDemoData();
  }

  function confirmDemoDataLoad() {
    loadDemoData();
    setShowDemoDataConfirm(false);
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your preferences and personal finance data."
      />

      <div className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Appearance</h2>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Theme</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Currently using {settings.theme} mode
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={toggleTheme}
            >
              <Icon name={settings.theme === 'dark' ? 'sun' : 'moon'} size={17} />
              {settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Currency</h2>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Display Currency</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                All amounts shown in {settings.currency === 'USD' ? 'US Dollars ($)' : 'Khmer Riel (៛)'}
              </p>
            </div>
            <SegmentedControl
              label="Display currency"
              value={settings.currency}
              onChange={handleCurrencyChange}
              options={[
                { value: 'USD', label: '$ USD' },
                { value: 'KHR', label: '៛ KHR' },
              ]}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Data</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Export Data</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Download all your data as JSON
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleExport}
              >
                <Icon name="download" size={17} />
                Export JSON
              </Button>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Load Demo Data</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Replace your data with 203 USD demo transactions, 3 budgets, and 3 goals.
                </p>
              </div>
              <Button variant="secondary" onClick={handleDemoDataLoad}>
                Load demo data
              </Button>
            </div>

            <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-danger-500">Factory Reset</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Delete all transactions, budgets, goals, and settings
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset All Data
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="!bg-surface-100 dark:!bg-surface-900/50 !border-dashed">
          <p className="text-xs leading-relaxed text-surface-500 dark:text-surface-400">
            All data is stored locally in your browser using localStorage. Your data stays on this device and is not sent to any server. Clearing browser data will remove all FlowBudget records.
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
        <Button
          variant="secondary"
          onClick={() => { handleExport(); }}
          className="w-full"
        >
          <Icon name="download" size={17} />
          Export data first
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={showResetConfirm}
        title="Factory Reset"
        message="This will permanently delete all your data. This action cannot be undone."
        confirmLabel="Delete Everything"
        onConfirm={() => { factoryReset(); setShowResetConfirm(false); }}
        onCancel={() => setShowResetConfirm(false)}
      >
        <Button
          variant="secondary"
          onClick={() => { handleExport(); }}
          className="w-full"
        >
          <Icon name="download" size={17} />
          Export data first
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={showDemoDataConfirm}
        title="Replace with Demo Data?"
        message="This replaces all transactions, budgets, and goals with 203 USD demo transactions, 3 budgets, and 3 goals. Your current theme will be preserved and your currency will switch to USD."
        confirmLabel="Replace with Demo Data"
        onConfirm={confirmDemoDataLoad}
        onCancel={() => setShowDemoDataConfirm(false)}
      />
    </div>
  );
}
