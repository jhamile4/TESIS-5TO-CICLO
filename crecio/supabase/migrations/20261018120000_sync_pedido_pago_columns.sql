-- Migración: sincroniza pedido_pago con la BD en producción
-- Estas columnas se agregaron manualmente en Supabase y el código ya las usa
-- (ventas manuales del panel: método de pago, comprobante Yape y teléfono del cliente).
-- Es idempotente: no hace nada si ya existen.

ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS metodo_pago      VARCHAR(30);
ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS comprobante_url  TEXT;
ALTER TABLE pedido_pago ADD COLUMN IF NOT EXISTS telefono_cliente VARCHAR(20);

-- numero_pedido pasó de integer a texto para admitir códigos como 'VTA-1234'
ALTER TABLE pedido_pago ALTER COLUMN numero_pedido TYPE VARCHAR USING numero_pedido::text;
