import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crecio_admin_user')) }
    catch { return null }
  })

  const login = (data) => {
    localStorage.setItem('crecio_admin_user', JSON.stringify(data.cliente))
    setUser(data.cliente)
  }

  const logout = () => {
    localStorage.removeItem('crecio_admin_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
