import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TiendaHero from './components/TiendaHero'
import ProductoGrid from './components/ProductoGrid'
import SidebarNegocio from './components/SidebarNegocio'
import ResenasList from './components/ResenasList'
import Carrito from './components/Carrito'
import { getNegocio, getProductos, getResenas, getGaleria } from '../../services/apiPublico'
import './TiendaPage.css'

function TiendaPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [negocio, setNegocio] = useState(null)
  const [productos, setProductos] = useState([])
  const [resenas, setResenas] = useState([])
  const [galeria, setGaleria] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [tabActivo, setTabActivo] = useState('productos')
  const [imgActiva, setImgActiva] = useState(0)

  useEffect(() => {
    setCargando(true)
    setError(null)
    Promise.all([
      getNegocio(id),
      getProductos(id),
      getResenas(id),
      getGaleria(id),
    ])
      .then(([neg, prods, rese, gal]) => {
        setNegocio(neg)
        setProductos(prods)
        setResenas(rese)
        setGaleria(gal.length > 0 ? gal : [neg.img])
        setCargando(false)
      })
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar la tienda')
        setCargando(false)
      })
  }, [id])

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

  const cambiarCantidad = (nombre, delta) => {
    setCarrito(prev =>
      prev.map(p => p.nombre === nombre ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p)
    )
  }

  const eliminarDelCarrito = (nombre) => {
    setCarrito(prev => prev.filter(p => p.nombre !== nombre))
  }

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0)
  const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  const pedidoWhatsApp = () => {
    const items = carrito.map(p => p.cantidad + 'x ' + p.nombre + ' S/' + p.precio).join(', ')
    const msg = 'Hola! Quiero hacer un pedido: ' + items + '. Total: S/' + subtotal
    window.open('https://wa.me/' + negocio.whatsapp + '?text=' + encodeURIComponent(msg), '_blank')
  }

  if (cargando) {
    return (
      <div className="tienda-page">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--gray-3)', fontSize: '15px' }}>
          Cargando tienda...
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !negocio) {
    return (
      <div className="tienda-page">
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>{error || 'Tienda no encontrada'}</h2>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="tienda-page">
      <Navbar />

      <TiendaHero
        negocio={{ ...negocio, galeria }}
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
              Productos ({productos.length})
            </button>
            <button
              className={tabActivo === 'resenas' ? 'tienda-tab active' : 'tienda-tab'}
              onClick={() => setTabActivo('resenas')}
            >
              Resenas ({resenas.length})
            </button>
          </div>

          {tabActivo === 'productos' && (
            <ProductoGrid
              productos={productos}
              onAgregar={agregarAlCarrito}
              whatsapp={negocio.whatsapp}
            />
          )}

          {tabActivo === 'resenas' && (
            <ResenasList reviews={resenas} />
          )}

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

      <Footer />
    </div>
  )
}

export default TiendaPage
