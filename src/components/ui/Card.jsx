export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-5 ${className}`}>
      {children}
    </div>
  );
}
