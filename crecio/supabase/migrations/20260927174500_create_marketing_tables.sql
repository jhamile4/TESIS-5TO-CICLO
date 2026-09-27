-- Migración: Tablas para IA Marketing y Redes Sociales

CREATE TABLE IF NOT EXISTS red_social_cuenta (
    pk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fk_negocio_id INTEGER NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
    plataforma VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'
    cuenta_id_externa VARCHAR(255),
    nombre_cuenta VARCHAR(255) NOT NULL,
    handle VARCHAR(255),
    access_token TEXT,
    estado VARCHAR(50) DEFAULT 'conectado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publicacion_marketing (
    pk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fk_negocio_id INTEGER NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
    tipo_contenido VARCHAR(50) NOT NULL, -- 'Publicación', 'Story', 'Reels / Short', 'Promoción', 'Anuncio'
    plantilla VARCHAR(100),
    tono VARCHAR(100),
    prompt_usado TEXT,
    caption TEXT NOT NULL,
    guion_video JSONB, -- { gancho, desarrollo, cta, audio_sugerido } si es video
    media_url TEXT,
    plataformas TEXT[] DEFAULT '{}',
    estado VARCHAR(50) DEFAULT 'borrador', -- 'borrador', 'programado', 'publicado', 'fallido'
    fecha_programada TIMESTAMP WITH TIME ZONE,
    fecha_publicada TIMESTAMP WITH TIME ZONE,
    resultado_publicacion JSONB,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
