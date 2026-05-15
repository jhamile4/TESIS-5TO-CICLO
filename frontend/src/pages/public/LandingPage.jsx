import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const beneficios = [
  {
    icono: '🤖',
    titulo: 'Catálogo con IA',
    desc: 'Crea tus productos con catálogo IA, regístralos en minutos sin conocimientos técnicos.',
  },
  {
    icono: '💬',
    titulo: 'Ventas por WhatsApp',
    desc: 'Tus clientes te contactan directo por WhatsApp desde tu catálogo digital.',
  },
  {
    icono: '📈',
    titulo: 'Inclusión Financiera',
    desc: 'Acepta pagos con tarjeta, Yape y más. Piensa en grande y gana más.',
  },
];

const herramientas = [
  {
    icono: '✨',
    titulo: 'Carga Mágica con IA',
    desc: 'Sube una foto de tu producto y la IA genera título, descripción y precio sugerido automáticamente.',
  },
  {
    icono: '📢',
    titulo: 'Marketing Automático',
    desc: 'Genera publicaciones para redes sociales, emails y campañas con un solo clic usando IA.',
  },
  {
    icono: '🔮',
    titulo: 'Análisis Predictivo',
    desc: 'Predice qué productos se venderán más y cuándo reponer tu inventario antes de quedarte sin stock.',
  },
  {
    icono: '🤝',
    titulo: 'Asistente Virtual',
    desc: 'Un chatbot con IA responde preguntas de tus clientes 24/7 directamente desde tu catálogo.',
  },
];

const pasos = [
  {
    num: '01',
    titulo: 'Crea tu tienda',
    desc: 'Regístrate en minutos, personaliza tu perfil y configura tu catálogo con fotos, precios y descripciones. Sin conocimientos técnicos.',
  },
  {
    num: '02',
    titulo: 'La IA trabaja por ti',
    desc: 'Nuestra IA genera descripciones de productos, sugiere precios competitivos y crea campañas de marketing automáticamente.',
  },
  {
    num: '03',
    titulo: 'Vende y crece',
    desc: 'Recibe pedidos, gestiona tu inventario y analiza tus ventas desde un panel simple. Tus clientes te encuentran en CRECIO.',
  },
];

const stats = [
  { valor: '+2,400', label: 'Negocios activos' },
  { valor: 'S/ 8M+', label: 'En ventas generadas' },
  { valor: '98%',    label: 'Satisfacción' },
];

const planes = [
  {
    nombre: 'Gratis',
    precio: 'S/ 0',
    desc: 'Para empezar a digitalizarte sin costo.',
    items: ['20 productos', 'Catálogo digital', 'Pedidos por WhatsApp'],
    destacado: false,
  },
  {
    nombre: 'Básico',
    precio: 'S/ 49',
    desc: 'Ideal para negocios que quieren crecer.',
    items: ['50 productos', 'Todo lo de Gratis', 'Soporte prioritario'],
    destacado: false,
  },
  {
    nombre: 'Pro',
    precio: 'S/ 129',
    desc: 'El favorito de los negocios establecidos.',
    items: ['Productos ilimitados', 'Pagos con tarjeta', 'Analíticas avanzadas'],
    destacado: true,
  },
  {
    nombre: 'Empresarial',
    precio: 'A medida',
    desc: 'Para negocios con múltiples sucursales.',
    items: ['Todo lo de Pro', 'Multi-sucursal', 'Gerente de cuenta'],
    destacado: false,
  },
];

