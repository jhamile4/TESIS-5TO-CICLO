import { createContext, useContext, useEffect, useState } from 'react'
import { API_URL } from '../config/env'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('crecio_admin_token') || localStorage.getItem('token')
    const headers =
      token && token !== 'null' && token !== 'undefined'
        ? { Authorization: `Bearer ${token}` }
        : {}

    fetch(`${API_URL}/auth/session`, {
      credentials: 'include',
      headers,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.cliente) {
          const sessionUser = { ...data.cliente }
          localStorage.setItem('crecio_admin_user', JSON.stringify(sessionUser))
          if (token) {
            localStorage.setItem('crecio_admin_token', token)
          }
          setUser(sessionUser)
        } else {
          localStorage.removeItem('crecio_admin_user')
          localStorage.removeItem('crecio_admin_token')
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem('crecio_admin_token', data.token)
      localStorage.setItem('token', data.token)
    }
    if (data?.cliente) {
      localStorage.setItem('crecio_admin_user', JSON.stringify(data.cliente))
      setUser(data.cliente)
    }
  }

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    localStorage.removeItem('crecio_admin_user')
    localStorage.removeItem('crecio_admin_token')
    localStorage.removeItem('token')
    localStorage.removeItem('cliente')
    localStorage.removeItem('token_comprador')
    localStorage.removeItem('comprador')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
