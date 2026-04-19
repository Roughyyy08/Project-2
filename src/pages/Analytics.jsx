import { useEffect, useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { fetchExchangeRates } from '../services/api.js';
import { formatCurrency } from '../utils/currencyFormatter.js';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const palette = ['#60a5fa', '#f97316', '#34d399', '#f472b6', '#a78bfa', '#facc15', '#38bdf8', '#fb7185'];

function Analytics() {
  const { transactions, analytics } = useFinance();
  const [rates, setRates] = useState(null);

  useEffect(() => {
    fetchExchangeRates('INR')
      .then((data) => setRates(data.rates?.USD ? data.rates : null)
      )
      .catch(() => setRates(null));
  }, []);

  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const convertedBalance = rates ? analytics.netBalance * rates.USD : null;

  return (
    <div>
      <h2 className="page-title">Analytics</h2>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="small-text">Financial insights and chart-based analytics</p>
        <p>
          Total income: <strong>{formatCurrency(analytics.totalIncome)}</strong>, total expenses: <strong>{formatCurrency(analytics.totalExpenses)}</strong>, net balance: <strong>{formatCurrency(analytics.netBalance)}</strong>.
        </p>
        {rates && (
          <p className="small-text">Approx. USD value: {formatCurrency(convertedBalance, 'USD')}</p>
        )}
      </div>
      <div className="flex-gap" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ flex: '1 1 45%', minHeight: '320px' }}>
          <h3>Spending by category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="small-text">No expense data yet. Add transactions to power this chart.</p>
          )}
        </div>
        <div className="card" style={{ flex: '1 1 45%', minHeight: '320px' }}>
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'This month', Income: analytics.totalIncome, Expense: analytics.totalExpenses }]}> 
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="Income" fill="#34d399" />
              <Bar dataKey="Expense" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Recurring expenses</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter((tx) => tx.recurring).map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.title}</td>
                  <td>{tx.category}</td>
                  <td>{formatCurrency(tx.amount)}</td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.filter((tx) => tx.recurring).length === 0 && <p className="small-text">No recurring expenses yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
