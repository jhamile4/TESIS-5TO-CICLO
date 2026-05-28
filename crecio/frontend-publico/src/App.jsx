import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/index.jsx'
import TiendaPage from './pages/TiendaPage/index.jsx'
import RegistroPage from './pages/RegistroPage/index.jsx'
import LoginPage from './pages/LoginPage/index.jsx'
import VerificacionPage from './pages/VerificacionPage/index.jsx'
import PerfilPage from './pages/PerfilPage/index.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tienda/:id" element={<TiendaPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verificar" element={<VerificacionPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App