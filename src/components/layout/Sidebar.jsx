import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/budgets', label: 'Budgets', icon: '📋' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">FlowBudget</h1>
      </div>
      <nav className="flex-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
