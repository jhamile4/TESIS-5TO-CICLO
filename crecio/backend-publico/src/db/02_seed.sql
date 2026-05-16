-- =====================================================
-- DATOS DE PRUEBA - PROYECTO CRECIO
-- Tecsup 5to Ciclo - Grupo 48
-- =====================================================

-- Planes
INSERT INTO plan (nombre, precio) VALUES
  ('Gratuito', 0.00),
  ('Básico',   29.90),
  ('Pro',      59.90);

-- Negocios de prueba (logo_url en NULL para usar imágenes locales del frontend)
INSERT INTO negocio (nombre, categoria, descripcion, direccion, distrito, whatsapp, logo_url, fk_plan_id) VALUES
  ('Textiles Gamarra SAC',  'Ropa',       'Tienda de ropa al por mayor y menor en Gamarra.',          'Jr. Gamarra 450', 'La Victoria', '51987654321', NULL, 1),
  ('Panadería Don Carlos',  'Panadería',  'Pan artesanal, pasteles y tortas para todo evento.',       'Av. Grau 123',    'Breña',       '51976543210', NULL, 1),
  ('TechZone Accesorios',   'Tecnología', 'Accesorios para celulares, tablets y laptops a buen precio.', 'Av. Wilson 890',  'Lima Cercado','51965432109', NULL, 1);

-- Productos de Textiles Gamarra (imagen_url en NULL para usar placeholder en frontend)
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Polo Básico Blanco',   'Polo 100% algodón talla M',           25.00, NULL, 50, 'Ropa', 1),
  ('Pantalón Jean Slim',   'Jean slim fit talla 32',              89.00, NULL, 30, 'Ropa', 1),
  ('Casaca Deportiva',     'Casaca liviana para deporte',         65.00, NULL, 20, 'Ropa', 1);

-- Productos de Panadería Don Carlos
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Pan Francés (unidad)', 'Pan crujiente recién horneado',        0.30, NULL, 200, 'Panadería', 2),
  ('Torta de Cumpleaños',  'Torta de 1 kg con decoración incluida', 85.00, NULL, 5,  'Panadería', 2),
  ('Empanada de Pollo',    'Empanada horneada rellena de pollo',   3.50, NULL, 40, 'Panadería', 2);

-- Productos de TechZone
INSERT INTO producto (nombre, descripcion, precio, imagen_url, stock, categoria, fk_negocio_id) VALUES
  ('Audífonos Bluetooth',  'Audífonos inalámbricos con micrófono', 55.00, NULL, 15, 'Tecnología', 3),
  ('Cargador USB-C 65W',   'Cargador rápido compatible con Android', 35.00, NULL, 25, 'Tecnología', 3),
  ('Funda para Celular',   'Funda protectora universal',           15.00, NULL, 60, 'Tecnología', 3);
