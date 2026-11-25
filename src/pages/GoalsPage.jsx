import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatMoney, parseToMinor, minorToInput } from '../lib/money';
import { formatDate } from '../lib/dates';
import { getGoalProgress, isGoalPastDue } from '../lib/selectors';
import { validateGoal, validateContribution } from '../lib/validation';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';

export default function GoalsPage() {
  const {
    goals, settings,
    addGoal, updateGoal, deleteGoal,
    addContribution, removeContribution,
  } = useFinance();
  const currency = settings.currency;

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [contributionAmounts, setContributionAmounts] = useState({});
  const [errors, setErrors] = useState({});
  const [contribErrors, setContribErrors] = useState({});

  function openCreate() {
    setName('');
    setTargetAmount('');
    setTargetDate('');
    setErrors({});
    setEditingGoal(null);
    setShowGoalForm(true);
  }

  function openEdit(goal) {
    setName(goal.name);
    setTargetAmount(minorToInput(goal.targetAmountMinor, currency));
    setTargetDate(goal.targetDate || '');
    setErrors({});
    setEditingGoal(goal);
    setShowGoalForm(true);
  }

  function handleGoalSubmit(e) {
    e.preventDefault();
    const targetAmountMinor = parseToMinor(targetAmount, currency);
    const goalData = {
      id: editingGoal?.id,
      name: name.trim(),
      targetAmountMinor,
      targetDate: targetDate || null,
    };

    const errs = validateGoal(goalData, goals);
    if (isNaN(targetAmountMinor)) {
      errs.targetAmount = 'Enter a positive target amount.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    setShowGoalForm(false);
  }

  function handleAddContribution(goalId) {
    const raw = contributionAmounts[goalId] || '';
    const amountMinor = parseToMinor(raw, currency);
    const error = validateContribution(amountMinor);
    if (error) {
      setContribErrors((prev) => ({ ...prev, [goalId]: error }));
      return;
    }
    setContribErrors((prev) => ({ ...prev, [goalId]: null }));
    setContributionAmounts((prev) => ({ ...prev, [goalId]: '' }));
    addContribution(goalId, amountMinor);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Savings Goals</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Create Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No savings goals yet"
          description="Start saving towards something meaningful."
          action={
            <button
              onClick={openCreate}
              className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create your first goal
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const pastDue = isGoalPastDue(goal);
            const isExpanded = expandedGoal === goal.id;

            return (
              <Card key={goal.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-surface-50">
                      {goal.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {goal.targetDate && (
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          Target: {formatDate(goal.targetDate)}
                        </span>
                      )}
                      {pastDue && (
                        <span className="text-xs bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500 px-2 py-0.5 rounded-full font-medium">
                          Past target date
                        </span>
                      )}
                      {progress.isComplete && (
                        <span className="text-xs bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-500 px-2 py-0.5 rounded-full font-medium">
                          Goal reached!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(goal)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(goal)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-danger-300 dark:border-danger-500/50 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600 dark:text-surface-400">
                      {formatMoney(progress.saved, currency)} of {formatMoney(progress.target, currency)}
                    </span>
                    <span className="font-medium text-surface-700 dark:text-surface-300">
                      {progress.percent}%
                    </span>
                  </div>
                  <ProgressBar
                    percent={progress.percent}
                    variant={progress.isComplete ? 'success' : pastDue ? 'warning' : 'default'}
                  />
                  {progress.isOverfunded && (
                    <p className="text-xs text-success-600 dark:text-success-500 mt-1">
                      Overfunded by {formatMoney(progress.saved - progress.target, currency)}
                    </p>
                  )}
                  {!progress.isComplete && progress.remaining > 0 && (
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                      {formatMoney(progress.remaining, currency)} remaining
                    </p>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    step={currency === 'KHR' ? '1' : '0.01'}
                    min="0.01"
                    placeholder={currency === 'KHR' ? 'Amount (៛)' : 'Amount ($)'}
                    value={contributionAmounts[goal.id] || ''}
                    onChange={(e) =>
                      setContributionAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm"
                  />
                  <button
                    onClick={() => handleAddContribution(goal.id)}
                    className="px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {contribErrors[goal.id] && (
                  <p className="text-xs text-danger-500 mt-1">{contribErrors[goal.id]}</p>
                )}

                {goal.contributions && goal.contributions.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                      className="text-xs text-primary-500 dark:text-primary-400 hover:underline font-medium"
                    >
                      {isExpanded ? 'Hide' : 'Show'} contributions ({goal.contributions.length})
                    </button>
                    {isExpanded && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-surface-400 dark:text-surface-500 italic mb-2">
                          Contributions are tracked separately from transactions.
                        </p>
                        {goal.contributions.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface-50 dark:bg-surface-800 text-sm"
                          >
                            <span className="text-surface-600 dark:text-surface-400">
                              {formatDate(c.date)}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-success-600 dark:text-success-500">
                                +{formatMoney(c.amountMinor, currency)}
                              </span>
                              <button
                                onClick={() => setRemoveTarget({ goalId: goal.id, contribution: c })}
                                className="text-xs text-danger-500 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        title={editingGoal ? 'Edit Goal' : 'Create Goal'}
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency Fund"
              maxLength={60}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="text-xs text-danger-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Target Amount ({currency === 'KHR' ? '៛' : '$'})
            </label>
            <input
              type="number"
              step={currency === 'KHR' ? '1' : '0.01'}
              min="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder={currency === 'KHR' ? '500000' : '1000.00'}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm"
              aria-required="true"
              aria-invalid={!!errors.targetAmount}
              aria-describedby={errors.targetAmount ? 'amount-error' : undefined}
            />
            {errors.targetAmount && <p id="amount-error" className="text-xs text-danger-500 mt-1">{errors.targetAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Target Date (optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowGoalForm(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Goal"
        message={`Delete "${deleteTarget?.name}" and all its contributions? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove Contribution"
        message={`Remove this ${removeTarget ? formatMoney(removeTarget.contribution.amountMinor, currency) : ''} contribution?`}
        confirmLabel="Remove"
        onConfirm={() => {
          removeContribution(removeTarget.goalId, removeTarget.contribution.id);
          setRemoveTarget(null);
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
