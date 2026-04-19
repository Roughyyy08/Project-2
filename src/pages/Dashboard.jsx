import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import { formatCurrency } from '../utils/currencyFormatter.js';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { analytics, budgetValues, budget } = useFinance();

  const categoryData = useMemo(() => {
    return analytics.spendingByMonth.map((item) => ({ ...item, month: item.month.replace('-', ' / ') }));
  }, [analytics.spendingByMonth]);

  return (
    <div className="container">
      <h2 className="page-title">Dashboard</h2>

      <div className="flex-gap" style={{ marginBottom: '1.5rem' }}>
        <BudgetCard title="Total Income" amount={analytics.totalIncome} label="Money earned this month" detail="Track your inflows and compare with expenses." />
        <BudgetCard title="Total Expenses" amount={analytics.totalExpenses} label="Money spent this month" detail="Understand where your cash is going." />
        <BudgetCard title="Net Balance" amount={analytics.netBalance} label="Income minus expense" detail={`Top spending category: ${analytics.topCategory}`} />
        <BudgetCard title="Budget" amount={budget.monthlyBudget} label="Monthly budget target" detail={`${budgetValues.usedPercent}% used, ${formatCurrency(budgetValues.remainingBudget)} left`} />
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '1rem' }}>Monthly spending trend</h3>
        {categoryData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={categoryData} margin={{ top: 10, right: 24, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="month" tick={{ fill: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#cbd5e1' }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="small-text">Add transactions to see spending trends.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
