import Icon from './Icon';

export default function EmptyState({ icon = 'wallet', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-300">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
