export function validateGoal(goal, existingGoals = []) {
  const errors = {};

  if (!goal.name || !goal.name.trim()) {
    errors.name = 'Goal name is required.';
  } else {
    const duplicate = existingGoals.find(
      (g) => g.id !== goal.id && g.name.trim().toLowerCase() === goal.name.trim().toLowerCase()
    );
    if (duplicate) {
      errors.name = 'A goal with this name already exists.';
    }
  }

  if (!goal.targetAmountMinor || goal.targetAmountMinor <= 0) {
    errors.targetAmount = 'Enter a positive target amount.';
  }

  return errors;
}

export function validateContribution(amount) {
  if (!amount || amount <= 0) {
    return 'Enter a positive amount.';
  }
  return null;
}
