import { useEffect, useState } from 'react'
import {
  Banknote, Bell, Boxes, ChartNoAxesCombined, ChevronRight, CircleDollarSign,
  ClipboardList, CreditCard, ExternalLink, Eye, LayoutDashboard, Package, Plus,
  CalendarDays, Check, Copy, Download, ImagePlus, Search, Settings, ShoppingBag, Sparkles, Store, UserPlus, Users, WandSparkles,
} from 'lucide-react'
import { crearProducto, generarMarketing, getClientes, getInventario, getResumen, getVentas, iniciarSesion } from './services/apiAdmin'

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
  <nav>{navigation.map(([Icon, label]) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => ['Inicio', 'Inventario', 'Ventas', 'Clientes', 'Marketing IA'].includes(label) && onNavigate(label)} disabled={!['Inicio', 'Inventario', 'Ventas', 'Clientes', 'Marketing IA'].includes(label)}><Icon size={19} />{label}{active === label && <i />}</button>)}</nav>
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

function ProductForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagenUrl: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true); setError('')
    try { await crearProducto(form); onCreated() }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return <div className="modal-backdrop" onClick={onClose}>
    <form className="product-form" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
      <div className="card-title"><h3>Agregar producto</h3><button type="button" onClick={onClose}>Cerrar</button></div>
      <label>Nombre<input required value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></label>
      <label>Descripción<textarea value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} /></label>
      <div className="form-row"><label>Precio<input required type="number" min="0" step="0.01" value={form.precio} onChange={(event) => setForm({ ...form, precio: event.target.value })} /></label><label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label></div>
      <label>Categoría<input value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })} placeholder="General" /></label>
      <label>URL de imagen<input type="url" value={form.imagenUrl} onChange={(event) => setForm({ ...form, imagenUrl: event.target.value })} /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" disabled={saving}>{saving ? 'Guardando...' : 'Guardar producto'}</button>
    </form>
  </div>
}

function Sales({ user, onLogout, onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('Todas')
  const loadSales = () => getVentas().then(setData).catch((err) => setError(err.message))
  useEffect(() => { loadSales() }, [])
  const sales = data?.ventas || []
  const getMethod = (sale) => sale.stripe_payment_intent ? 'Tarjeta' : 'Efectivo'
  const filteredSales = filter === 'Todas' ? sales : sales.filter((sale) => getMethod(sale) === filter)
  const today = new Date().toDateString()
  const todaySales = sales.filter((sale) => new Date(sale.created_at).toDateString() === today)
  const total = todaySales.filter((sale) => sale.estado === 'pagado').reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)
  const byMethod = (method) => sales.filter((sale) => getMethod(sale) === method && sale.estado !== 'cancelado').reduce((sum, sale) => sum + Number(sale.monto_total || 0), 0)
  const itemCount = (sale) => { try { return JSON.parse(sale.items || '[]').reduce((sum, item) => sum + Number(item.cantidad || 0), 0) } catch { return 0 } }

  return <div className="panel-shell"><Sidebar active="Ventas" onNavigate={onNavigate} onLogout={onLogout} user={user} business={data?.negocio} />
    <main className="dashboard"><header className="topbar"><h1>Ventas</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header>
      <section className="content sales-content"><div className="sales-heading"><div><h2>Ventas</h2><p>Registra y revisa todas las ventas de tu negocio</p></div><button className="refresh-sales" onClick={loadSales}>Actualizar</button></div>
      {error && <div className="alert">{error}</div>}
      <div className="sales-metrics">
        <SalesMetric icon={CircleDollarSign} label="Ventas de hoy" value={currency.format(total)} detail={`${todaySales.length} ventas registradas`} tone="green" />
        <SalesMetric icon={CreditCard} label="Por tarjeta" value={currency.format(byMethod('Tarjeta'))} detail={`${sales.filter((sale) => getMethod(sale) === 'Tarjeta').length} ventas`} tone="blue" />
        <SalesMetric icon={Banknote} label="Efectivo" value={currency.format(byMethod('Efectivo'))} detail={`${sales.filter((sale) => getMethod(sale) === 'Efectivo').length} ventas`} tone="mint" />
        <SalesMetric icon={ShoppingBag} label="Pedidos" value={sales.length} detail={`${sales.filter((sale) => sale.estado === 'pagado').length} pagados`} tone="purple" />
      </div>
      <div className="sales-filters">{['Todas', 'Efectivo', 'Tarjeta'].map((option) => <button key={option} className={filter === option ? 'selected' : ''} onClick={() => setFilter(option)}>{option}</button>)}</div>
      <section className="card sales-table-card"><div className="sales-table-wrap"><table className="sales-table"><thead><tr><th>#</th><th>Cliente</th><th>Hora</th><th>Productos</th><th>Total</th><th>Pago</th><th>Comprobante</th><th /></tr></thead><tbody>{filteredSales.map((sale) => { const method = getMethod(sale); return <tr key={sale.pk_id}><td className="sale-number">{sale.numero_pedido || `VTA-${String(sale.pk_id).padStart(3, '0')}`}</td><td><strong>{sale.cliente_nombre || 'Cliente invitado'}</strong><small>{sale.cliente_email || 'Sin correo'}</small></td><td><span>{new Date(sale.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span><small>{new Date(sale.created_at).toLocaleDateString('es-PE')}</small></td><td>{itemCount(sale)} {itemCount(sale) === 1 ? 'item' : 'items'}</td><td><strong>{currency.format(Number(sale.monto_total || 0))}</strong></td><td><span className={`payment-pill ${method === 'Efectivo' ? 'cash' : 'card'}`}>{method === 'Efectivo' ? <Banknote size={12} /> : <CreditCard size={12} />}{method}</span></td><td className="receipt-cell">-</td><td><button className="row-action" title="Ver detalle"><Eye size={15} /></button></td></tr> })}</tbody></table></div>{!filteredSales.length && <p className="empty">No hay ventas para este filtro.</p>}</section>
      </section>
    </main>
  </div>
}

