import { useEffect, useState } from 'react'
import {
  Bell, Boxes, ChartNoAxesCombined, ChevronRight, CircleDollarSign,
  ClipboardList, ExternalLink, LayoutDashboard, Package, Plus,
  Download, Search, Settings, ShoppingBag, Sparkles, Store, Users,
} from 'lucide-react'
import { getInventario, getResumen, iniciarSesion } from './services/apiAdmin'

const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await iniciarSesion(email, password)
      localStorage.setItem('crecio_admin_token', data.token)
      localStorage.setItem('crecio_admin_user', JSON.stringify(data.cliente))
      onSuccess(data.cliente)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return <main className="login-shell">
    <form className="login-card" onSubmit={submit}>
      <div className="brand-mark"><ChartNoAxesCombined size={28} /></div>
      <p className="eyebrow">CRECIO PARA NEGOCIOS</p>
      <h1>Gestiona tu negocio</h1>
      <p className="muted">Accede a tus ventas, inventario y clientes.</p>
      <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" /></label>
      <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Tu contraseña" /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar al panel'}<ChevronRight size={17} /></button>
      <a className="public-link" href="http://localhost:5173">Volver a CRECIO público</a>
    </form>
  </main>
}

const navigation = [
  [LayoutDashboard, 'Inicio'], [Boxes, 'Inventario'], [ShoppingBag, 'Ventas'],
  [Sparkles, 'Marketing IA'], [Users, 'Clientes'], [CircleDollarSign, 'Finanzas'], [Store, 'Mi tienda'],
]

const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const statusClass = (status) => status === 'pagado' ? 'paid' : status === 'cancelado' ? 'cancelled' : 'pending'

function Sidebar({ active, onNavigate, onLogout, user, business }) { return <aside className="sidebar">
  <div className="sidebar-brand"><div className="brand-mark small"><ChartNoAxesCombined size={21} /></div><div><strong>Crecio</strong><span>Panel de Control</span></div></div>
  <nav>{navigation.map(([Icon, label], index) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => (label === 'Inicio' || label === 'Inventario') && onNavigate(label)} disabled={label !== 'Inicio' && label !== 'Inventario'}><Icon size={19} />{label}{active === label && <i />}</button>)}</nav>
  <div className="sidebar-bottom">
    <button className="collapse-button"><ChevronRight size={18} />Contraer</button>
    <div className="business-profile">
      <div className="business-avatar">{business?.logoUrl ? <img src={business.logoUrl} alt="" /> : (business?.nombre || user?.nombre || 'N').charAt(0).toUpperCase()}</div>
      <div className="business-info"><b>{business?.nombre || 'Mi negocio'}</b><span>Administrador</span></div>
      <button className="business-settings" title="Configuración del negocio"><Settings size={18} /></button>
    </div>
  </div>
</aside> }

function Dashboard({ user, onLogout, onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { getResumen().then(setData).catch((err) => setError(err.message)) }, [])
  const metrics = data?.metricas || { ventasTotales: 0, ordenes: 0, clientes: 0, productos: 0 }
  const chartMax = Math.max(...(data?.ventasSemana?.map((item) => item.total) || [1]), 1)

  return <div className="panel-shell">
    <Sidebar active="Inicio" onNavigate={onNavigate} onLogout={onLogout} user={user} business={data?.negocio} />
    <main className="dashboard">
      <header className="topbar"><h1>Panel de Control</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button><div className="avatar">{user?.nombre?.charAt(0)?.toUpperCase() || 'A'}</div></div></header>
      <section className="content">
        <div className="welcome"><div><h2>¡Buenos días, equipo de {data?.negocio?.nombre || 'tu negocio'}!</h2><p>Aquí está el resumen de tu negocio hoy.</p></div><a href="http://localhost:5173" target="_blank" rel="noreferrer">Ver mi tienda <ExternalLink size={15} /></a></div>
        {error && <div className="alert">{error}. Verifica que el backend esté activo y que tu cuenta tenga un negocio.</div>}
        <div className="metrics">
          <Metric title="Ventas totales" value={currency.format(metrics.ventasTotales)} icon={CircleDollarSign} />
          <Metric title="Órdenes" value={metrics.ordenes} icon={ClipboardList} />
          <Metric title="Clientes" value={metrics.clientes} icon={Users} />
          <Metric title="Productos" value={metrics.productos} icon={Package} />
        </div>
        <div className="dashboard-grid main-grid">
          <section className="card chart-card"><div className="card-title"><h3>Ventas de la semana</h3><strong>{currency.format(data?.ventasSemana?.reduce((total, item) => total + item.total, 0) || 0)} total</strong></div><div className="bar-chart">{(data?.ventasSemana || []).map((item) => <div className="bar-item" key={item.fecha}><span className="bar-value">{item.total ? currency.format(item.total) : ''}</span><div className="bar-track"><div className="bar" style={{ height: `${Math.max(item.total ? (item.total / chartMax) * 100 : 0, 3)}%` }} /></div><span>{labels[new Date(`${item.fecha}T12:00:00`).getDay()]}</span></div>)}</div></section>
          <section className="card quick-card"><h3>Acciones rápidas</h3><button className="quick-action highlighted"><Plus size={20} /><span><b>Agregar producto</b><small>Próximamente en Inventario</small></span></button><button className="quick-action"><Package size={20} /><span><b>Descargar QR</b><small>Comparte tu tienda</small></span></button><button className="quick-action"><Sparkles size={20} /><span><b>Generar con IA</b><small>Descripción o post para redes</small></span></button></section>
        </div>
        <div className="dashboard-grid bottom-grid"><Orders orders={data?.pedidosRecientes || []} /><TopProducts products={data?.productosMasVendidos || []} /></div>
      </section>
    </main>
  </div>
}

