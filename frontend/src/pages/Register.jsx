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
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  title: {
    margin: 0,
    color: '#482E1D',
    fontSize: '28px',
  },
  subtitle: {
    margin: 0,
    color: '#482E1D',
    fontSize: '13px',
    textAlign: 'center',
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
  select: {
    padding: '12px 16px',
    background: '#FDF5ED',
    border: '1px solid #e0d5cc',
    borderRadius: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    color: '#482E1D',
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
  fieldError: {
    color: 'red',
    fontSize: '12px',
    margin: 0,
    alignSelf: 'flex-start',
    marginLeft: '0%',
  },
  link: {
    color: '#b18910',
    fontSize: '13px',
    textDecoration: 'none',
  },
}

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    const res = await register({ full_name: fullName, email, password, role })
    setLoading(false)

    if (res.errors) {
      setFieldErrors(res.errors)
      return
    }

    if (res.id) {
      // Auto-login after successful registration
      const loginRes = await login({ email, password })
      if (loginRes.role === 'seller') {
        navigate('/dashboard')
      } else {
        navigate('/shop')
      }
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Join Petify</h1>
          <p style={styles.subtitle}>Start your journey as a pet owner or verified breeder</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '280px' }}
        >
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {fieldErrors.full_name && <p style={styles.fieldError}>{fieldErrors.full_name}</p>}

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && <p style={styles.fieldError}>{fieldErrors.email}</p>}

          <input
            style={styles.input}
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {fieldErrors.password && <p style={styles.fieldError}>{fieldErrors.password}</p>}

          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          {fieldErrors.role && <p style={styles.fieldError}>{fieldErrors.role}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <span style={{ fontSize: '13px', color: '#482E1D' }}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </span>
      </div>
    </div>
  )
}
