import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTransactions } from '../hooks/useTransactions.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useDebounce } from '../hooks/useDebounce.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import TransactionCard from '../components/TransactionCard.jsx';

function Transactions() {
  const navigate = useNavigate();
  const { deleteTransaction } = useFinance();
  const [filters, setFilters] = useState({ search: '', category: 'All', type: 'All', from: '', to: '', sortBy: 'date' });
  const debouncedSearch = useDebounce(filters.search, 250);
  const transactions = useTransactions({
    search: debouncedSearch,
    category: filters.category,
    type: filters.type,
    from: filters.from,
    to: filters.to,
    sortBy: filters.sortBy
  });

  const handleEdit = (transaction) => {
    navigate('/transactions/new', { state: { transaction } });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  return (
    <div>
      <h2 className="page-title">Transactions</h2>
      <div className="flex-gap" style={{ marginBottom: '1rem' }}>
        <SearchBar value={filters.search} onChange={(search) => setFilters((current) => ({ ...current, search }))} />
        <button className="primary" onClick={() => navigate('/transactions/new')}>
          Add transaction
        </button>
      </div>
      <Filters filters={filters} onChange={setFilters} />

      <div className="table-wrapper card" style={{ marginTop: '1.5rem' }}>
        {transactions.length === 0 ? (
          <p className="small-text">No transactions match the current filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th>Recurring</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
