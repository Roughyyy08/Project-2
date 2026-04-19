import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBudget } from '../hooks/useBudget.jsx';

const FinanceContext = createContext(null);

const defaultTransactions = [
  {
    id: uuidv4(),
    title: 'Campus rent',
    amount: 14500,
    category: 'Rent',
    type: 'expense',
    date: '2026-04-01',
    notes: 'April apartment rent',
    recurring: true
  },
  {
    id: uuidv4(),
    title: 'Freelance project',
    amount: 26000,
    category: 'Income',
    type: 'income',
    date: '2026-04-05',
    notes: 'Web design milestone',
    recurring: false
  },
  {
    id: uuidv4(),
    title: 'Dinner with friends',
    amount: 1900,
    category: 'Food',
    type: 'expense',
    date: '2026-04-07',
    notes: 'Dinner and coffee',
    recurring: false
  }
];

export function FinanceProvider({ children }) {
  const normalizeTransaction = (transaction) => ({
    ...transaction,
    id: transaction.id || uuidv4(),
    title: transaction.title || 'Untitled transaction',
    amount: Number(transaction.amount) || 0,
    category: transaction.category || 'Other',
    type: transaction.type === 'income' ? 'income' : 'expense',
    date:
      typeof transaction.date === 'string'
        ? transaction.date
        : transaction.date instanceof Date
        ? transaction.date.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    notes: transaction.notes || '',
    recurring: Boolean(transaction.recurring)
  });

  const [transactions, setTransactions] = useState(() => {
    const stored = window.localStorage.getItem('financeTransactions');
    if (!stored) return defaultTransactions;
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return defaultTransactions;
      return parsed.map(normalizeTransaction);
    } catch {
      return defaultTransactions;
    }
  });

  const [budget, setBudget] = useState(() => {
    const stored = window.localStorage.getItem('financeBudget');
    return stored ? JSON.parse(stored) : { monthlyBudget: 50000 };
  });

  useEffect(() => {
    window.localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    window.localStorage.setItem('financeBudget', JSON.stringify(budget));
  }, [budget]);

  const analytics = useMemo(() => {
    const income = transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    const balance = income - expense;
    const categoryMap = {};
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    const monthlyTotals = transactions.reduce((totals, tx) => {
      const month = tx.date.slice(0, 7);
      totals[month] = (totals[month] || 0) + (tx.type === 'expense' ? tx.amount : 0);
      return totals;
    }, {});

    return {
      totalIncome: income,
      totalExpenses: expense,
      netBalance: balance,
      topCategory,
      spendingByMonth: Object.entries(monthlyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({ month, amount }))
    };
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions((current) => [normalizeTransaction({ ...transaction, id: uuidv4() }), ...current]);
  };

  const updateTransaction = (id, updates) => {
    setTransactions((current) =>
      current.map((tx) => (tx.id === id ? normalizeTransaction({ ...tx, ...updates }) : tx))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) => current.filter((tx) => tx.id !== id));
  };

  const budgetValues = useBudget(transactions, budget);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budget,
        setBudget,
        analytics,
        budgetValues
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
