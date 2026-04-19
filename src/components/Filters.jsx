import { categories } from '../data/categories.js';

function Filters({ filters, onChange }) {
  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="flex-gap" style={{ alignItems: 'flex-end' }}>
        <div className="input-group" style={{ flex: '1 1 180px' }}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
          >
            <option value="All">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ flex: '1 1 180px' }}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
          >
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="input-group" style={{ flex: '1 1 160px' }}>
          <label htmlFor="from">From</label>
          <input
            id="from"
            type="date"
            value={filters.from}
            onChange={(event) => onChange({ ...filters, from: event.target.value })}
          />
        </div>

        <div className="input-group" style={{ flex: '1 1 160px' }}>
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="date"
            value={filters.to}
            onChange={(event) => onChange({ ...filters, to: event.target.value })}
          />
        </div>

        <div className="input-group" style={{ flex: '1 1 180px' }}>
          <label htmlFor="sortBy">Sort by</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(event) => onChange({ ...filters, sortBy: event.target.value })}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;
