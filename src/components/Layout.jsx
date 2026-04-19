import { NavLink } from 'react-router-dom';
import { FaChartPie, FaWallet, FaPlusCircle, FaCreditCard, FaChartLine, FaMoon, FaSun } from 'react-icons/fa';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaChartPie },
  { path: '/transactions', label: 'Transactions', icon: FaWallet },
  { path: '/transactions/new', label: 'New', icon: FaPlusCircle },
  { path: '/budget', label: 'Budget', icon: FaCreditCard },
  { path: '/analytics', label: 'Analytics', icon: FaChartLine }
];

function Layout({ children, theme, onToggleTheme }) {
  return (
    <div className="container">
      <header className="topbar card">
        <div className="topbar-brand">
          <div>
            <span className="brand-chip">Finance Pro</span>
            <p className="small-text uppercase">Personal Finance & Expense Analytics</p>
            <h1 className="page-title">Control cash flow with clarity</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
        <nav className="nav-group">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-pill nav-pill-active' : 'nav-pill')}>
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
