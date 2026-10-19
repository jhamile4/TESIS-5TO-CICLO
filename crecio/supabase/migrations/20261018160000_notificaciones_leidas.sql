-- Migración: notificaciones del panel
-- Las notificaciones se calculan a partir de pedidos, reseñas y stock;
-- solo se guarda hasta cuándo el dueño ya las vio ("Marcar todo como leído").
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS notificaciones_leidas_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now();
