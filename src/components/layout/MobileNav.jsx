import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { to: '/transactions', label: 'Activity', icon: 'transactions' },
  { to: '/budgets', label: 'Budget', icon: 'budgets' },
  { to: '/goals', label: 'Goals', icon: 'goals' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export default function MobileNav() {
  return (
    <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-surface-700 dark:bg-surface-900/95 lg:hidden">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-surface-900 dark:text-primary-300'
                  : 'text-surface-500 dark:text-surface-400'
              }`
            }
          >
            <Icon name={icon} size={19} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
