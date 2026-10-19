import { API_URL as BASE_URL, PANEL_URL } from '../config/env'

// Abre el panel con la misma cuenta. El token viaja en el fragmento (#), que el
// navegador no envía a ningún servidor, y el panel lo borra de la URL al leerlo.
export function irAlPanel() {
  const token = localStorage.getItem('token_comprador')
  window.location.assign(token ? `${PANEL_URL}/#sesion=${encodeURIComponent(token)}` : PANEL_URL)
}

// Si llegamos desde el panel ("Ir a comprar"), toma esa sesión y limpia la URL
export async function consumirSesionDeUrl() {
  const match = window.location.hash.match(/sesion=([^&]+)/)
  if (!match) return

  const token = decodeURIComponent(match[1])
  window.history.replaceState(null, '', window.location.pathname + window.location.search)

  try {
    const res = await fetch(`${BASE_URL}/auth/session`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return
    const { cliente } = await res.json()

    localStorage.setItem('token',           token)
    localStorage.setItem('token_comprador', token)
    localStorage.setItem('cliente',         JSON.stringify(cliente))
    localStorage.setItem('comprador',       JSON.stringify({ ...cliente, esEmprendedor: Boolean(cliente.negocioId) }))
  } catch {
    // Sin conexión: se queda con la sesión que ya tenía
  }
}
