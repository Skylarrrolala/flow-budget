export function getGoalProgress(goal) {
  const saved = (goal.contributions || []).reduce((sum, c) => sum + c.amountMinor, 0);
  const target = goal.targetAmountMinor;
  const percent = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;
  const isComplete = saved >= target;
  const isOverfunded = saved > target;
  const remaining = Math.max(target - saved, 0);

  return { saved, target, percent, isComplete, isOverfunded, remaining };
}

export function isGoalPastDue(goal) {
  if (!goal.targetDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  const { isComplete } = getGoalProgress(goal);
  return !isComplete && goal.targetDate < today;
}

export function getTotalSavings(goals) {
  return goals.reduce((total, goal) => {
    const { saved } = getGoalProgress(goal);
    return total + saved;
  }, 0);
}
