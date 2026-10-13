export default function ConfigQrTab({ nombre }) {
  const slug = nombre ? nombre.toLowerCase().replace(/\s+/g, '-') : 'mi-tienda'
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://crecio.app/${slug}`

  return (
    <div className="config-card config-card-centered">
      <h4 className="config-card-title flex-center">Código QR de tu Negocio</h4>
      <p className="config-card-subtitle text-center">
        Los clientes pueden escanear este código QR para entrar directamente a tu catálogo web.
      </p>
      <div className="qr-code-box">
        <img src={qrUrl} alt="QR Code" className="qr-code-img" />
        <strong className="qr-slug-text">
          crecio.app/{slug}
        </strong>
      </div>
    </div>
  )
}
