// Cabecera visual de la TiendaPage
// Muestra la imagen principal del negocio, galería de thumbnails, rating, dirección y botón del carrito
import './TiendaHero.css'
import { MapPin, Star } from 'lucide-react'

function TiendaHero({ negocio, imgActiva, setImgActiva, totalItems, onAbrirCarrito }) {
  return (
    <div className="tienda-hero">
      {/* Imagen principal — cambia según el thumbnail seleccionado */}
      <div className="tienda-hero-img-wrap">
        <img src={negocio.galeria[imgActiva]} alt={negocio.nombre} className="tienda-hero-img" />
        <div className="tienda-hero-overlay">
          <span className="tienda-hero-cat">{negocio.categoria}</span>
          <h1 className="tienda-hero-nombre">{negocio.nombre}</h1>
          <div className="tienda-hero-meta">
            <span><Star size={14} fill="#F59E0B" color="#F59E0B" /> {negocio.rating} ({negocio.resenas} reseñas)</span>
            <span><MapPin size={14} color="white" /> {negocio.direccion}</span>
          </div>
        </div>
      </div>

      {/* Galería de fotos del negocio — thumbnails clickeables */}
      <div className="tienda-galeria">
        {negocio.galeria.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={'foto ' + (i + 1)}
            className={i === imgActiva ? 'tienda-galeria-img active' : 'tienda-galeria-img'}
            onClick={() => setImgActiva(i)}
          />
        ))}
      </div>

    </div>
  )
}

export default TiendaHero