import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage      from './pages/LandingPage/index.jsx'
import TiendaPage       from './pages/TiendaPage/index.jsx'
import DirectorioPage   from './pages/DirectorioPage/index.jsx'
import RegistroPage     from './pages/RegistroPage/index.jsx'
import LoginPage        from './pages/LoginPage/index.jsx'
import VerificacionPage from './pages/VerificacionPage/index.jsx'
import PerfilPage       from './pages/PerfilPage/index.jsx'
import PagarPlanPage    from './pages/PagarPlanPage/index.jsx'
import RecuperarPage    from './pages/RecuperarPage/index.jsx'
import LegalPage        from './pages/LegalPage/index.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<LandingPage />}      />
        <Route path="/tiendas"     element={<DirectorioPage />}   />
        <Route path="/tienda/:id"  element={<TiendaPage />}       />
        <Route path="/registro"    element={<RegistroPage />}     />
        <Route path="/login"       element={<LoginPage />}        />
        <Route path="/verificar"   element={<VerificacionPage />} />
        <Route path="/perfil"      element={<PerfilPage />}       />
        <Route path="/pagar-plan"  element={<PagarPlanPage />}    />
        <Route path="/recuperar"   element={<RecuperarPage />}    />
        <Route path="/privacidad"  element={<LegalPage tipo="privacidad" />} />
        <Route path="/terminos"    element={<LegalPage tipo="terminos" />}   />
        <Route path="/eliminacion-datos" element={<LegalPage tipo="eliminacion" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App