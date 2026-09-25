import { useEffect, useState } from 'react'
import { getResumen } from '../services/apiAdmin'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardMetricsRow from '../components/dashboard/DashboardMetricsRow'
import DashboardSalesChart from '../components/dashboard/DashboardSalesChart'
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions'
import DashboardRecentOrders from '../components/dashboard/DashboardRecentOrders'
import DashboardTopProducts from '../components/dashboard/DashboardTopProducts'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getResumen()
      .then(setData)
      .catch((err) => setError(err.message || 'Error al cargar los datos del resumen'))
  }, [])

  return (
    <section className="dashboard-content-container">
      <DashboardHeader businessName={data?.negocio?.nombre} />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      <DashboardMetricsRow metrics={data?.metricas} />

      {/* Middle Grid: Sales Chart (65%) + Quick Actions (35%) */}
      <div className="dash-middle-grid">
        <DashboardSalesChart />
        <DashboardQuickActions businessName={data?.negocio?.nombre} />
      </div>

      {/* Bottom Grid: Recent Orders (50%) + Top Products (50%) */}
      <div className="dash-bottom-grid">
        <DashboardRecentOrders orders={data?.pedidosRecientes} />
        <DashboardTopProducts products={data?.productosMasVendidos} />
      </div>
    </section>
  )
}
