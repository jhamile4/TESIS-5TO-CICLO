-- Migración: reseñas reales de clientes que compraron
-- Solo se puede reseñar un pedido entregado, una vez por pedido.
-- Las reseñas antiguas (de ejemplo) quedan sin cliente ni pedido.

ALTER TABLE resena ADD COLUMN IF NOT EXISTS fk_cliente_id INTEGER REFERENCES cliente(pk_id) ON DELETE SET NULL;
ALTER TABLE resena ADD COLUMN IF NOT EXISTS fk_pedido_id  UUID    REFERENCES pedido_pago(pk_id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS resena_fk_pedido_id_unique
ON resena (fk_pedido_id)
WHERE fk_pedido_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_resena_negocio_fecha ON resena (fk_negocio_id, created_at DESC);

-- El rating y el total de reseñas pasan a calcularse de las reseñas reales
UPDATE negocio n SET
  rating        = COALESCE((SELECT ROUND(AVG(r.estrellas)::numeric, 1) FROM resena r WHERE r.fk_negocio_id = n.pk_id), 0),
  total_resenas = (SELECT COUNT(*) FROM resena r WHERE r.fk_negocio_id = n.pk_id);
