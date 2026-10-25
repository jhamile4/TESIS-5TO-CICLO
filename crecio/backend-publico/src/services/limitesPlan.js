const pool = require('../config/db')
const { LIMITES_PLAN } = require('../config/constants')

// Inicio del mes actual en hora de Perú (el límite de IA se reinicia cada mes)
const INICIO_MES_LIMA = `(date_trunc('month', now() AT TIME ZONE 'America/Lima') AT TIME ZONE 'America/Lima')`

// Pro solo cuenta mientras no haya vencido; al vencer, el negocio vuelve a Gratis sin perder nada
const planVigente = (negocio) => {
  const esPro = negocio?.plan === 'pro' && (!negocio.plan_expira || new Date(negocio.plan_expira) > new Date())
  return esPro ? 'pro' : 'gratis'
}

const limitesDe = (negocio) => LIMITES_PLAN[planVigente(negocio)]

// Error que el panel reconoce para ofrecer "Pasar a Pro"
const errorDePlan = (message) => ({ status: 402, codigo: 'PLAN_LIMITE', message })

const contarProductos = async (negocioId) =>
  Number((await pool.query('SELECT COUNT(*) AS total FROM producto WHERE fk_negocio_id = $1 AND activo = TRUE', [negocioId])).rows[0].total)

const contarUsosIaMes = async (negocioId) =>
  Number((await pool.query(
    `SELECT COUNT(*) AS total FROM uso_ia WHERE fk_negocio_id = $1 AND created_at >= ${INICIO_MES_LIMA}`,
    [negocioId]
  )).rows[0].total)

const contarFotosGaleria = async (negocioId) =>
  Number((await pool.query('SELECT COUNT(*) AS total FROM galeria_negocio WHERE fk_negocio_id = $1', [negocioId])).rows[0].total)

const exigirCupoProductos = async (negocio) => {
  const { productos } = limitesDe(negocio)
  if (productos !== null && await contarProductos(negocio.pk_id) >= productos)
    throw errorDePlan(`El plan Gratis permite hasta ${productos} productos. Pásate a Pro para agregar productos sin límite.`)
}

const exigirCupoIa = async (negocio) => {
  const { usosIaMes } = limitesDe(negocio)
  if (usosIaMes !== null && await contarUsosIaMes(negocio.pk_id) >= usosIaMes)
    throw errorDePlan(`Usaste tus ${usosIaMes} creaciones con IA de este mes del plan Gratis. Pásate a Pro para usar la IA sin límite.`)
}

const registrarUsoIa = (negocioId, tipo) =>
  pool.query('INSERT INTO uso_ia (fk_negocio_id, tipo) VALUES ($1, $2)', [negocioId, tipo])

const exigirCupoFotos = async (negocio, actuales) => {
  const { fotosGaleria } = limitesDe(negocio)
  if (actuales >= fotosGaleria) {
    throw planVigente(negocio) === 'pro'
      ? { status: 400, message: `Puedes tener hasta ${fotosGaleria} fotos en tu galería` }
      : errorDePlan(`El plan Gratis permite ${fotosGaleria} fotos en la galería. Con Pro puedes subir hasta ${LIMITES_PLAN.pro.fotosGaleria}.`)
  }
}

const exigirPublicarEnRedes = (negocio) => {
  if (!limitesDe(negocio).publicarEnRedes)
    throw errorDePlan('Publicar y programar en Facebook e Instagram es parte del plan Pro. En el plan Gratis puedes crear la publicación y copiar el texto.')
}

// Para la tarea automática, que solo conoce el id del negocio
const negocioConPlan = async (negocioId) =>
  (await pool.query('SELECT pk_id, plan, plan_expira FROM negocio WHERE pk_id = $1', [negocioId])).rows[0]

// Lo que ve el dueño en "Mi plan": su plan, cuándo vence y cuánto ha usado
const resumenPlan = async (negocio) => {
  const plan = planVigente(negocio)
  const [productos, usosIaMes, fotosGaleria] = await Promise.all([
    contarProductos(negocio.pk_id), contarUsosIaMes(negocio.pk_id), contarFotosGaleria(negocio.pk_id),
  ])
  return {
    plan,
    planExpira: plan === 'pro' ? negocio.plan_expira : null,
    vencido: negocio.plan === 'pro' && plan === 'gratis',
    limites: LIMITES_PLAN[plan],
    uso: { productos, usosIaMes, fotosGaleria },
  }
}

module.exports = {
  planVigente, exigirCupoProductos, exigirCupoIa, registrarUsoIa,
  exigirCupoFotos, exigirPublicarEnRedes, resumenPlan, negocioConPlan,
}
