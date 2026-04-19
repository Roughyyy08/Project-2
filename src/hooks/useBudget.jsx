import { useMemo } from 'react';

export function useBudget(transactions, budget) {
  return useMemo(() => {
    const spent = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    const remaining = Math.max(budget.monthlyBudget - spent, 0);
    const usedPercent = budget.monthlyBudget > 0 ? Math.min((spent / budget.monthlyBudget) * 100, 100) : 0;
    return {
      monthlySpending: spent,
      remainingBudget: remaining,
      usedPercent: Number(usedPercent.toFixed(1))
    };
  }, [transactions, budget.monthlyBudget]);
}