function Inventory({ user, onLogout, onNavigate }) {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [error, setError] = useState('')
  useEffect(() => { getInventario().then(setData).catch((err) => setError(err.message)) }, [])
  const products = data?.productos || []
  const categories = ['Todas', ...new Set(products.map((product) => product.categoria || 'Sin categoría'))]
  const filtered = products.filter((product) => (category === 'Todas' || product.categoria === category) && product.nombre.toLowerCase().includes(query.toLowerCase()))
  const metrics = data?.metricas || { totalProductos: 0, alertasStockBajo: 0, unidadesStock: 0, valorInventario: 0 }
  return <div className="panel-shell"><Sidebar active="Inventario" onNavigate={onNavigate} onLogout={onLogout} user={user} business={data?.negocio} />
    <main className="dashboard"><header className="topbar"><h1>Inventario</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header>
      <section className="content inventory-content"><div className="welcome inventory-welcome"><div><h2>Inventarios</h2><p>Gestiona tus productos con ayuda de IA</p></div><div className="inventory-actions"><button className="export"><Download size={16} />Exportar</button><button className="add-product"><Plus size={17} />Agregar producto</button></div></div>
      {error && <div className="alert">{error}</div>}
      <div className="metrics"><Metric title="Total productos" value={metrics.totalProductos} icon={Package} /><Metric title="Alertas de stock bajo" value={metrics.alertasStockBajo} icon={Bell} /><Metric title="Unidades en stock" value={metrics.unidadesStock} icon={ShoppingBag} /><Metric title="Valor est. del inventario" value={currency.format(metrics.valorInventario)} icon={ChartNoAxesCombined} /></div>
      <div className="inventory-filters"><label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos..." /></label><div className="category-tabs">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'selected' : ''}>{item} ({item === 'Todas' ? products.length : products.filter((p) => p.categoria === item).length})</button>)}</div></div>
      <div className="product-grid">{filtered.map((product) => <article className="inventory-product" key={product.pk_id}><div className="product-image">{product.stock <= 5 && <span className="stock-badge">Stock bajo: {product.stock}</span>}{product.imagen_url ? <img src={product.imagen_url} alt={product.nombre} /> : <Package size={45} />}</div><div className="inventory-details"><div className="product-line"><div><b>{product.nombre}</b><small>{product.categoria || 'Sin categoría'}</small></div><strong>{currency.format(product.precio)}</strong></div><div className={`stock-line ${product.stock <= 5 ? 'critical' : product.stock <= 10 ? 'warning' : ''}`}><span><i />{product.stock} en stock</span><span>Disponible</span></div></div></article>)}</div>
      {!filtered.length && <p className="empty">No hay productos que coincidan con tu búsqueda.</p>}</section></main></div>
}

function Metric({ title, value, icon: Icon }) { return <article className="metric-card"><div><p>{title}</p><h3>{value}</h3><span>Datos reales de tu negocio</span></div><div className="metric-icon"><Icon size={21} /></div></article> }
function Orders({ orders }) { return <section className="card orders-card"><div className="card-title"><h3>Órdenes recientes</h3><button>Ver todas</button></div>{orders.length ? orders.map((order) => <div className="order" key={order.pk_id}><div className="order-icon"><ShoppingBag size={18} /></div><div><b>{order.numero_pedido || `ORD-${order.pk_id}`}</b><small>{order.cliente_nombre || 'Cliente invitado'}</small></div><div className="order-total"><b>{currency.format(order.monto_total)}</b><span className={statusClass(order.estado)}>{order.estado}</span></div></div>) : <p className="empty">Aún no tienes pedidos registrados.</p>}</section> }
function TopProducts({ products }) { const maximum = Math.max(...products.map((product) => product.ventas), 1); return <section className="card products-card"><div className="card-title"><h3>Productos más vendidos</h3><button>Ver inventario</button></div>{products.length ? products.map((product, index) => <div className="product" key={product.nombre}><span className="rank">{index + 1}</span><div className="product-name"><b>{product.nombre}</b><small>{product.ventas} ventas</small></div><div className="product-total"><b>{currency.format(product.total)}</b><div><i style={{ width: `${(product.ventas / maximum) * 100}%` }} /></div></div></div>) : <p className="empty">Se mostrarán aquí al confirmar ventas.</p>}</section> }

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('crecio_admin_user')) } catch { return null } })
  const logout = () => { localStorage.removeItem('crecio_admin_token'); localStorage.removeItem('crecio_admin_user'); setUser(null) }
  const [view, setView] = useState('Inicio')
  if (!user) return <Login onSuccess={setUser} />
  return view === 'Inventario' ? <Inventory user={user} onLogout={logout} onNavigate={setView} /> : <Dashboard user={user} onLogout={logout} onNavigate={setView} />
}
