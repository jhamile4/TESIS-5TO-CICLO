// TiendaPage — Vista completa del negocio para el cliente
// Carga el negocio por slug desde negociosData, gestiona el carrito y abre WhatsApp con el pedido
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TiendaHero from './components/TiendaHero'
import ProductoGrid from './components/ProductoGrid'
import SidebarNegocio from './components/SidebarNegocio'
import ResenasList from './components/ResenasList'
import Carrito from './components/Carrito'
import { negocios } from '../../data/negociosData'
import './TiendaPage.css'

function TiendaPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const negocio = negocios.find(n => n.slug === slug)

  // Carrito: se carga desde localStorage al entrar y se guarda cada vez que cambia
  const claveCarrito = 'crecio_carrito_' + slug
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(claveCarrito)
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [tabActivo, setTabActivo] = useState('productos')
  const [imgActiva, setImgActiva] = useState(0)
  const [fabBottom, setFabBottom] = useState(24) // distancia desde abajo en px
  const footerRef = useRef(null)                  // referencia al footer

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito))
  }, [carrito, claveCarrito])

  // Sube el botón flotante cuando el footer entra en pantalla
  // así siempre queda en la zona blanca con su margen
  useEffect(() => {
    const MARGEN = 24 // px de separación del borde inferior
    const verificarPosicion = () => {
      if (!footerRef.current) return
      const footerTop = footerRef.current.getBoundingClientRect().top
      const botonAltura = 54 + MARGEN // altura del botón + margen
      if (footerTop < window.innerHeight - MARGEN) {
        // El footer ya entró en pantalla: subir el botón para que no lo tape
        const nuevoBottom = window.innerHeight - footerTop + MARGEN
        setFabBottom(nuevoBottom)
      } else {
        setFabBottom(MARGEN)
      }
    }
    window.addEventListener('scroll', verificarPosicion)
    verificarPosicion()
    return () => window.removeEventListener('scroll', verificarPosicion)
  }, [])

  if (!negocio) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Tienda no encontrada</h2>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  // Agrega un producto al carrito; si ya existe, incrementa su cantidad
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.nombre === producto.nombre)
      if (existe) {
        return prev.map(p => p.nombre === producto.nombre ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }

  // Modifica la cantidad de un ítem (delta = +1 o -1, mínimo 1)
  const cambiarCantidad = (nombre, delta) => {
    setCarrito(prev =>
      prev.map(p => p.nombre === nombre ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p)
    )
  }

  const eliminarDelCarrito = (nombre) => {
    setCarrito(prev => prev.filter(p => p.nombre !== nombre))
  }

  // Totales calculados a partir del estado del carrito
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0)
  const subtotal   = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  // Abre WhatsApp con el resumen del pedido completo
  const pedidoWhatsApp = () => {
    const items = carrito.map(p => `${p.cantidad}x ${p.nombre} S/${p.precio}`).join(', ')
    const msg   = `Hola! Quiero hacer un pedido: ${items}. Total: S/${subtotal}`
    window.open(`https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="tienda-page">
      <Navbar />

      <TiendaHero
        negocio={negocio}
        imgActiva={imgActiva}
        setImgActiva={setImgActiva}
        totalItems={totalItems}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <div className="tienda-body">
        <div className="tienda-main">

          <div className="tienda-tabs">
            <button
              className={tabActivo === 'productos' ? 'tienda-tab active' : 'tienda-tab'}
              onClick={() => setTabActivo('productos')}
            >
              Productos ({negocio.productos.length})
            </button>
            <button
              className={tabActivo === 'resenas' ? 'tienda-tab active' : 'tienda-tab'}
              onClick={() => setTabActivo('resenas')}
            >
              Reseñas ({negocio.reviews.length})
            </button>
          </div>

          {tabActivo === 'productos' && (
            <ProductoGrid
              productos={negocio.productos}
              onAgregar={agregarAlCarrito}
              whatsapp={negocio.whatsapp}
            />
          )}

          {tabActivo === 'resenas' && (
            <ResenasList reviews={negocio.reviews} />
          )}

          {/* Sección Google Maps */}
          <div className="tienda-mapa">
            <h3 className="tienda-mapa-titulo">📍 Ubicación</h3>
            <iframe
              title="Mapa del negocio"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(negocio.direccion)}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 'none', borderRadius: '12px', display: 'block' }}
              allowFullScreen
              loading="lazy"
            />
          </div>

        </div>

        <SidebarNegocio
          negocio={negocio}
          totalItems={totalItems}
          subtotal={subtotal}
          onAbrirCarrito={() => setCarritoAbierto(true)}
          onWhatsApp={pedidoWhatsApp}
        />
      </div>

      {carritoAbierto && (
        <Carrito
          carrito={carrito}
          subtotal={subtotal}
          onCerrar={() => setCarritoAbierto(false)}
          onCambiar={cambiarCantidad}
          onEliminar={eliminarDelCarrito}
          onWhatsApp={pedidoWhatsApp}
        />
      )}

      {/* Botón flotante del carrito — sube dinámicamente cuando el footer entra en pantalla */}
      {totalItems > 0 && (
        <button
          className="tienda-fab-carrito"
          style={{ bottom: `${fabBottom}px` }}
          onClick={() => setCarritoAbierto(true)}
        >
          <ShoppingCart size={22} color="#111" strokeWidth={2.5} />
          <span className="tienda-fab-badge">{totalItems}</span>
        </button>
      )}

      {/* div de referencia para detectar cuándo el footer entra en pantalla */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  )
}

export default TiendaPage
