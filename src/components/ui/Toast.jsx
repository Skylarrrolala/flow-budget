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
      className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 ${bg} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium animate-[slideUp_0.3s_ease-out]`}
    >
      {message}
      <button
        onClick={onDismiss}
        className="ml-2 opacity-70 hover:opacity-100 text-white text-lg leading-none"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
