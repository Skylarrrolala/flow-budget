import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { to: '/transactions', label: 'Transactions', icon: 'transactions' },
  { to: '/budgets', label: 'Budgets', icon: 'budgets' },
  { to: '/goals', label: 'Savings goals', icon: 'goals' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-dvh w-60 shrink-0 flex-col border-r border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 lg:flex">
      <div className="flex h-[76px] items-center gap-3 border-b border-surface-200 px-6 dark:border-surface-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-surface-950">
          <Icon name="wallet" size={18} />
        </span>
        <span className="text-base font-semibold tracking-tight text-surface-900 dark:text-surface-50">FlowBudget</span>
      </div>
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3 py-6">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-surface-900 dark:bg-surface-800 dark:text-primary-300'
                  : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
              }`
            }
          >
            <Icon name={icon} size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-surface-200 px-5 py-4 text-xs text-surface-500 dark:border-surface-700 dark:text-surface-400">
        Your money, in flow.
      </div>
    </aside>
  );
}