function SalesMetric({ icon: Icon, label, value, detail, tone }) { return <article className={`sales-metric ${tone}`}><div className="sales-metric-icon"><Icon size={16} /></div><p>{label}</p><h3>{value}</h3><small>{detail}</small></article> }

function Clients({ user, onLogout, onNavigate }) {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const loadClients = () => getClientes().then(setData).catch((err) => setError(err.message))
  useEffect(() => { loadClients() }, [])
  const clients = data?.clientes || []
  const filtered = clients.filter((client) => `${client.nombre} ${client.email}`.toLowerCase().includes(query.toLowerCase()))
  const totalGastado = clients.reduce((sum, client) => sum + client.total_gastado, 0)
  const nuevosEsteMes = clients.filter((client) => client.pedidos_mes > 0).length
  const activos = clients.filter((client) => client.activo).length

  return <div className="panel-shell"><Sidebar active="Clientes" onNavigate={onNavigate} onLogout={onLogout} user={user} business={data?.negocio} />
    <main className="dashboard"><header className="topbar"><h1>Clientes</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header>
      <section className="content clients-content"><div className="clients-heading"><div><h2>Clientes</h2><p>Gestiona la base de clientes de {data?.negocio?.nombre || 'tu negocio'}</p></div><button className="refresh-sales" onClick={loadClients}><UserPlus size={15} />Actualizar clientes</button></div>
      {error && <div className="alert">{error}</div>}
      <div className="client-metrics"><ClientMetric icon={Users} label="Total clientes" value={clients.length} tone="green" /><ClientMetric icon={UserPlus} label="Nuevos este mes" value={`+${nuevosEsteMes}`} tone="purple" /><ClientMetric icon={Users} label="Activos" value={activos} tone="mint" /><ClientMetric icon={CircleDollarSign} label="Compra promedio" value={currency.format(clients.length ? totalGastado / clients.length : 0)} tone="blue" /></div>
      <label className="client-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar clientes por nombre o email..." /></label>
      <div className="client-grid">{filtered.map((client) => <article className="client-card" key={client.pk_id}><div className="client-header"><div className="client-avatar">{client.nombre?.charAt(0)?.toUpperCase() || '?'}</div><div><strong>{client.nombre}</strong><small>{client.email}</small></div></div><div className="client-stats"><div><small>Órdenes</small><b>{client.pedidos}</b></div><div><small>Gastado</small><b>{currency.format(client.total_gastado)}</b></div></div><div className="client-footer"><small>Última: {new Date(client.ultima_compra).toLocaleDateString('es-PE')}</small><span className={client.activo ? 'client-active' : 'client-inactive'}>{client.activo ? 'activo' : 'inactivo'}</span></div></article>)}</div>
      {!filtered.length && <p className="empty">No hay clientes que coincidan con tu búsqueda.</p>}
      </section>
    </main>
  </div>
}

