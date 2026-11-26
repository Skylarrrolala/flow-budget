export default function Toast({ message, type = 'success', onDismiss }) {
  const bg =
    type === 'delete' || type === 'error'
      ? 'bg-danger-500'
      : type === 'warning'
        ? 'bg-warning-500'
        : 'bg-success-500';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg px-5 py-3 text-sm font-medium text-surface-950 shadow-lg animate-[slideUp_0.3s_ease-out] lg:bottom-6 ${bg}`}
    >
      {message}
      <button
        onClick={onDismiss}
        className="ml-2 min-h-6 min-w-6 text-lg leading-none opacity-70 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
