import { formatCurrency } from '../utils/currencyFormatter.js';

function BudgetCard({ title, amount, label, detail }) {
  return (
    <div className="card" style={{ flex: '1 1 220px' }}>
      <p className="small-text">{title}</p>
      <h2 style={{ margin: '0.65rem 0' }}>{formatCurrency(amount)}</h2>
      <p>{label}</p>
      <p className="small-text" style={{ marginTop: '0.75rem' }}>
        {detail}
      </p>
    </div>
  );
}

export default BudgetCard;
