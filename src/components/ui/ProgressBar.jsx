export default function ProgressBar({ percent = 0, variant = 'default', size = 'md' }) {
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  const barColor =
    variant === 'danger'
      ? 'bg-danger-500'
      : variant === 'warning'
        ? 'bg-warning-500'
        : variant === 'success'
          ? 'bg-success-500'
          : percent >= 100
            ? 'bg-success-500'
            : 'bg-primary-500';

  return (
    <div className={`w-full ${height} bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${barColor} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(percent, 100)}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
