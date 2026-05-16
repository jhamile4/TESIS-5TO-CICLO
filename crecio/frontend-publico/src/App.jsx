import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Página pública (hecha por Jhamile — incluye su propio Navbar y Footer)
import LandingPage from './pages/LandingPage/index.jsx'

// Layout con Navbar para páginas que no son LandingPage
import PageLayout from './layouts/PageLayout'

// Guards de ruta
import ProtectedRoute from './components/Auth/ProtectedRoute'
import GuestRoute     from './components/Auth/GuestRoute'

// Páginas de autenticación
import LoginPage    from './pages/AuthPage/LoginPage'
import RegisterPage from './pages/AuthPage/RegisterPage'

// Página del perfil cliente
import ProfilePage from './pages/ClientePage/ProfilePage'

// Página pública de negocio (vista cliente)
import NegocioPage from './pages/NegocioPage/NegocioPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* "/" usa LandingPage completa (tiene Navbar y Footer propios de Jhamile) */}
        <Route path="/" element={<LandingPage />} />

        {/* Solo para invitados — con Navbar encima */}
        <Route path="/login" element={
          <GuestRoute>
            <PageLayout><LoginPage /></PageLayout>
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <PageLayout><RegisterPage /></PageLayout>
          </GuestRoute>
        } />

        {/* Protegida — con Navbar encima */}
        <Route path="/perfil" element={
          <ProtectedRoute>
            <PageLayout><ProfilePage /></PageLayout>
          </ProtectedRoute>
        } />

        {/* Pública — página de negocio con productos y botón WhatsApp */}
        <Route path="/negocio/:id" element={
          <PageLayout><NegocioPage /></PageLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App