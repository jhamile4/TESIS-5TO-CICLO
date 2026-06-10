const PLANES = {
  pro:              { nombre: 'CRECIO Pro',              monto: 4900,   meses: 1  },
  pro_anual:        { nombre: 'CRECIO Pro Anual',        monto: 46800,  meses: 12 },
  enterprise:       { nombre: 'CRECIO Enterprise',       monto: 12900,  meses: 1  },
  enterprise_anual: { nombre: 'CRECIO Enterprise Anual', monto: 118800, meses: 12 },
}

const ENVIO_GRATIS_DESDE   = 200
const COSTO_ENVIO          = 15
const MAX_HISTORIAL_CHAT   = 6
const MAX_PRODUCTOS_CHAT   = 20
const VISTOS_LIMITE        = 10
const PARA_TI_LIMITE       = 6
const BUSCAR_PRODUCTOS_LIM = 8
const BUSCAR_NEGOCIOS_LIM  = 4

module.exports = {
  PLANES,
  ENVIO_GRATIS_DESDE,
  COSTO_ENVIO,
  MAX_HISTORIAL_CHAT,
  MAX_PRODUCTOS_CHAT,
  VISTOS_LIMITE,
  PARA_TI_LIMITE,
  BUSCAR_PRODUCTOS_LIM,
  BUSCAR_NEGOCIOS_LIM,
}
