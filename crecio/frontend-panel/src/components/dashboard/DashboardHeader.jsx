export default function DashboardHeader({ businessName }) {
  return (
    <div className="dash-header-welcome">
      <h2>¡Buenos días, equipo de {businessName || 'tu negocio'}!</h2>
      <p>Aquí está el resumen de tu negocio hoy</p>
    </div>
  )
}
