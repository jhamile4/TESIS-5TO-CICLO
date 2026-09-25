import { useEffect, useState } from 'react'
import { Banknote, CreditCard, Eye, ShoppingBag, RefreshCw, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { getVentas } from '../services/apiAdmin'
import { currency } from '../utils/formatters'

export default function SalesPage() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('Todas')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = () => {
    setLoading(true)
    getVentas()
      .then((res) => {
        setData(res)
        setError('')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const sales = data?.ventas || []
  const method = (sale) => (sale.stripe_payment_intent ? 'Tarjeta' : 'Efectivo')

  const filtered = filter === 'Todas' ? sales : sales.filter((sale) => method(sale) === filter)

  const todayStr = new Date().toDateString()
  const todaySales = sales.filter((sale) => new Date(sale.created_at).toDateString() === todayStr)
  const totalToday = todaySales
    .filter((sale) => sale.estado === 'pagado')
    .reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)

  const sumByMethod = (name) =>
    sales
      .filter((sale) => method(sale) === name && sale.estado !== 'cancelado')
      .reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)

  const calcItemCount = (sale) => {
    try {
      const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items
      if (Array.isArray(items)) {
        return items.reduce((sum, i) => sum + Number(i.cantidad || i.quantity || 1), 0)
      }
      return 0
    } catch {
      return 0
    }
  }

  return (
    <section className="sales-page-wrapper">
      {/* Header */}
      <div className="sales-heading-bar">
        <div>
          <h2>Ventas & Transacciones</h2>
          <p>Supervisa los pedidos recibidos, estados de pago y canales de venta</p>
        </div>
        <button className="btn-refresh-sales" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <div className="toast-error">{error}</div>}

      {/* Metrics Row */}
      <div className="sales-metrics-row">
        <article className="sales-metric-card green">
          <div className="sales-metric-icon">
            <DollarSign size={18} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Ventas de Hoy</span>
            <h3 className="sales-metric-val">{currency.format(totalToday)}</h3>
            <small className="sales-metric-sub">{todaySales.length} pedidos hoy</small>
          </div>
        </article>

        <article className="sales-metric-card blue">
          <div className="sales-metric-icon">
            <CreditCard size={18} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Por Tarjeta</span>
            <h3 className="sales-metric-val">{currency.format(sumByMethod('Tarjeta'))}</h3>
            <small className="sales-metric-sub">
              {sales.filter((s) => method(s) === 'Tarjeta').length} ventas procesadas
            </small>
          </div>
        </article>

        <article className="sales-metric-card mint">
          <div className="sales-metric-icon">
            <Banknote size={18} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Efectivo / Directo</span>
            <h3 className="sales-metric-val">{currency.format(sumByMethod('Efectivo'))}</h3>
            <small className="sales-metric-sub">
              {sales.filter((s) => method(s) === 'Efectivo').length} pagos acordados
            </small>
          </div>
        </article>

        <article className="sales-metric-card purple">
          <div className="sales-metric-icon">
            <ShoppingBag size={18} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Total Pedidos</span>
            <h3 className="sales-metric-val">{sales.length}</h3>
            <small className="sales-metric-sub">Histórico registrado</small>
          </div>
        </article>
      </div>

      {/* Filter Tabs */}
      <div className="sales-filter-tabs">
        {['Todas', 'Efectivo', 'Tarjeta'].map((option) => (
          <button
            key={option}
            className={`sales-tab-btn ${filter === option ? 'selected' : ''}`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Sales Table Container */}
      <div className="sales-table-card">
        <div className="sales-table-wrapper">
          <table className="sales-custom-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha / Hora</th>
                <th>Ítems</th>
                <th>Monto Total</th>
                <th>Método de Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => {
                const payMethod = method(sale)
                const dateObj = new Date(sale.created_at)
                return (
                  <tr key={sale.pk_id}>
                    <td className="sale-code-col">
                      {sale.numero_pedido || `ORD-${String(sale.pk_id).padStart(3, '0')}`}
                    </td>
                    <td>
                      <div className="client-cell">
                        <strong>{sale.cliente_nombre || 'Cliente Invitado'}</strong>
                        <small>{sale.cliente_email || 'vía Tienda Online'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span>{dateObj.toLocaleDateString('es-PE')}</span>
                        <small>{dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</small>
                      </div>
                    </td>
                    <td className="items-count-col">{calcItemCount(sale)} ítems</td>
                    <td className="amount-col">{currency.format(Number(sale.monto_total || 0))}</td>
                    <td>
                      <span className={`payment-badge ${payMethod === 'Efectivo' ? 'cash' : 'card'}`}>
                        {payMethod === 'Efectivo' ? <Banknote size={12} /> : <CreditCard size={12} />}
                        {payMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`sale-status-tag ${sale.estado || 'completada'}`}>
                        {sale.estado || 'completada'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-sales-placeholder">
            <p>No hay registros de ventas para el filtro seleccionado.</p>
          </div>
        )}
      </div>
    </section>
  )
}
