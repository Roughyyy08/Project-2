function SearchBar({ value, onChange }) {
  return (
    <div className="input-group" style={{ flex: '1 1 280px' }}>
      <label htmlFor="search">Search transactions</label>
      <input
        id="search"
        type="search"
        value={value}
        placeholder="Search title or notes"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
