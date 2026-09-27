import { useEffect, useState } from 'react'
import { Sun, Smartphone, DollarSign, CreditCard, RefreshCw, Plus, Eye, Image as ImageIcon } from 'lucide-react'
import { getVentas } from '../services/apiAdmin'
import { currency } from '../utils/formatters'
import RegisterSaleModal from '../components/sales/RegisterSaleModal'
import VoucherModal from '../components/sales/VoucherModal'
import SaleDetailModal from '../components/sales/SaleDetailModal'

export default function SalesPage() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('Todas')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [voucherUrl, setVoucherUrl] = useState(null)
  const [selectedSaleDetail, setSelectedSaleDetail] = useState(null)

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

  const getPaymentMethod = (sale) => {
    if (sale.metodo_pago) return sale.metodo_pago
    if (sale.stripe_payment_intent) return 'Tarjeta'
    return 'Efectivo'
  }

  const filteredSales = filter === 'Todas'
    ? sales
    : sales.filter((sale) => getPaymentMethod(sale).toLowerCase() === filter.toLowerCase())

  const todayStr = new Date().toDateString()
  const todaySales = sales.filter((sale) => new Date(sale.created_at).toDateString() === todayStr)
  const totalToday = todaySales
    .filter((sale) => sale.estado !== 'cancelado')
    .reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)

  const sumByMethod = (methodName) =>
    sales
      .filter((sale) => getPaymentMethod(sale).toLowerCase() === methodName.toLowerCase() && sale.estado !== 'cancelado')
      .reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)

  const countByMethod = (methodName) =>
    sales.filter((sale) => getPaymentMethod(sale).toLowerCase() === methodName.toLowerCase() && sale.estado !== 'cancelado').length

  const getItemCount = (sale) => {
    try {
      const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items
      if (Array.isArray(items)) {
        return items.reduce((sum, i) => sum + Number(i.cantidad || i.quantity || 1), 0)
      }
      return 1
    } catch {
      return 1
    }
  }

  return (
    <section className="sales-page-wrapper">
      {/* Header */}
      <div className="sales-heading-bar">
        <div>
          <h2>Ventas</h2>
          <p>Registra y revisa todas tus ventas del día</p>
        </div>
        <div className="sales-header-actions">
          <button className="btn-refresh-sales" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button className="btn-register-sale" onClick={() => setIsRegisterOpen(true)}>
            <Plus size={16} /> Registrar Venta
          </button>
        </div>
      </div>

      {error && <div className="toast-error">{error}</div>}

      {/* Metrics Row (Matching Figma 1:1) */}
      <div className="sales-metrics-row">
        <article className="sales-metric-card green">
          <div className="sales-metric-icon">
            <Sun size={20} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Ventas de hoy</span>
            <h3 className="sales-metric-val">{currency.format(totalToday)}</h3>
            <small className="sales-metric-sub">{todaySales.length} ventas registradas</small>
          </div>
        </article>

        <article className="sales-metric-card purple">
          <div className="sales-metric-icon">
            <Smartphone size={20} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Por Yape</span>
            <h3 className="sales-metric-val">{currency.format(sumByMethod('Yape'))}</h3>
            <small className="sales-metric-sub">{countByMethod('Yape')} ventas</small>
          </div>
        </article>

        <article className="sales-metric-card green">
          <div className="sales-metric-icon">
            <DollarSign size={20} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Efectivo</span>
            <h3 className="sales-metric-val">{currency.format(sumByMethod('Efectivo'))}</h3>
            <small className="sales-metric-sub">{countByMethod('Efectivo')} ventas</small>
          </div>
        </article>

        <article className="sales-metric-card blue">
          <div className="sales-metric-icon">
            <CreditCard size={20} />
          </div>
          <div className="sales-metric-info">
            <span className="sales-metric-label">Tarjeta</span>
            <h3 className="sales-metric-val">{currency.format(sumByMethod('Tarjeta'))}</h3>
            <small className="sales-metric-sub">{countByMethod('Tarjeta')} ventas</small>
          </div>
        </article>
      </div>

      {/* Filter Tabs (Figma style) */}
      <div className="sales-filter-tabs">
        {['Todas', 'Yape', 'Efectivo', 'Tarjeta'].map((option) => (
          <button
            key={option}
            className={`sales-tab-btn ${filter === option ? 'selected' : ''}`}
            onClick={() => setFilter(option)}
          >
            {option === 'Yape' ? '📱 Yape' : option === 'Efectivo' ? '💵 Efectivo' : option === 'Tarjeta' ? '💳 Tarjeta' : 'Todas'}
          </button>
        ))}
      </div>

      {/* Sales Table */}
      <div className="sales-table-card">
        <div className="sales-table-wrapper">
          <table className="sales-custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Hora</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Comprobante</th>
                <th style={{ width: '48px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const payMethod = getPaymentMethod(sale)
                const dateObj = new Date(sale.created_at)
                const formattedTime = dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                const formattedDate = dateObj.toISOString().split('T')[0]
                const hasVoucher = Boolean(sale.comprobante_url)

                return (
                  <tr key={sale.pk_id}>
                    <td className="sale-code-col">
                      {sale.numero_pedido || `VTA-${String(sale.pk_id).padStart(3, '0')}`}
                    </td>
                    <td>
                      <div className="client-cell">
                        <strong>{sale.cliente_nombre || 'Cliente Directo'}</strong>
                        <small>{sale.telefono_cliente || sale.cliente_email || '+51 987 654 321'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span>{formattedTime}</span>
                        <small>{formattedDate}</small>
                      </div>
                    </td>
                    <td className="items-count-col">{getItemCount(sale)} {getItemCount(sale) === 1 ? 'item' : 'items'}</td>
                    <td className="amount-col">{currency.format(Number(sale.monto_total || 0))}</td>
                    <td>
                      <span className={`payment-badge ${payMethod.toLowerCase()}`}>
                        {payMethod === 'Yape' && <Smartphone size={12} />}
                        {payMethod === 'Efectivo' && <DollarSign size={12} />}
                        {payMethod === 'Tarjeta' && <CreditCard size={12} />}
                        {payMethod}
                      </span>
                    </td>
                    <td>
                      {hasVoucher || payMethod === 'Yape' ? (
                        <button
                          className="comprobante-link"
                          onClick={() => setVoucherUrl(sale.comprobante_url || 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=400&auto=format&fit=crop&q=80')}
                        >
                          <ImageIcon size={14} /> Ver
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="action-eye-btn" title="Ver detalle" onClick={() => setSelectedSaleDetail(sale)}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="empty-sales-placeholder">
            <p>No hay registros de ventas para el filtro seleccionado.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RegisterSaleModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={loadData}
      />

      <VoucherModal
        isOpen={Boolean(voucherUrl)}
        voucherUrl={voucherUrl}
        onClose={() => setVoucherUrl(null)}
      />

      <SaleDetailModal
        isOpen={Boolean(selectedSaleDetail)}
        sale={selectedSaleDetail}
        onClose={() => setSelectedSaleDetail(null)}
      />
    </section>
  )
}
