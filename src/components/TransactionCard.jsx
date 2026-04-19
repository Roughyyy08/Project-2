import { formatCurrency } from '../utils/currencyFormatter.js';

function TransactionCard({ transaction, onEdit, onDelete }) {
  return (
    <tr>
      <td>{transaction.title}</td>
      <td>{transaction.category}</td>
      <td>{formatCurrency(transaction.amount)}</td>
      <td>{new Date(transaction.date).toLocaleDateString()}</td>
      <td>
        <span className={`badge ${transaction.type}`}>{transaction.type}</span>
      </td>
      <td>{transaction.recurring ? 'Yes' : 'No'}</td>
      <td style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="secondary" onClick={() => onEdit(transaction)}>
          Edit
        </button>
        <button className="secondary" onClick={() => onDelete(transaction.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TransactionCard;
