export const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
export const statusClass = (status) => status === 'pagado' ? 'paid' : status === 'cancelado' ? 'cancelled' : 'pending'
