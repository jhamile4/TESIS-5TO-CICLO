// Sección de testimonios de la LandingPage
// Muestra 3 testimonios de negocios que usan CRECIO con calificación de 5 estrellas
import { Star } from 'lucide-react'
import t1 from '../../assets/t1.jpg'
import t2 from '../../assets/t2.jpg'
import t3 from '../../assets/t3.jpg'
import './Testimonios.css'

const testimonios = [
  {
    img: t1,
    nombre: 'María Quispe',
    negocio: 'Boutique Valentina, Lima',
    texto: '"Antes vendía solo por WhatsApp. Con CRECIO tengo mi catálogo online y mis ventas subieron 60% en el primer mes. La IA me ayuda a escribir las descripciones de mis productos."'
  },
  {
    img: t2,
    nombre: 'Carlos Mendoza',
    negocio: 'Ferretería Don Carlos, Arequipa',
    texto: '"Nunca pensé que podría tener una tienda online. CRECIO lo hizo súper fácil. Ahora mis clientes pueden ver mi inventario desde su celular y hacer pedidos."'
  },
  {
    img: t3,
    nombre: 'Rosa Flores',
    negocio: 'Panadería La Tradición, Cusco',
    texto: '"El buscador de CRECIO me trajo clientes nuevos del barrio que ni sabían que existía. Ahora tengo pedidos anticipados para el fin de semana."'
  }
]

function Testimonios() {
  return (
    <section className="testimonios">
      <div className="testimonios-inner">

        <h2 className="testi-title">
          Negocios que ya{' '}
          <em>crecieron con nosotros</em>
        </h2>

        <div className="testi-grid">
          {testimonios.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="testi-stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="testi-texto">{t.texto}</p>
              <div className="testi-autor">
                <img src={t.img} alt={t.nombre} className="testi-avatar" />
                <div>
                  <div className="testi-nombre">{t.nombre}</div>
                  <div className="testi-negocio">{t.negocio}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonios