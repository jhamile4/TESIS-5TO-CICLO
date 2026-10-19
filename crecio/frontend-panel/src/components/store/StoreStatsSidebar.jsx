import { ShoppingBag, MessageSquare, Star } from 'lucide-react'

export default function StoreStatsSidebar({ estadisticas }) {
  const e = estadisticas || {}
  const filas = [
    [ShoppingBag, 'text-teal', 'Pedidos online (mes)', e.pedidosOnlineMes ?? 0],
    [MessageSquare, 'text-green', 'Pedidos por WhatsApp (mes)', e.pedidosWhatsappMes ?? 0],
    [Star, 'text-blue', 'Reseñas', e.resenas ? `${e.resenas} · ${Number(e.rating).toFixed(1)} ★` : 'Sin reseñas'],
  ]

  return (
    <div className="store-stats-sidebar">
      <div className="status-card-box">
        <h4>Estado de tu tienda</h4>
        <div className={`status-pill-badge ${e.activa === false ? 'yellow' : 'green'}`}>
          <span className="status-dot"></span> {e.activa === false ? 'Oculta' : 'Publicada'}
        </div>
      </div>

      <div className="stats-card-box">
        <h4>Estadísticas</h4>
        {filas.map(([Icon, clase, texto, valor]) => (
          <div key={texto} className="stat-metric-row">
            <div className="stat-label">
              <Icon size={14} className={clase} />
              <span>{texto}</span>
            </div>
            <strong>{valor}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
