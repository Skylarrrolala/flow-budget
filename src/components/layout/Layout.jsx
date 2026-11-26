import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Toast from '../ui/Toast';
import { useFinance } from '../../context/FinanceContext';

export default function Layout({ children }) {
  const { toast, dismissToast } = useFinance();

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
      <MobileNav />
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}
