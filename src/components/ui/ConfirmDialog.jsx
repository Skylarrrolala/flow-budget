import { useEffect, useRef } from 'react';
import Button from './Button';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel, children }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    cancelRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="confirm-title" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            {title}
          </h2>
          <p id="confirm-desc" className="text-sm text-surface-600 dark:text-surface-400 mb-4">
            {message}
          </p>
          {children}
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              size="md"
              ref={cancelRef}
              onClick={onCancel}
              className="flex-1"
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
