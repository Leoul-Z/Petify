import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = not logged in

  useEffect(() => {
    getMe().then(setUser)
  }, [])

  async function login(data) {
    const res = await apiLogin(data)
    if (res.id) setUser(res)
    return res
  }

  async function logout() {
    await apiLogout()
    setUser(null)
  }

  async function register(data) {
    return apiRegister(data)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
