import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

export function useTransactions({ search = '', category = 'All', type = 'All', sortBy = 'date', from, to }) {
  const { transactions } = useFinance();

  return useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return transactions
      .filter((tx) => {
        const matchesSearch = [tx.title, tx.notes].some((value) => value.toLowerCase().includes(lowerSearch));
        const matchesCategory = category === 'All' || tx.category === category;
        const matchesType = type === 'All' || tx.type === type;
        const matchesFrom = from ? tx.date >= from : true;
        const matchesTo = to ? tx.date <= to : true;
        return matchesSearch && matchesCategory && matchesType && matchesFrom && matchesTo;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') return b.amount - a.amount;
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return new Date(b.date) - new Date(a.date);
      });
  }, [transactions, search, category, type, sortBy, from, to]);
}
