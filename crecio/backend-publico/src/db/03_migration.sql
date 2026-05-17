-- =====================================================
-- MIGRACIÓN 03 - PROYECTO CRECIO
-- Agrega columnas faltantes y tablas para TiendaPage
-- Tecsup 5to Ciclo - Grupo 48
-- =====================================================

-- Columnas nuevas en negocio
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS horario    VARCHAR(150);
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS telefono   VARCHAR(20);
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS rating     DECIMAL(2,1) DEFAULT 0.0;
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS total_resenas INT DEFAULT 0;

-- Tabla de imágenes de galería por negocio
CREATE TABLE IF NOT EXISTS galeria_negocio (
  pk_id          SERIAL PRIMARY KEY,
  fk_negocio_id  INT NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  imagen_url     TEXT NOT NULL,
  orden          INT DEFAULT 0,          -- Para ordenar las imágenes (0 = primera)
  created_at     TIMESTAMP DEFAULT NOW()
);

-- Tabla de reseñas de negocios
CREATE TABLE IF NOT EXISTS resena (
  pk_id          SERIAL PRIMARY KEY,
  fk_negocio_id  INT NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  nombre_autor   VARCHAR(100) NOT NULL,  -- Nombre visible del cliente
  estrellas      INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  texto          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SEED DE PRUEBA - datos para los 3 negocios existentes
-- =====================================================

-- Actualizar negocio 1: Textiles Gamarra
UPDATE negocio SET
  horario  = 'Lun-Sab: 9:00 am - 7:00 pm',
  telefono = '987 654 321',
  rating   = 4.7,
  total_resenas = 2
WHERE pk_id = 1;

-- Actualizar negocio 2: Panadería Don Carlos
UPDATE negocio SET
  horario  = 'Lun-Dom: 6:00 am - 9:00 pm',
  telefono = '976 543 210',
  rating   = 4.9,
  total_resenas = 2
WHERE pk_id = 2;

-- Actualizar negocio 3: TechZone
UPDATE negocio SET
  horario  = 'Lun-Sab: 10:00 am - 8:00 pm',
  telefono = '965 432 109',
  rating   = 4.8,
  total_resenas = 2
WHERE pk_id = 3;

-- Galería negocio 1 (Textiles Gamarra) — URLs de placeholder
INSERT INTO galeria_negocio (fk_negocio_id, imagen_url, orden) VALUES
  (1, 'https://placehold.co/600x400?text=Textiles+1', 0),
  (1, 'https://placehold.co/600x400?text=Textiles+2', 1),
  (1, 'https://placehold.co/600x400?text=Textiles+3', 2),
  (1, 'https://placehold.co/600x400?text=Textiles+4', 3);

-- Galería negocio 2 (Panadería Don Carlos)
INSERT INTO galeria_negocio (fk_negocio_id, imagen_url, orden) VALUES
  (2, 'https://placehold.co/600x400?text=Panaderia+1', 0),
  (2, 'https://placehold.co/600x400?text=Panaderia+2', 1),
  (2, 'https://placehold.co/600x400?text=Panaderia+3', 2),
  (2, 'https://placehold.co/600x400?text=Panaderia+4', 3);

-- Galería negocio 3 (TechZone)
INSERT INTO galeria_negocio (fk_negocio_id, imagen_url, orden) VALUES
  (3, 'https://placehold.co/600x400?text=Tech+1', 0),
  (3, 'https://placehold.co/600x400?text=Tech+2', 1),
  (3, 'https://placehold.co/600x400?text=Tech+3', 2),
  (3, 'https://placehold.co/600x400?text=Tech+4', 3);

-- Reseñas negocio 1
INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES
  (1, 'María García', 5, 'Excelente atención y muy buena calidad de telas.'),
  (1, 'Carlos Quispe', 4, 'Buenos precios al por mayor, recomendado.');

-- Reseñas negocio 2
INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES
  (2, 'Rosa Mendoza', 5, 'El mejor pan del barrio, siempre fresco.'),
  (2, 'Jorge Lima',   5, 'La torta de cumpleaños quedó perfecta.');

-- Reseñas negocio 3
INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES
  (3, 'Luis Torres',  5, 'Me repararon el celular en pocas horas.'),
  (3, 'Ana Flores',   4, 'Buenos productos y precios justos.');
