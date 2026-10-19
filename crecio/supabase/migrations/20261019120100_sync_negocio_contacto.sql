-- Migración: sincroniza negocio con la BD en producción
-- Estas columnas se agregaron manualmente en Supabase y el panel ya las usa (Configuración → Datos del negocio).
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS email_contacto VARCHAR(150);
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS redes_sociales JSONB DEFAULT '{}'::jsonb;
