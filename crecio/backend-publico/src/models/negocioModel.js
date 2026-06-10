const pool = require('../config/db')

const findAll = (search) => {
  let query = `
    SELECT pk_id, nombre, categoria, descripcion,
           direccion, distrito, whatsapp, logo_url,
           horario, telefono, rating, total_resenas,
           verificado, latitud, longitud
    FROM negocio WHERE activo = TRUE
  `
  const params = []
  if (search) {
    params.push(`%${search}%`)
    query += ` AND nombre ILIKE $${params.length}`
  }
  query += ' ORDER BY created_at DESC'
  return pool.query(query, params)
}

const findById = (id) =>
  pool.query(
    `SELECT pk_id, nombre, categoria, descripcion,
            direccion, distrito, whatsapp, logo_url, verificado,
            horario, telefono, rating, total_resenas, latitud, longitud
     FROM negocio WHERE pk_id = $1 AND activo = TRUE`,
    [id]
  )

const findByClienteId = (clienteId) =>
  pool.query('SELECT pk_id FROM negocio WHERE fk_cliente_id = $1 LIMIT 1', [clienteId])

const create = (dbClient, nombre, categoria, descripcion, direccion, whatsapp, latitud, longitud, clienteId) =>
  dbClient.query(
    `INSERT INTO negocio
       (nombre, categoria, descripcion, logo_url, direccion, distrito, horario, telefono,
        whatsapp, rating, total_resenas, verificado, activo, latitud, longitud, fk_cliente_id)
     VALUES ($1,$2,$3,'',$4,'','Por confirmar',$5,$5,0,0,FALSE,FALSE,$6,$7,$8)`,
    [nombre, categoria, descripcion || '', direccion || '', whatsapp, latitud, longitud, clienteId]
  )

const updatePlan = (clienteId, plan, expira) =>
  pool.query(
    `UPDATE negocio SET plan = $1, plan_expira = $2 WHERE fk_cliente_id = $3`,
    [plan, expira, clienteId]
  )

const getPlan = (clienteId) =>
  pool.query(
    'SELECT plan, plan_expira FROM negocio WHERE fk_cliente_id = $1 LIMIT 1',
    [clienteId]
  )

const findInfoParaChat = (id) =>
  pool.query(
    `SELECT nombre, categoria, descripcion, direccion, horario, telefono, whatsapp
     FROM negocio WHERE pk_id = $1`,
    [id]
  )

module.exports = {
  findAll,
  findById,
  findByClienteId,
  create,
  updatePlan,
  getPlan,
  findInfoParaChat,
}
