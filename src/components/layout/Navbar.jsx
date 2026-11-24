import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav>
      <strong>FlowBudget</strong>
      <div>
        <Link to="/dashboard" style={{ fontWeight: isActive('/dashboard') ? 'bold' : 'normal' }}>
          Dashboard
        </Link>
        {' | '}
        <Link to="/transactions" style={{ fontWeight: isActive('/transactions') ? 'bold' : 'normal' }}>
          Transactions
        </Link>
        {' | '}
        <Link to="/budgets" style={{ fontWeight: isActive('/budgets') ? 'bold' : 'normal' }}>
          Budgets
        </Link>
      </div>
    </nav>
  );
}