import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  overlay: {
    minHeight: 'calc(100vh - 65px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF5ED',
    fontFamily: 'system-ui, sans-serif',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  box: {
    background: '#fff',
    borderRadius: '25px',
    padding: '30px 50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    minWidth: '320px',
  },
  title: {
    margin: 0,
    color: '#482E1D',
    fontSize: '28px',
  },
  input: {
    padding: '12px 16px',
    background: '#FDF5ED',
    border: '1px solid #e0d5cc',
    borderRadius: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    background: '#8D4F33',
    color: '#FDF5ED',
    borderRadius: '10px',
    border: 'none',
    padding: '12px',
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    margin: 0,
  },
  link: {
    color: '#b18910',
    fontSize: '13px',
    textDecoration: 'none',
  },
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login({ email, password })
    setLoading(false)

    if (res.error) {
      setError('Invalid email or password')
      return
    }

    if (res.id) {
      if (res.role === 'seller') {
        navigate('/dashboard')
      } else {
        navigate('/shop')
      }
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h1 style={styles.title}>Petify</h1>
        <p style={{ margin: 0, color: '#482E1D', fontSize: '14px' }}>Sign in to your account</p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '280px' }}
        >
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <span style={{ fontSize: '13px', color: '#482E1D' }}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </span>
      </div>
    </div>
  )
}
