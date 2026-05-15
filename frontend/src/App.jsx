import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Shared
import Navbar from './components/shared/Navbar';

// Guards de ruta
import ProtectedRoute from './components/cliente/ProtectedRoute';
import GuestRoute     from './components/cliente/GuestRoute';

// Páginas públicas
import LandingPage  from './pages/public/LandingPage';
import Marketplace  from './pages/public/Marketplace';
import StorePage    from './pages/public/StorePage';

// Páginas del perfil cliente
import LoginPage    from './pages/cliente/LoginPage';
import RegisterPage from './pages/cliente/RegisterPage';
import ProfilePage  from './pages/cliente/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/"            element={<LandingPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/store/:id"   element={<StorePage />} />

        {/* Solo invitados — redirige al marketplace si hay sesión */}
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protegidas — requieren sesión activa */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
