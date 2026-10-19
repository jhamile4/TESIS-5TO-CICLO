-- Migración: meta de ventas mensual definida por cada negocio (antes era un número fijo en el panel)
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS meta_ventas_mes NUMERIC(12,2) CHECK (meta_ventas_mes IS NULL OR meta_ventas_mes >= 0);
