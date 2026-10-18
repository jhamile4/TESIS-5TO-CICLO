const pool = require('../config/db')

const findByNegocio = (negocioId) =>
  pool.query(
    `SELECT pk_id, nombre_autor, estrellas, texto, created_at,
            fk_pedido_id IS NOT NULL AS compra_verificada
     FROM resena
     WHERE fk_negocio_id = $1
     ORDER BY created_at DESC`,
    [negocioId]
  )

// Pedido del cliente en ese negocio, con su estado y si ya tiene reseña
const findPedidoParaResena = (dbClient, clienteId, negocioId, pedidoId) =>
  dbClient.query(
    `SELECT pp.pk_id, pp.estado_pedido,
            EXISTS (SELECT 1 FROM resena r WHERE r.fk_pedido_id = pp.pk_id) AS resenado
     FROM pedido_pago pp
     WHERE pp.pk_id = $1 AND pp.fk_cliente_id = $2 AND pp.fk_negocio_id = $3
     FOR UPDATE`,
    [pedidoId, clienteId, negocioId]
  )

const create = (dbClient, { negocioId, clienteId, pedidoId, nombreAutor, estrellas, texto }) =>
  dbClient.query(
    `INSERT INTO resena (fk_negocio_id, fk_cliente_id, fk_pedido_id, nombre_autor, estrellas, texto)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING pk_id, nombre_autor, estrellas, texto, created_at, TRUE AS compra_verificada`,
    [negocioId, clienteId, pedidoId, nombreAutor, estrellas, texto]
  )

const recalcularRating = (dbClient, negocioId) =>
  dbClient.query(
    `UPDATE negocio SET
       rating        = COALESCE((SELECT ROUND(AVG(estrellas)::numeric, 1) FROM resena WHERE fk_negocio_id = $1), 0),
       total_resenas = (SELECT COUNT(*) FROM resena WHERE fk_negocio_id = $1)
     WHERE pk_id = $1
     RETURNING rating, total_resenas`,
    [negocioId]
  )

module.exports = { findByNegocio, findPedidoParaResena, create, recalcularRating }
