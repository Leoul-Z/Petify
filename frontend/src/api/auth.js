const BASE = '/api/auth'

export async function register(data) {
  const res = await fetch(`${BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function login(data) {
  const res = await fetch(`${BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function logout() {
  const res = await fetch(`${BASE}/logout.php`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${BASE}/me.php`, {
    credentials: 'include',
  })
  if (res.status === 401) return null
  return res.json()
}
