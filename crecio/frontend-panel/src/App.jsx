import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PanelLayout from './components/PanelLayout'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import SalesPage from './pages/SalesPage'
import ClientsPage from './pages/ClientsPage'
import MarketingPage from './pages/MarketingPage'
import FinancePage from './pages/FinancePage'
import StorePage from './pages/StorePage'

function ComingSoon({ title }) {
  return <section className="content"><div className="card"><h2>{title}</h2><p className="muted">Este módulo está preparado para la siguiente fase del panel.</p></div></section>
}

export default function App() {
  return <AuthProvider>
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<PanelLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="ventas" element={<SalesPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="finanzas" element={<FinancePage />} />
          <Route path="tienda" element={<StorePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
}
