import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/budgets', label: 'Budgets', icon: '📋' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Navbar() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">FlowBudget</h1>
      </div>
    </header>
  );
}
