import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import t1 from '../../assets/t1.jpg'
import t2 from '../../assets/t2.jpg'
import t3 from '../../assets/t3.jpg'
import './Testimonios.css'

const testimonios = [
  {
    img: t1,
    nombre: 'Maria Quispe',
    negocio: 'Boutique Valentina, Lima',
    estrellas: 5,
    texto: 'Antes vendia solo por WhatsApp. Con CRECIO tengo mi catalogo online y mis ventas subieron 60% en el primer mes. La IA me ayuda a escribir las descripciones de mis productos.'
  },
  {
    img: t2,
    nombre: 'Carlos Mendoza',
    negocio: 'Ferreteria Don Carlos, Arequipa',
    estrellas: 5,
    texto: 'Nunca pense que podria tener una tienda online. CRECIO lo hizo super facil. Ahora mis clientes pueden ver mi inventario desde su celular y hacer pedidos.'
  },
  {
    img: t3,
    nombre: 'Rosa Flores',
    negocio: 'Panaderia La Tradicion, Cusco',
    estrellas: 5,
    texto: 'El buscador de CRECIO me trajo clientes nuevos del barrio que ni sabian que existia. Ahora tengo pedidos anticipados para el fin de semana.'
  }
]

function Testimonios() {
  const [actual, setActual] = useState(0)

  const anterior = () => setActual(prev => prev === 0 ? testimonios.length - 1 : prev - 1)
  const siguiente = () => setActual(prev => prev === testimonios.length - 1 ? 0 : prev + 1)

  const t = testimonios[actual]

  return (
    <section className="testimonios">
      <div className="testimonios-inner">

        <h2 className="testi-title">
          Negocios que ya{' '}
          <em>crecieron con nosotros</em>
        </h2>

        <div className="testi-carrusel">
          <button className="testi-nav testi-nav-left" onClick={anterior}>
            <ChevronLeft size={20} color="var(--dark)" />
          </button>

          <div className="testi-card">
            <div className="testi-quote">❝</div>
            <div className="testi-stars">
              {Array.from({ length: t.estrellas }).map((_, i) => (
                <span key={i}>★</span>
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

          <button className="testi-nav testi-nav-right" onClick={siguiente}>
            <ChevronRight size={20} color="var(--dark)" />
          </button>
        </div>

        <div className="testi-dots">
          {testimonios.map((_, i) => (
            <button
              key={i}
              className={i === actual ? 'testi-dot active' : 'testi-dot'}
              onClick={() => setActual(i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonios