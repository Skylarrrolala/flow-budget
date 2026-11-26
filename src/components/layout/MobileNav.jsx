import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: '📊' },
  { to: '/transactions', label: 'Txns', icon: '💳' },
  { to: '/budgets', label: 'Budget', icon: '📋' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[3rem] min-h-[2.75rem] text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 dark:text-surface-400'
              }`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
