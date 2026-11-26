export default function SegmentedControl({ value, options, onChange, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-surface-200 bg-surface-50 p-1 dark:border-surface-700 dark:bg-surface-950"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`min-h-9 rounded-md px-3 text-sm font-medium transition-colors ${
            value === option.value
              ? 'bg-surface-200 text-surface-900 dark:bg-surface-800 dark:text-surface-50'
              : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
