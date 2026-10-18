// Estados del pedido (debe coincidir con SIGUIENTES_ESTADOS del backend)
export const ESTADOS_PEDIDO = {
  recibido:     { label: 'Recibido',         tone: 'status-blue' },
  preparando:   { label: 'Preparando',       tone: 'status-orange' },
  en_camino:    { label: 'En camino',        tone: 'status-orange' },
  listo_recojo: { label: 'Listo para recoger', tone: 'status-orange' },
  entregado:    { label: 'Entregado',        tone: 'status-green' },
  cancelado:    { label: 'Cancelado',        tone: 'status-red' },
}

const SIGUIENTES = {
  delivery: { recibido: 'preparando', preparando: 'en_camino', en_camino: 'entregado' },
  recojo:   { recibido: 'preparando', preparando: 'listo_recojo', listo_recojo: 'entregado' },
}

const TEXTO_ACCION = {
  preparando:   'Empezar a preparar',
  en_camino:    'Marcar en camino',
  listo_recojo: 'Marcar listo para recoger',
  entregado:    'Marcar entregado',
}

const CANCELABLES = ['recibido', 'preparando', 'listo_recojo']

export function estadoPedidoInfo(sale) {
  if (sale.estado === 'pendiente') return { label: 'Pago pendiente', tone: 'status-red' }
  return ESTADOS_PEDIDO[sale.estado_pedido] || ESTADOS_PEDIDO.recibido
}

export function accionesPedido(sale) {
  if (sale.estado === 'pendiente') return { siguiente: null, puedeCancelar: false }
  const tipo = sale.tipo_entrega || 'delivery'
  const siguiente = SIGUIENTES[tipo]?.[sale.estado_pedido] || null
  return {
    siguiente: siguiente ? { estado: siguiente, texto: TEXTO_ACCION[siguiente] } : null,
    puedeCancelar: CANCELABLES.includes(sale.estado_pedido),
  }
}
