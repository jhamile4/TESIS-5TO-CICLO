-- Migración: cada cuenta administra como máximo un negocio
-- (un negocio sin dueño, fk_cliente_id NULL, sigue permitido para datos de ejemplo antiguos)
CREATE UNIQUE INDEX IF NOT EXISTS negocio_fk_cliente_id_unique
ON negocio (fk_cliente_id)
WHERE fk_cliente_id IS NOT NULL;
