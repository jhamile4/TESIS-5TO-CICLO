-- Migración: seguimiento del pedido separado del estado de pago
-- estado        → estado del PAGO   (pendiente, efectivo, pagado, reembolsado)
-- estado_pedido → estado del PEDIDO (recibido, preparando, en_camino, listo_recojo, entregado, cancelado)
-- tipo_entrega  → delivery (lo lleva el propio negocio) o recojo (el cliente recoge en tienda)

ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS estado_pedido VARCHAR(20) NOT NULL DEFAULT 'recibido';
ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS tipo_entrega  VARCHAR(20) NOT NULL DEFAULT 'delivery';
ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS estado_pedido_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_pago_estado_pedido_check') THEN
    ALTER TABLE pedido_pago ADD CONSTRAINT pedido_pago_estado_pedido_check
      CHECK (estado_pedido IN ('recibido', 'preparando', 'en_camino', 'listo_recojo', 'entregado', 'cancelado'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_pago_tipo_entrega_check') THEN
    ALTER TABLE pedido_pago ADD CONSTRAINT pedido_pago_tipo_entrega_check
      CHECK (tipo_entrega IN ('delivery', 'recojo'));
  END IF;
END $$;

-- Datos existentes: las ventas presenciales del panel ya se entregaron en tienda,
-- y los pedidos online ya pagados se consideran entregados (así se mostraban antes)
UPDATE pedido_pago SET estado_pedido = 'entregado', tipo_entrega = 'recojo'
WHERE numero_pedido LIKE 'VTA-%' AND estado_pedido = 'recibido';

UPDATE pedido_pago SET estado_pedido = 'entregado'
WHERE estado = 'pagado' AND estado_pedido = 'recibido';

CREATE INDEX IF NOT EXISTS idx_pedido_pago_negocio_fecha ON pedido_pago (fk_negocio_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedido_pago_cliente_fecha ON pedido_pago (fk_cliente_id, created_at DESC);
