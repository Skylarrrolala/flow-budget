export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-50 sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
