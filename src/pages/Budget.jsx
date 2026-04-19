import { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function Budget() {
  const { budget, setBudget, budgetValues, transactions } = useFinance();
  const [pending, setPending] = useState(false);

  const { register, handleSubmit } = useForm({ defaultValues: { monthlyBudget: budget.monthlyBudget } });

  const onSubmit = (values) => {
    setPending(true);
    setBudget({ monthlyBudget: Number(values.monthlyBudget) });
    toast.success('Budget updated');
    setPending(false);
  };

  return (
    <div>
      <h2 className="page-title">Budget</h2>
      <div className="flex-gap" style={{ marginBottom: '1.5rem' }}>
        <BudgetCard title="Monthly Budget" amount={budget.monthlyBudget} label="Planned spending cap" detail="Set a monthly limit for better control." />
        <BudgetCard title="Spent so far" amount={budgetValues.monthlySpending} label="Total expense" detail="Expenses are tracked from all categories." />
        <BudgetCard title="Remaining" amount={budgetValues.remainingBudget} label="Budget left" detail={`${budgetValues.usedPercent}% used`} />
      </div>
      <div className="card" style={{ maxWidth: '720px' }}>
        <h3 style={{ marginTop: 0 }}>Update monthly budget</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-gap" style={{ alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: '1 1 320px' }}>
            <label htmlFor="monthlyBudget">Monthly Budget</label>
            <input id="monthlyBudget" type="number" {...register('monthlyBudget', { valueAsNumber: true })} />
          </div>
          <button type="submit" className="primary" disabled={pending}>
            Save budget
          </button>
        </form>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Summary</h3>
        <p className="small-text">You have {transactions.filter((tx) => tx.type === 'expense').length} expenses and {transactions.filter((tx) => tx.type === 'income').length} income entries recorded.</p>
      </div>
    </div>
  );
}

export default Budget;
