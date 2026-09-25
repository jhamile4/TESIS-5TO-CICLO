import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PanelLayout from './components/PanelLayout'
import ErrorBoundary from './components/common/ErrorBoundary'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import SalesPage from './pages/SalesPage'
import ClientsPage from './pages/ClientsPage'
import MarketingPage from './pages/MarketingPage'
import FinancePage from './pages/FinancePage'
import StorePage from './pages/StorePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<PanelLayout />}>
            <Route index element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="inventario" element={<ErrorBoundary><InventoryPage /></ErrorBoundary>} />
            <Route path="ventas" element={<ErrorBoundary><SalesPage /></ErrorBoundary>} />
            <Route path="clientes" element={<ErrorBoundary><ClientsPage /></ErrorBoundary>} />
            <Route path="marketing" element={<ErrorBoundary><MarketingPage /></ErrorBoundary>} />
            <Route path="finanzas" element={<ErrorBoundary><FinancePage /></ErrorBoundary>} />
            <Route path="tienda" element={<ErrorBoundary><StorePage /></ErrorBoundary>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
