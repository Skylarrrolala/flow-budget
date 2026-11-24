// Will define navigation routes for the five planned pages and a fallback.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import TransactionsPage from '../pages/TransactionsPage';
import BudgetsPage from '../pages/BudgetsPage';
import DashboardPage from '../pages/DashboardPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </BrowserRouter>
  );
}