import { createContext, useContext, useEffect, useState } from 'react'
import { API_URL } from '../config/env'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crecio_admin_user')) }
    catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/auth/session`, { credentials: 'include' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.cliente) {
          const current = JSON.parse(localStorage.getItem('crecio_admin_user') || '{}')
          const sessionUser = { ...current, ...data.cliente }
          localStorage.setItem('crecio_admin_user', JSON.stringify(sessionUser))
          setUser(sessionUser)
        } else {
          localStorage.removeItem('crecio_admin_user')
          setUser(null)
        }
      })
      .catch(() => { localStorage.removeItem('crecio_admin_user'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    localStorage.setItem('crecio_admin_user', JSON.stringify(data.cliente))
    setUser(data.cliente)
  }

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    localStorage.removeItem('crecio_admin_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
