// Estado del pedido que ve el cliente (lo actualiza el negocio desde su panel)
const ESTADOS = {
  pago_pendiente: { label: 'Pago pendiente',     color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   icon: 'ri-error-warning-line' },
  recibido:       { label: 'Recibido',           color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200',  icon: 'ri-file-list-3-line' },
  preparando:     { label: 'En preparación',     color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'ri-box-3-line' },
  en_camino:      { label: 'En camino',          color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'ri-e-bike-2-line' },
  listo_recojo:   { label: 'Listo para recoger', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'ri-store-2-line' },
  entregado:      { label: 'Entregado',          color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: 'ri-checkbox-circle-line' },
  cancelado:      { label: 'Cancelado',          color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   icon: 'ri-close-circle-line' },
}

export function claveEstado(p) {
  if (p.estado === 'pendiente') return 'pago_pendiente'
  return p.estado_pedido || 'recibido'
}

export function estadoConfig(p) {
  return ESTADOS[claveEstado(p)] || ESTADOS.recibido
}

export const estaEntregado = (p) => claveEstado(p) === 'entregado'
export const estaCancelado = (p) => ['cancelado', 'pago_pendiente'].includes(claveEstado(p))
export const estaEnCurso   = (p) => !estaEntregado(p) && !estaCancelado(p)

// Pasos de la línea de tiempo según si es delivery o recojo en tienda
export function pasosSeguimiento(p) {
  const esRecojo = p.tipo_entrega === 'recojo'
  const pasos = [
    { clave: 'recibido',   icon: 'ri-file-list-3-line', titulo: 'Pedido recibido',  sub: 'El negocio recibió tu orden' },
    { clave: 'preparando', icon: 'ri-box-3-line',       titulo: 'En preparación',   sub: 'Están alistando tus productos' },
    esRecojo
      ? { clave: 'listo_recojo', icon: 'ri-store-2-line',  titulo: 'Listo para recoger', sub: 'Ya puedes pasar por la tienda' }
      : { clave: 'en_camino',    icon: 'ri-e-bike-2-line', titulo: 'En camino',          sub: 'El negocio está llevando tu pedido' },
    { clave: 'entregado',  icon: 'ri-home-4-line', titulo: '¡Entregado!', sub: 'Disfruta tu compra' },
  ]
  const actual = pasos.findIndex((paso) => paso.clave === claveEstado(p))
  return pasos.map((paso, i) => ({ ...paso, hecho: actual >= i, actual: actual === i }))
}
