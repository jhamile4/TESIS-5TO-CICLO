const pool = require('../config/db')

const findByEmail = (email) =>
  pool.query('SELECT * FROM cliente WHERE email = $1', [email])

const findById = (id) =>
  pool.query('SELECT pk_id, nombre, email, created_at FROM cliente WHERE pk_id = $1', [id])

const existeEmail = (email) =>
  pool.query('SELECT pk_id FROM cliente WHERE email = $1', [email])

const createSimple = (nombre, email, hash) =>
  pool.query(
    `INSERT INTO cliente (nombre, email, password) VALUES ($1,$2,$3) RETURNING pk_id, nombre, email`,
    [nombre, email, hash]
  )

const createConCodigo = (nombre, email, hash, codigo, expira) =>
  pool.query(
    `INSERT INTO cliente (nombre, email, password, codigo_verificacion, codigo_expira, email_verificado)
     VALUES ($1,$2,$3,$4,$5,FALSE) RETURNING pk_id`,
    [nombre, email, hash, codigo, expira]
  )

const createComprador = (nombre, email, hash, codigo, expira) =>
  pool.query(
    `INSERT INTO cliente (nombre, email, password, codigo_verificacion, codigo_expira, email_verificado, es_comprador)
     VALUES ($1,$2,$3,$4,$5,FALSE,TRUE)`,
    [nombre, email, hash, codigo, expira]
  )

const findParaVerificar = (email) =>
  pool.query(
    'SELECT pk_id, codigo_verificacion, codigo_expira, email_verificado FROM cliente WHERE email = $1',
    [email]
  )

const setEmailVerificado = (id) =>
  pool.query(
    'UPDATE cliente SET email_verificado = TRUE, codigo_verificacion = NULL, codigo_expira = NULL WHERE pk_id = $1',
    [id]
  )

const updateCodigo = (email, codigo, expira) =>
  pool.query(
    'UPDATE cliente SET codigo_verificacion = $1, codigo_expira = $2 WHERE email = $3',
    [codigo, expira, email]
  )

const updateNombre = (id, nombre) =>
  pool.query(
    `UPDATE cliente SET nombre = $1 WHERE pk_id = $2 RETURNING pk_id, nombre, email`,
    [nombre, id]
  )

module.exports = {
  findByEmail,
  findById,
  existeEmail,
  createSimple,
  createConCodigo,
  createComprador,
  findParaVerificar,
  setEmailVerificado,
  updateCodigo,
  updateNombre,
}
