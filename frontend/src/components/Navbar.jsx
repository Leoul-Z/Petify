import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#FDF5ED',
    alignItems: 'center',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgb(171,165,165)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    boxSizing: 'border-box',
  },
  logo: {
    color: '#8D4F33',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '24px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    fontWeight: 'bold',
    color: '#482E1D',
    textDecoration: 'none',
  },
  navLink: {
    fontWeight: 'bold',
    color: '#482E1D',
    textDecoration: 'none',
  },
  authLinks: {
    display: 'flex',
    gap: '10px',
    fontWeight: 'bold',
  },
  authLink: {
    fontWeight: 'bold',
    color: '#482E1D',
    textDecoration: 'none',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#482E1D',
    fontWeight: 'bold',
    fontFamily: 'inherit',
  },
  userSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontWeight: 'bold',
  },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // While loading (user === undefined), show a minimal placeholder
  if (user === undefined) {
    return (
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>PETIFY</Link>
      </header>
    )
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>PETIFY</Link>

      <nav style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/shop" style={styles.navLink}>Shop</Link>
        <Link to="/about" style={styles.navLink}>About</Link>
        <Link to="/faq" style={styles.navLink}>FAQ</Link>
      </nav>

      {user === null ? (
        <nav style={styles.authLinks}>
          <Link to="/login" style={styles.authLink}>Login</Link>
          <Link to="/register" style={styles.authLink}>Register</Link>
        </nav>
      ) : (
        <div style={styles.userSection}>
          <span>{user.full_name}</span>
          {user.role === 'seller' && (
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          )}
          {user.role === 'buyer' && (
            <Link to="/orders" style={styles.navLink}>My Orders</Link>
          )}
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
