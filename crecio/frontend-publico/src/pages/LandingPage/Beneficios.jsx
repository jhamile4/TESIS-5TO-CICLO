import './Beneficios.css'
function Beneficios() {
  const beneficios = [
    {
      icon: '📸',
      titulo: 'Catálogo con IA',
      desc: 'Crea tus productos con catálogo IA, regístralos en minutos.'
    },
    {
      icon: '💬',
      titulo: 'Ventas por WhatsApp',
      desc: 'Ventas por WhatsApp y directo con tu catálogo, gestiona tus ventas fácil.'
    },
    {
      icon: '🛡️',
      titulo: 'Inclusión Financiera',
      desc: 'Inclusión Financiera para tu negocio, piensa en grande y gana más.'
    }
  ]

  return (
    <section className="benefits">
      <div className="benefits-inner">

        <div className="benefits-left">
          <div className="section-label" style= {{ color: 'var(--dark)' }}>Beneficios</div>
          <div className="benefit-list">
            {beneficios.map((b, i) => (
              <div className="benefit-item" key={i}>
                <div className="benefit-item-icon">{b.icon}</div>
                <div>
                  <h4>{b.titulo}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="benefits-right">
          <div className="section-label"style= {{ color: 'var(--dark)' }}>Crecemos contigo</div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-num">+2,400</div>
              <div className="stat-label">Negocios activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">S/8M+</div>
              <div className="stat-label">En ventas generadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">98%</div>
              <div className="stat-label">Satisfacción</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Beneficios