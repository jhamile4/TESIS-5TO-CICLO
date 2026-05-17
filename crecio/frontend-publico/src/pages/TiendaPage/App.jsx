import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/index.jsx'
import TiendaPage from './pages/TiendaPage/index.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tienda/:id" element={<TiendaPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App