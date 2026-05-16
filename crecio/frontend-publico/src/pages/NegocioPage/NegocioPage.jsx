import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './NegocioPage.css'

// Número de WhatsApp para recibir los pedidos
const WHATSAPP_NUMERO = '51936780724'

// Retorna un emoji según la categoría del producto
const emojiCategoria = (cat = '') => {
  const c = cat.toLowerCase()
  if (c.includes('ropa') || c.includes('textil') || c.includes('moda')) return '👕'
  if (c.includes('pan') || c.includes('pasteler') || c.includes('dulce')) return '🍞'
  if (c.includes('tecno') || c.includes('celular') || c.includes('electr')) return '📱'
  if (c.includes('restaur') || c.includes('comida') || c.includes('pollería')) return '🍽️'
  if (c.includes('flor')) return '💐'
  return '🛍️'
}

export default function NegocioPage() {
  const { id } = useParams()

  const [negocio,  setNegocio]  = useState(null)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState('')
  const [pedidoMsg, setPedidoMsg] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resNeg, resProd] = await Promise.all([
          fetch(`http://localhost:3001/api/negocios/${id}`),
          fetch(`http://localhost:3001/api/productos/negocio/${id}`),
        ])
        if (!resNeg.ok) throw new Error('Negocio no encontrado')
        const dataNeg  = await resNeg.json()
        const dataProd = await resProd.json()
        setNegocio(dataNeg)
        setProductos(Array.isArray(dataProd) ? dataProd : [])
      } catch (e) {
        setError(e.message || 'Error al cargar el negocio')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handlePedir = async (producto) => {
    const token = localStorage.getItem('crecio_token')

    if (!token) {
      alert('Inicia sesión para realizar un pedido')
      window.location.href = '/login'
      return
    }

    try {
      // Guarda el pedido en la base de datos
      await fetch('http://localhost:3001/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fk_producto_id: producto.pk_id,
          fk_negocio_id:  negocio.pk_id,
        }),
      })

      // Abre WhatsApp con el mensaje del producto
      const mensaje = encodeURIComponent(
        `Hola, estoy interesado en "${producto.nombre}" (S/ ${producto.precio}). ¿Está disponible?`
      )
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`, '_blank')

      setPedidoMsg(`✅ Pedido de "${producto.nombre}" registrado. Abriendo WhatsApp...`)
      setTimeout(() => setPedidoMsg(''), 4000)
    } catch {
      alert('Ocurrió un error al registrar el pedido. Intenta de nuevo.')
    }
  }

  if (cargando) {
    return (
      <div className="neg-estado">
        <div className="neg-spinner" />
        <p>Cargando negocio...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="neg-estado">
        <p className="neg-error-msg">{error}</p>
        <button className="neg-btn-volver" onClick={() => window.location.href = '/'}>
          ← Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="neg-pagina">

      {/* Botón volver */}
      <button className="neg-btn-volver" onClick={() => window.location.href = '/'}>
        ← Volver al inicio
      </button>

      {/* Cabecera del negocio */}
      <div className="neg-cabecera">
        <div className="neg-avatar">
          {emojiCategoria(negocio.categoria)}
        </div>
        <div className="neg-info">
          <span className="neg-categoria">{negocio.categoria}</span>
          <h1 className="neg-nombre">{negocio.nombre}</h1>
          <p className="neg-descripcion">{negocio.descripcion}</p>
          <div className="neg-detalles">
            <span>📍 {[negocio.direccion, negocio.distrito].filter(Boolean).join(', ')}</span>
            {negocio.whatsapp && (
              <span>📞 +{negocio.whatsapp}</span>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de confirmación de pedido */}
      {pedidoMsg && <div className="neg-pedido-ok">{pedidoMsg}</div>}

      {/* Lista de productos */}
      <div className="neg-seccion">
        <h2 className="neg-seccion-titulo">Productos disponibles</h2>

        {productos.length === 0 ? (
          <p className="neg-vacio">Este negocio aún no tiene productos publicados.</p>
        ) : (
          <div className="neg-grid">
            {productos.map((p) => (
              <div key={p.pk_id} className="neg-producto">
                <div className="neg-producto-emoji">
                  {emojiCategoria(p.categoria)}
                </div>
                <div className="neg-producto-info">
                  <p className="neg-producto-nombre">{p.nombre}</p>
                  <p className="neg-producto-desc">{p.descripcion}</p>
                  <p className="neg-producto-precio">S/ {parseFloat(p.precio).toFixed(2)}</p>
                </div>
                <button
                  className="neg-btn-whatsapp"
                  onClick={() => handlePedir(p)}
                >
                  🛒 Pedir por WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
