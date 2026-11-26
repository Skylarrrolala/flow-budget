import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import BudgetsPage from '../pages/BudgetsPage';
import GoalsPage from '../pages/GoalsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import { useFinance } from '../context/FinanceContext';

export default function AppRoutes() {
  const { settings } = useFinance();
  const currency = settings.currency;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage currency={currency} />} />
      <Route path="/transactions" element={<TransactionsPage currency={currency} />} />
      <Route path="/budgets" element={<BudgetsPage currency={currency} />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
