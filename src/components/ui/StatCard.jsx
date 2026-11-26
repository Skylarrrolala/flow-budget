const TONES = {
  positive: 'text-success-600 dark:text-success-500',
  negative: 'text-danger-500',
  neutral: 'text-surface-900 dark:text-surface-50',
};

export default function StatCard({ label, value, detail, tone = 'neutral' }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${TONES[tone]}`}>
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{detail}</p>
      )}
    </div>
  );
}
