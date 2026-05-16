import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getMyOrders } from '../../services/api'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate                = useNavigate()
  const [usuario, setUsuario]   = useState(null)
  const [pedidos, setPedidos]   = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [me, orders] = await Promise.all([getMe(), getMyOrders()])
        setUsuario(me)
        setPedidos(orders)
      } catch {
        // Token inválido o expirado — limpiar sesión y redirigir
        localStorage.removeItem('crecio_token')
        window.location.href = '/login'
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem('crecio_token')
    window.location.href = '/'
  }

  // Genera iniciales del nombre para el avatar
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric',
    })

  if (cargando) {
    return (
      <div className="perfil-estado">
        <div className="perfil-spinner" />
        <p>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="perfil-pagina">

      {/* Botón para regresar al inicio */}
      <button className="perfil-btn-volver" onClick={() => window.location.href = '/'}>
        ← Volver al inicio
      </button>

      {/* Tarjeta de usuario */}
      <div className="perfil-card">
        <div className="perfil-avatar">{iniciales}</div>
        <div className="perfil-info">
          <h1 className="perfil-nombre">{usuario.nombre}</h1>
          <p className="perfil-email">{usuario.email}</p>
          <span className="perfil-rol">{usuario.rol}</span>
          <p className="perfil-total-pedidos">
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} realizados
          </p>
        </div>
        <button className="perfil-btn-cerrar" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {/* Historial de pedidos */}
      <div className="perfil-seccion">
        <h2 className="perfil-seccion-titulo">Mis pedidos por WhatsApp</h2>

        {pedidos.length === 0 ? (
          <div className="perfil-vacio">
            <p>Aún no has realizado ningún pedido.</p>
            <button className="perfil-btn-explorar" onClick={() => navigate('/')}>
              Explorar negocios
            </button>
          </div>
        ) : (
          <div className="perfil-lista">
            {pedidos.map((p) => (
              <div key={p.pk_id} className="perfil-pedido">
                {/* Placeholder con emoji — sin links externos que puedan fallar */}
                <div className="perfil-pedido-img-placeholder">🛍️</div>
                <div className="perfil-pedido-info">
                  <p className="perfil-pedido-producto">{p.producto}</p>
                  <p className="perfil-pedido-negocio">{p.negocio}</p>
                  <p className="perfil-pedido-fecha">{formatFecha(p.created_at)}</p>
                </div>
                <p className="perfil-pedido-precio">
                  S/ {parseFloat(p.precio || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
