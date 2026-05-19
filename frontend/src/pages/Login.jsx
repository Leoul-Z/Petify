import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(8px)',
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'monospace',
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
    padding: '10px',
    background: '#FDF5ED',
    border: 'none',
    borderRadius: '10px',
    width: '70%',
    fontFamily: 'monospace',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    background: '#8D4F33',
    color: '#FDF5ED',
    borderRadius: '7px',
    border: 'none',
    padding: '10px',
    width: '70%',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '14px',
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
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}
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
