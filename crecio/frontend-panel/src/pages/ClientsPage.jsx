import { useEffect, useState } from 'react'
import { DollarSign, Search, Users, UserCheck, ShoppingBag, RefreshCw } from 'lucide-react'
import { getClientes } from '../services/apiAdmin'
import { currency } from '../utils/formatters'

export default function ClientsPage() {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = () => {
    setLoading(true)
    getClientes()
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

  const clients = data?.clientes || []
  const filtered = clients.filter((client) =>
    `${client.nombre || ''} ${client.email || ''}`.toLowerCase().includes(query.toLowerCase())
  )

  const totalSpent = clients.reduce((sum, client) => sum + Number(client.total_gastado || 0), 0)
  const activeCount = clients.filter((client) => client.activo).length
  const avgOrder = clients.length ? totalSpent / clients.length : 0

  return (
    <section className="clients-page-wrapper">
      {/* Header */}
      <div className="clients-heading-bar">
        <div>
          <h2>Gestión de Clientes</h2>
          <p>Base de clientes de {data?.negocio?.nombre || 'tu negocio'}</p>
        </div>
        <button className="btn-refresh-clients" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <div className="toast-error">{error}</div>}

      {/* Metrics Row */}
      <div className="client-metrics-grid">
        <article className="client-metric-card green">
          <div className="metric-icon-box">
            <Users size={18} />
          </div>
          <div>
            <span className="metric-label">Total Clientes</span>
            <h3 className="metric-val">{clients.length}</h3>
          </div>
        </article>

        <article className="client-metric-card purple">
          <div className="metric-icon-box">
            <ShoppingBag size={18} />
          </div>
          <div>
            <span className="metric-label">Nuevos este mes</span>
            <h3 className="metric-val">+{clients.filter((c) => c.pedidos_mes > 0).length}</h3>
          </div>
        </article>

        <article className="client-metric-card mint">
          <div className="metric-icon-box">
            <UserCheck size={18} />
          </div>
          <div>
            <span className="metric-label">Clientes Activos</span>
            <h3 className="metric-val">{activeCount}</h3>
          </div>
        </article>

        <article className="client-metric-card blue">
          <div className="metric-icon-box">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="metric-label">Compra Promedio</span>
            <h3 className="metric-val">{currency.format(avgOrder)}</h3>
          </div>
        </article>
      </div>

      {/* Search Input */}
      <div className="client-search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar clientes por nombre o correo electrónico..."
        />
      </div>

      {/* Clients Grid */}
      <div className="clients-card-grid">
        {filtered.map((client) => {
          const firstChar = client.nombre?.charAt(0)?.toUpperCase() || 'C'
          return (
            <article className="client-item-card" key={client.pk_id}>
              <div className="client-card-header">
                <div className="client-avatar-badge">{firstChar}</div>
                <div className="client-info-main">
                  <strong>{client.nombre}</strong>
                  <small>{client.email}</small>
                </div>
              </div>

              <div className="client-stats-row">
                <div className="stat-col">
                  <small>Pedidos</small>
                  <b>{client.pedidos || 0}</b>
                </div>
                <div className="stat-col">
                  <small>Total Gastado</small>
                  <b>{currency.format(Number(client.total_gastado || 0))}</b>
                </div>
              </div>

              <div className="client-card-footer">
                <small>Última compra: {new Date(client.ultima_compra || Date.now()).toLocaleDateString('es-PE')}</small>
                <span className={`client-status-tag ${client.activo ? 'active' : 'inactive'}`}>
                  {client.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-clients-box">
          <p>No se encontraron clientes que coincidan con el término buscado.</p>
        </div>
      )}
    </section>
  )
}
