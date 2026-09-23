import { useEffect, useState } from 'react'
import { CircleDollarSign, ClipboardList, ExternalLink, Package, Users } from 'lucide-react'
import { getResumen } from '../services/apiAdmin'
import { PUBLIC_URL } from '../config/env'
import { currency, statusClass } from '../utils/formatters'

function Metric({ title, value, icon: Icon }) { return <article className="metric-card"><div><p>{title}</p><h3>{value}</h3><span>Datos reales de tu negocio</span></div><div className="metric-icon"><Icon size={21} /></div></article> }
function Orders({ orders }) { return <section className="card orders-card"><div className="card-title"><h3>Órdenes recientes</h3></div>{orders.length ? orders.map((order) => <div className="order" key={order.pk_id}><div className="order-icon"><ClipboardList size={18} /></div><div><b>{order.numero_pedido || `ORD-${order.pk_id}`}</b><small>{order.cliente_nombre || 'Cliente invitado'}</small></div><div className="order-total"><b>{currency.format(order.monto_total)}</b><span className={statusClass(order.estado)}>{order.estado}</span></div></div>) : <p className="empty">Aún no tienes pedidos registrados.</p>}</section> }

export default function DashboardPage() {
  const [data, setData] = useState(null); const [error, setError] = useState('')
  useEffect(() => { getResumen().then(setData).catch((err) => setError(err.message)) }, [])
  const metrics = data?.metricas || { ventasTotales: 0, ordenes: 0, clientes: 0, productos: 0 }
  const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; const max = Math.max(...(data?.ventasSemana?.map((item) => item.total) || [1]), 1)
  return <section className="content"><div className="welcome"><div><h2>¡Buenos días, equipo de {data?.negocio?.nombre || 'tu negocio'}!</h2><p>Aquí está el resumen de tu negocio hoy.</p></div><a href={PUBLIC_URL} target="_blank" rel="noreferrer">Ver mi tienda <ExternalLink size={15} /></a></div>{error && <div className="alert">{error}</div>}<div className="metrics"><Metric title="Ventas totales" value={currency.format(metrics.ventasTotales)} icon={CircleDollarSign} /><Metric title="Órdenes" value={metrics.ordenes} icon={ClipboardList} /><Metric title="Clientes" value={metrics.clientes} icon={Users} /><Metric title="Productos" value={metrics.productos} icon={Package} /></div><div className="dashboard-grid main-grid"><section className="card chart-card"><div className="card-title"><h3>Ventas de la semana</h3></div><div className="bar-chart">{(data?.ventasSemana || []).map((item) => <div className="bar-item" key={item.fecha}><span className="bar-value">{item.total ? currency.format(item.total) : ''}</span><div className="bar-track"><div className="bar" style={{ height: `${Math.max(item.total ? item.total / max * 100 : 0, 3)}%` }} /></div><span>{labels[new Date(`${item.fecha}T12:00:00`).getDay()]}</span></div>)}</div></section><section className="card quick-card"><h3>Acciones rápidas</h3><p className="muted">Usa Inventario para registrar productos y Marketing IA para preparar contenido.</p></section></div><div className="dashboard-grid bottom-grid"><Orders orders={data?.pedidosRecientes || []} /></div></section>
}