function Marketing({ user, onLogout, onNavigate }) {
  const [business, setBusiness] = useState(null)
  const [tipo, setTipo] = useState('Promoción / Oferta')
  const [tono, setTono] = useState('Modo Creativo')
  const [prompt, setPrompt] = useState('')
  const [contenido, setContenido] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const tipos = ['Promoción / Oferta', 'Nuevo Producto', 'Testimonial', 'Tip / Educativo', 'Detrás de Cámaras', 'Viral / Trending']
  useEffect(() => { getResumen().then((result) => setBusiness(result.negocio)).catch(() => {}) }, [])

  const generate = async () => {
    setLoading(true); setError(''); setCopied(false)
    try { const result = await generarMarketing({ tipo, tono, prompt }); setContenido(result.contenido) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const copy = async () => { await navigator.clipboard.writeText(contenido); setCopied(true); setTimeout(() => setCopied(false), 1800) }

  return <div className="panel-shell"><Sidebar active="Marketing IA" onNavigate={onNavigate} onLogout={onLogout} user={user} business={business} />
    <main className="dashboard"><header className="topbar"><h1>Marketing IA</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header>
      <section className="content marketing-content"><div className="marketing-tabs"><button className="marketing-tab active"><WandSparkles size={14} />Crear y Publicar</button><button className="marketing-tab">Programadas <span>0</span></button><button className="marketing-tab">Publicadas</button><button className="marketing-tab">Borradores</button></div>
        <div className="marketing-layout"><div className="marketing-editor"><section className="marketing-card"><h3>Plantilla de contenido</h3><div className="template-grid">{tipos.map((item) => <button key={item} className={tipo === item ? 'selected' : ''} onClick={() => setTipo(item)}>{item}</button>)}</div></section><section className="marketing-card"><div className="marketing-card-title"><WandSparkles size={15} /><h3>Prompt de IA</h3></div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe tu producto, campaña o idea para que la IA genere el contenido perfecto..." maxLength={500} /><div className="prompt-count">{prompt.length}/500</div><label className="image-upload"><ImagePlus size={14} />Subir imagen propia<input type="file" accept="image/*" /></label><div className="tone-buttons">{['Modo Creativo', 'Modo Profesional', 'Formato Corto'].map((item) => <button key={item} className={tono === item ? 'selected' : ''} onClick={() => setTono(item)}>{item}</button>)}</div><button className="generate-button" disabled={loading || !prompt.trim()} onClick={generate}><WandSparkles size={15} />{loading ? 'Generando...' : 'Generar con IA'}</button>{error && <p className="form-error">{error}</p>}</section><section className="marketing-card connected-accounts"><h3>Cuentas conectadas</h3><small>La publicación directa estará disponible al conectar tus redes.</small><div className="account-row"><span>Instagram</span><b>No conectada</b></div><div className="account-row"><span>Facebook</span><b>No conectada</b></div></section></div>
          <div className="marketing-preview"><section className="marketing-card preview-card"><div className="preview-heading"><div><h3>Vista previa del post</h3><small>Contenido generado para tu negocio</small></div><span>IA</span></div><div className="content-type-row">{['Publicación', 'Story', 'Video', 'Reels / Short', 'Promoción'].map((item) => <button key={item} className={item === tipo ? 'selected' : ''}>{item}</button>)}</div><div className="post-preview"><div className="post-account"><div className="post-avatar">{business?.nombre?.charAt(0) || 'C'}</div><div><b>{business?.nombre || 'Mi negocio'}</b><small>Publicado ahora</small></div></div><div className="post-image"><WandSparkles size={28} /><span>{contenido ? 'Contenido listo' : 'Tu publicación aparecerá aquí'}</span></div><p>{contenido || 'Escribe una idea a la izquierda y genera un contenido personalizado para tu negocio.'}</p></div><button className="copy-button" disabled={!contenido} onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Texto copiado' : 'Copiar texto'}</button></section><section className="marketing-card schedule-card"><h3>¿Cuándo publicar?</h3><div className="publish-options"><button className="selected">Publicar ahora</button><button><CalendarDays size={14} />Programar</button></div><button className="publish-button" disabled={!contenido}><Check size={15} />{contenido ? 'Listo para publicar' : 'Genera contenido para continuar'}</button></section></div></div>
      </section>
    </main>
  </div>
}

function Inventory({ user, onLogout, onNavigate }) {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [error, setError] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const loadInventory = () => getInventario().then(setData).catch((err) => setError(err.message))
  useEffect(() => { loadInventory() }, [])
  const products = data?.productos || []
  const categories = ['Todas', ...new Set(products.map((product) => product.categoria || 'Sin categoría'))]
  const filtered = products.filter((product) => (category === 'Todas' || product.categoria === category) && product.nombre.toLowerCase().includes(query.toLowerCase()))
  const metrics = data?.metricas || { totalProductos: 0, alertasStockBajo: 0, unidadesStock: 0, valorInventario: 0 }
  return <div className="panel-shell"><Sidebar active="Inventario" onNavigate={onNavigate} onLogout={onLogout} user={user} business={data?.negocio} />
    <main className="dashboard"><header className="topbar"><h1>Inventario</h1><div><button className="icon-button"><Search size={20} /></button><button className="icon-button notification"><Bell size={20} /></button></div></header>
      <section className="content inventory-content"><div className="welcome inventory-welcome"><div><h2>{data?.negocio?.nombre || 'Inventario'}</h2><p>Gestiona los productos de tu negocio</p></div><div className="inventory-actions"><button className="export"><Download size={16} />Exportar</button><button className="add-product" onClick={() => setShowProductForm(true)}><Plus size={17} />Agregar producto</button></div></div>
      {error && <div className="alert">{error}</div>}
      <div className="metrics"><Metric title="Total productos" value={metrics.totalProductos} icon={Package} /><Metric title="Alertas de stock bajo" value={metrics.alertasStockBajo} icon={Bell} /><Metric title="Unidades en stock" value={metrics.unidadesStock} icon={ShoppingBag} /><Metric title="Valor est. del inventario" value={currency.format(metrics.valorInventario)} icon={ChartNoAxesCombined} /></div>
      <div className="inventory-filters"><label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos..." /></label><div className="category-tabs">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'selected' : ''}>{item} ({item === 'Todas' ? products.length : products.filter((p) => p.categoria === item).length})</button>)}</div></div>
      <div className="product-grid">{filtered.map((product) => <article className="inventory-product" key={product.pk_id}><div className="product-image">{product.stock <= 5 && <span className="stock-badge">Stock bajo: {product.stock}</span>}{product.imagen_url ? <img src={product.imagen_url} alt={product.nombre} /> : <Package size={45} />}</div><div className="inventory-details"><div className="product-line"><div><b>{product.nombre}</b><small>{product.categoria || 'Sin categoría'}</small></div><strong>{currency.format(product.precio)}</strong></div><div className={`stock-line ${product.stock <= 5 ? 'critical' : product.stock <= 10 ? 'warning' : ''}`}><span><i />{product.stock} en stock</span><span>Disponible</span></div></div></article>)}</div>
      {!filtered.length && <p className="empty">No hay productos que coincidan con tu búsqueda.</p>}</section>{showProductForm && <ProductForm onClose={() => setShowProductForm(false)} onCreated={() => { setShowProductForm(false); loadInventory() }} />}</main></div>
}

function Metric({ title, value, icon: Icon }) { return <article className="metric-card"><div><p>{title}</p><h3>{value}</h3><span>Datos reales de tu negocio</span></div><div className="metric-icon"><Icon size={21} /></div></article> }
function Orders({ orders }) { return <section className="card orders-card"><div className="card-title"><h3>Órdenes recientes</h3><button>Ver todas</button></div>{orders.length ? orders.map((order) => <div className="order" key={order.pk_id}><div className="order-icon"><ShoppingBag size={18} /></div><div><b>{order.numero_pedido || `ORD-${order.pk_id}`}</b><small>{order.cliente_nombre || 'Cliente invitado'}</small></div><div className="order-total"><b>{currency.format(order.monto_total)}</b><span className={statusClass(order.estado)}>{order.estado}</span></div></div>) : <p className="empty">Aún no tienes pedidos registrados.</p>}</section> }
function TopProducts({ products }) { const maximum = Math.max(...products.map((product) => product.ventas), 1); return <section className="card products-card"><div className="card-title"><h3>Productos más vendidos</h3><button>Ver inventario</button></div>{products.length ? products.map((product, index) => <div className="product" key={product.nombre}><span className="rank">{index + 1}</span><div className="product-name"><b>{product.nombre}</b><small>{product.ventas} ventas</small></div><div className="product-total"><b>{currency.format(product.total)}</b><div><i style={{ width: `${(product.ventas / maximum) * 100}%` }} /></div></div></div>) : <p className="empty">Se mostrarán aquí al confirmar ventas.</p>}</section> }

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('crecio_admin_user')) } catch { return null } })
  const logout = () => { localStorage.removeItem('crecio_admin_token'); localStorage.removeItem('crecio_admin_user'); setUser(null) }
  const [view, setView] = useState('Inicio')
  if (!user) return <Login onSuccess={setUser} />
  if (view === 'Inventario') return <Inventory user={user} onLogout={logout} onNavigate={setView} />
  if (view === 'Ventas') return <Sales user={user} onLogout={logout} onNavigate={setView} />
  if (view === 'Clientes') return <Clients user={user} onLogout={logout} onNavigate={setView} />
  if (view === 'Marketing IA') return <Marketing user={user} onLogout={logout} onNavigate={setView} />
  return <Dashboard user={user} onLogout={logout} onNavigate={setView} />
}
