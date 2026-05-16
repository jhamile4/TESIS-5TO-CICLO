import { Camera, Megaphone, BarChart2, MessageCircle } from 'lucide-react'
import laptopImg from '../../assets/lapia.png'
import './HerramientasIA.css'

const herramientas = [
  {
    icon: <Camera size={20} color="#00B894" strokeWidth={1.5} />,
    titulo: 'Carga Mágica con IA',
    desc: 'Sube una foto de tu producto y la IA genera título, descripción y precio sugerido automáticamente.'
  },
  {
    icon: <Megaphone size={20} color="#00B894" strokeWidth={1.5} />,
    titulo: 'Marketing Automático',
    desc: 'Genera publicaciones para redes sociales, emails y campañas con un solo clic usando IA.'
  },
  {
    icon: <BarChart2 size={20} color="#00B894" strokeWidth={1.5} />,
    titulo: 'Análisis Predictivo',
    desc: 'Predice qué productos se venderán más y cuándo reponer tu inventario antes de quedarte sin stock.'
  },
  {
    icon: <MessageCircle size={20} color="#00B894" strokeWidth={1.5} />,
    titulo: 'Asistente Virtual',
    desc: 'Un chatbot con IA responde preguntas de tus clientes 24/7 directamente desde tu catálogo.'
  }
]

function HerramientasIA() {
  return (
    <section className="ia-section">
      <div className="ia-inner">

        <div className="ia-left">
          <h2 className="ia-title">
            Herramientas de IA<br />
            <em>que trabajan por ti</em>
          </h2>
          <p className="ia-sub">
            No necesitas ser experto en marketing ni tecnología.
            Nuestra IA hace el trabajo pesado para que tu te
            concentres en lo que sabes hacer.
          </p>

          <div className="ia-tools">
            {herramientas.map((h, i) => (
              <div className="ia-tool" key={i}>
                <div className="ia-tool-icon">{h.icon}</div>
                <div>
                  <h4>{h.titulo}</h4>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="ia-btn">Explorar Herramientas IA</button>
        </div>

        <div className="ia-right">
          <img src={laptopImg} alt="Panel CRECIO" className="ia-img" />
        </div>

      </div>
    </section>
  )
}

export default HerramientasIA