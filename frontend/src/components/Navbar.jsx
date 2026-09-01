import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css' // Premium styles

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // While loading (user === undefined), show a minimal placeholder
  if (user === undefined) {
    return (
      <header className="navbar-header">
        <Link to="/" className="navbar-logo">🐾 PETIFY</Link>
      </header>
    )
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar-header">
      <Link to="/" className="navbar-logo">🐾 PETIFY</Link>

      <nav className="navbar-nav">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/shop" className="navbar-link">Shop</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/faq" className="navbar-link">FAQ</Link>
      </nav>

      {user === null ? (
        <nav className="navbar-auth">
          <Link to="/login" className="navbar-login-btn">Login</Link>
          <Link to="/register" className="navbar-register-btn">Register</Link>
        </nav>
      ) : (
        <div className="navbar-user-section">
          <span className="navbar-greeting">{user.full_name}</span>
          {user.role === 'seller' && (
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          )}
          {user.role === 'buyer' && (
            <Link to="/orders" className="navbar-link">My Orders</Link>
          )}
          <button className="navbar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
