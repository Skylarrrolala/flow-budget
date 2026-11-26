import { useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function Navbar() {
  const { pathname } = useLocation();

  const title = pathname === '/dashboard'
    ? 'Overview'
    : pathname === '/transactions'
      ? 'Transactions'
      : pathname === '/budgets'
        ? 'Budgets'
        : pathname === '/goals'
          ? 'Savings goals'
          : pathname === '/settings'
            ? 'Settings'
            : 'FlowBudget';

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/95 backdrop-blur dark:border-surface-700 dark:bg-surface-900/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-surface-950">
            <Icon name="wallet" size={18} />
          </span>
          <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">FlowBudget</span>
        </div>
        <p className="hidden text-sm font-medium text-surface-500 dark:text-surface-400 lg:block">
          Personal finance <span className="mx-2 text-surface-300 dark:text-surface-700">/</span>
          <span className="text-surface-900 dark:text-surface-100">{title}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-surface-500 dark:text-surface-400 sm:inline">Personal account</span>
          <span
            aria-label="Personal account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-xs font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-200"
          >
            PA
          </span>
        </div>
      </div>
    </header>
  );
}
