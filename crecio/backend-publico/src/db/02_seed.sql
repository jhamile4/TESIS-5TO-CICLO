-- =====================================================
-- DATOS DE PRUEBA COMPLETOS - PROYECTO CRECIO
-- Ejecutar después de 01_schema.sql
-- =====================================================

-- Planes
INSERT INTO plan (nombre, precio) VALUES
  ('Gratuito', 0.00),
  ('Básico',   29.90),
  ('Pro',      59.90);

-- Negocios de prueba
INSERT INTO negocio (nombre, categoria, descripcion, direccion, distrito, whatsapp, logo_url, horario, telefono, rating, total_resenas, fk_plan_id) VALUES
  ('Textiles Gamarra SAC', 'Ropa',       'Tienda de ropa al por mayor y menor en Gamarra.',              'Jr. Gamarra 450', 'La Victoria',  '51987654321', NULL, 'Lun-Sab: 9:00 am - 7:00 pm',  '987 654 321', 4.7, 2, 1),
  ('Panadería Don Carlos', 'Panadería',  'Pan artesanal, pasteles y tortas para todo evento.',           'Av. Grau 123',    'Breña',        '51976543210', NULL, 'Lun-Dom: 6:00 am - 9:00 pm',  '976 543 210', 4.9, 2, 1),
  ('TechZone Accesorios',  'Tecnología', 'Accesorios para celulares, tablets y laptops a buen precio.',  'Av. Wilson 890',  'Lima Cercado', '51965432109', NULL, 'Lun-Sab: 10:00 am - 8:00 pm', '965 432 109', 4.8, 2, 1);

-- Productos de Textiles Gamarra
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Polo Básico Blanco',  'Polo 100% algodón talla M',            25.00, NULL, 50, 'Ropa', 1),
  ('Pantalón Jean Slim',  'Jean slim fit talla 32',               89.00, NULL, 30, 'Ropa', 1),
  ('Casaca Deportiva',    'Casaca liviana para deporte',          65.00, NULL, 20, 'Ropa', 1);

-- Productos de Panadería Don Carlos
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Pan Francés (unidad)', 'Pan crujiente recién horneado',        0.30, NULL, 200, 'Panadería', 2),
  ('Torta de Cumpleaños',  'Torta de 1 kg con decoración incluida', 85.00, NULL, 5,  'Panadería', 2),
  ('Empanada de Pollo',    'Empanada horneada rellena de pollo',   3.50, NULL, 40,  'Panadería', 2);

-- Productos de TechZone
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Audífonos Bluetooth', 'Audífonos inalámbricos con micrófono',   55.00, NULL, 15, 'Tecnología', 3),
  ('Cargador USB-C 65W',  'Cargador rápido compatible con Android', 35.00, NULL, 25, 'Tecnología', 3),
  ('Funda para Celular',  'Funda protectora universal',             15.00, NULL, 60, 'Tecnología', 3);

-- Galería negocio 1 (Textiles Gamarra)
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
  (1, 'María García',  5, 'Excelente atención y muy buena calidad de telas.'),
  (1, 'Carlos Quispe', 4, 'Buenos precios al por mayor, recomendado.');

-- Reseñas negocio 2
INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES
  (2, 'Rosa Mendoza', 5, 'El mejor pan del barrio, siempre fresco.'),
  (2, 'Jorge Lima',   5, 'La torta de cumpleaños quedó perfecta.');

-- Reseñas negocio 3
INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES
  (3, 'Luis Torres', 5, 'Me repararon el celular en pocas horas.'),
  (3, 'Ana Flores',  4, 'Buenos productos y precios justos.');
