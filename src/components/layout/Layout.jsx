import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Toast from '../ui/Toast';
import { useFinance } from '../../context/FinanceContext';

export default function Layout({ children }) {
  const { toast, dismissToast } = useFinance();

  return (
    <div className="flex min-h-dvh bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 pb-24 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}
