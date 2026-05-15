-- ============================================================
-- CRECIO — Datos de prueba
--
-- INSTRUCCIONES:
-- 1. Ejecuta primero 01_schema.sql
-- 2. Descarga las imágenes: node descargar-imagenes.js (en carpeta /crecio)
-- 3. Ejecuta este archivo en pgAdmin
--
-- Para limpiar y volver a cargar sin duplicados:
-- TRUNCATE resena, pedido_whatsapp, producto, negocio, cliente RESTART IDENTITY CASCADE;
-- ============================================================

-- 3 negocios de ejemplo
INSERT INTO negocio (fk_plan_id, nombre, categoria, descripcion, direccion, distrito, whatsapp, verificado)
VALUES
  (2, 'Boutique Valentina', 'Ropa',
   'Tienda de ropa casual y formal para dama. Trabajamos con telas nacionales de alta calidad.',
   'Jr. Gamarra 450, Stand 12', 'La Victoria', '51936780724', FALSE),

  (3, 'Panadería La Tradición', 'Panadería',
   'Pan artesanal horneado diariamente. Especialidad en pan de yema, ciabatta y tortas personalizadas.',
   'Av. Aviación 2310', 'San Borja', '51936780724', TRUE),

  (2, 'Tech Repair Perú', 'Tecnología',
   'Reparación de celulares, laptops y tablets. Repuestos originales y servicio garantizado.',
   'Jr. Cusco 789, Galería Central', 'Cercado de Lima', '51936780724', FALSE);


-- 9 productos (3 por negocio)
INSERT INTO producto (fk_negocio_id, nombre, descripcion, precio, stock, categoria, imagen_url)
VALUES
  -- Boutique Valentina
  (1, 'Blusa de lino manga larga',
   'Blusa casual de lino disponible en tallas S, M y L. Colores: blanco, beige y celeste.',
   49.90, 30, 'Blusas', '/productos/prod-1-blusa.jpg'),

  (1, 'Pantalón recto tiro alto',
   'Pantalón de tela stretch, tiro alto, ideal para oficina o salida. Tallas 28 al 36.',
   89.90, 20, 'Pantalones', '/productos/prod-2-pantalon.jpg'),

  (1, 'Vestido floral verano',
   'Vestido ligero con estampado floral, tela chiffon. Tallas S, M y L.',
   119.90, 15, 'Vestidos', '/productos/prod-3-vestido.jpg'),

  -- Panadería La Tradición
  (2, 'Pan de yema x 12 unidades',
   'Pan de yema artesanal recién horneado. Ideal para desayunos y loncheras.',
   12.00, 50, 'Panes', '/productos/prod-4-pan-yema.jpg'),

  (2, 'Torta de chocolate personalizada',
   'Torta húmeda de chocolate con cobertura de buttercream. Se personaliza con nombre y diseño.',
   85.00, 10, 'Tortas', '/productos/prod-5-torta.jpg'),

  (2, 'Ciabatta rústica x 2',
   'Pan ciabatta de masa madre con semillas de ajonjolí. Perfecto para sándwiches.',
   18.00, 25, 'Panes', '/productos/prod-6-ciabatta.jpg'),

  -- Tech Repair Perú
  (3, 'Cambio de pantalla iPhone',
   'Reemplazo de pantalla para iPhone 11, 12 y 13. Pantalla original, garantía de 3 meses.',
   180.00, 100, 'Reparaciones', '/productos/prod-7-iphone.jpg'),

  (3, 'Limpieza interna laptop',
   'Servicio de limpieza interna, cambio de pasta térmica y revisión general de laptop.',
   60.00, 100, 'Mantenimiento', '/productos/prod-8-laptop.jpg'),

  (3, 'Cargador USB-C universal',
   'Cargador compatible con la mayoría de laptops y tablets. 65W con cable de 1.5m.',
   45.00, 40, 'Accesorios', '/productos/prod-9-cargador.jpg');