const testimonios = [
  {
    texto: 'Antes vendía solo por WhatsApp. Con CRECIO tengo mi catálogo online y mis ventas subieron 60% en el primer mes. La IA me ayuda a escribir las descripciones.',
    nombre: 'María Quispe',
    negocio: 'Boutique Valentina, Lima',
  },
  {
    texto: 'Nunca pensé que podría tener una tienda online. CRECIO lo hizo súper fácil. Ahora mis clientes pueden ver mi inventario desde su celular y hacer pedidos.',
    nombre: 'Carlos Mamani',
    negocio: 'Panadería La Tradición, Lima',
  },
  {
    texto: 'El buscador de CRECIO me trajo clientes nuevos del barrio que ni sabían que existía. Ahora tengo pedidos anticipados para el fin de semana.',
    nombre: 'Rosa Flores',
    negocio: 'Tech Repair Perú, Lima',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollA = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className={styles.main}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitulo}>
          Transforma tu negocio informal en una empresa digital en 5 minutos
        </h1>
        <p className={styles.heroSubtitulo}>
          Usa Inteligencia Artificial para crear tu catálogo, gestionar tus ventas y
          aceptar pagos con tarjeta o WhatsApp. Todo desde tu celular.
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.btnPrimario} onClick={() => navigate('/register')}>
            Empieza Gratis Ahora
          </button>
          <button className={styles.btnOutline} onClick={() => scrollA('como-funciona')}>
            Ver cómo funciona
          </button>
        </div>
        <div className={styles.heroChips}>
          <span className={styles.chip}>✓ Sin costo inicial</span>
          <span className={styles.chip}>✓ Sin tarjeta de crédito</span>
          <span className={styles.chip}>✓ Cancela cuando quieras</span>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className={styles.beneficios}>
        <p className={styles.seccionEtiqueta}>Crecemos contigo</p>
        <div className={styles.beneficiosGrid}>
          {beneficios.map((b) => (
            <div key={b.titulo} className={styles.beneficioCard}>
              <span className={styles.beneficioIcono}>{b.icono}</span>
              <h3 className={styles.beneficioTitulo}>{b.titulo}</h3>
              <p className={styles.beneficioDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValor}>{s.valor}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Descubre negocios ── */}
      <section className={styles.descubre}>
        <h2 className={styles.seccionTitulo}>Descubre negocios en tu localidad</h2>
        <p className={styles.seccionSub}>
          Encuentra tiendas, restaurantes y servicios cerca de ti. Todos verificados y con catálogo digital.
        </p>
        <button className={styles.btnPrimario} onClick={() => navigate('/marketplace')}>
          Explorar negocios
        </button>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className={styles.comoFunciona}>
        <h2 className={styles.seccionTitulo}>Tres pasos para digitalizar tu negocio</h2>
        <p className={styles.seccionSub}>No necesitas saber de tecnología. CRECIO hace el trabajo difícil por ti.</p>
        <div className={styles.pasosGrid}>
          {pasos.map((paso) => (
            <div key={paso.num} className={styles.pasoCard}>
              <span className={styles.pasoNum}>{paso.num}</span>
              <h3 className={styles.pasoTitulo}>{paso.titulo}</h3>
              <p className={styles.pasoDesc}>{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Herramientas IA ── */}
      <section id="ia-herramientas" className={styles.herramientas}>
        <h2 className={styles.seccionTituloBlanco}>Herramientas de IA que trabajan por ti</h2>
        <p className={styles.seccionSubBlanco}>
          No necesitas ser experto en marketing ni tecnología. Nuestra IA hace el trabajo pesado.
        </p>
        <div className={styles.herramientasGrid}>
          {herramientas.map((h) => (
            <div key={h.titulo} className={styles.herramientaCard}>
              <span className={styles.herramientaIcono}>{h.icono}</span>
              <h3 className={styles.herramientaTitulo}>{h.titulo}</h3>
              <p className={styles.herramientaDesc}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="precios" className={styles.planes}>
        <h2 className={styles.seccionTitulo}>Planes para cada etapa de tu negocio</h2>
        <p className={styles.seccionSub}>Empieza gratis y escala cuando estés listo. Sin sorpresas ni costos ocultos.</p>
        <div className={styles.planesGrid}>
          {planes.map((p) => (
            <div key={p.nombre} className={`${styles.planCard} ${p.destacado ? styles.planDestacado : ''}`}>
              {p.destacado && <span className={styles.planBadge}>Más popular</span>}
              <h3 className={styles.planNombre}>{p.nombre}</h3>
              <p className={styles.planPrecio}>{p.precio}<span className={styles.planMes}>{p.precio !== 'A medida' ? '/mes' : ''}</span></p>
              <p className={styles.planDesc}>{p.desc}</p>
              <ul className={styles.planItems}>
                {p.items.map((item) => (
                  <li key={item} className={styles.planItem}>✓ {item}</li>
                ))}
              </ul>
              <button
                className={p.destacado ? styles.btnPrimario : styles.btnOutline}
                onClick={() => navigate('/register')}
              >
                Empezar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className={styles.testimonios}>
        <h2 className={styles.seccionTitulo}>Lo que dicen nuestros emprendedores</h2>
        <div className={styles.testimoniosGrid}>
          {testimonios.map((t) => (
            <div key={t.nombre} className={styles.testimonioCard}>
              <p className={styles.testimonioTexto}>"{t.texto}"</p>
              <div className={styles.testimonioAutor}>
                <span className={styles.testimonioNombre}>{t.nombre}</span>
                <span className={styles.testimonioNegocio}>{t.negocio}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p className={styles.footerLogo}>CRECIO</p>
        <p>© 2026 CRECIO. Todos los derechos reservados.</p>
        <div className={styles.footerLinks}>
          <span>Privacidad</span>
          <span>Términos</span>
          <span>Contacto</span>
        </div>
      </footer>

    </main>
  );
}
