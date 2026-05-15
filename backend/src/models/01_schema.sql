-- ============================================================
-- CRECIO — Plataforma de ventas para microempresas
-- Grupo 48 · Tecsup 5C24
--
-- INSTRUCCIONES:
-- 1. Crea la base de datos: CREATE DATABASE crecio_db;
-- 2. Conéctate a crecio_db y ejecuta este archivo
-- 3. Luego ejecuta 02_seed.sql para datos de prueba
-- ============================================================

-- Planes de suscripción
CREATE TABLE IF NOT EXISTS plan (
  pk_id            SERIAL PRIMARY KEY,
  nombre           VARCHAR(50)      NOT NULL,
  precio           DECIMAL(10, 2)   DEFAULT 0,
  max_productos    INTEGER          DEFAULT 20,
  tiene_pasarela   BOOLEAN          DEFAULT FALSE,
  tiene_analiticas BOOLEAN          DEFAULT FALSE,
  descripcion      VARCHAR(200)
);

-- Clientes registrados en la plataforma
CREATE TABLE IF NOT EXISTS cliente (
  pk_id      SERIAL PRIMARY KEY,
  nombre     VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  rol        VARCHAR(20)   DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Negocios registrados por los dueños
CREATE TABLE IF NOT EXISTS negocio (
  pk_id       SERIAL PRIMARY KEY,
  fk_plan_id  INTEGER      REFERENCES plan(pk_id) DEFAULT 1,
  nombre      VARCHAR(100) NOT NULL,
  categoria   VARCHAR(50)  NOT NULL,
  descripcion TEXT,
  direccion   VARCHAR(200),
  distrito    VARCHAR(100),
  whatsapp    VARCHAR(20),
  logo_url    VARCHAR(255),
  verificado  BOOLEAN      DEFAULT FALSE,
  activo      BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Productos del catálogo de cada negocio
CREATE TABLE IF NOT EXISTS producto (
  pk_id         SERIAL PRIMARY KEY,
  fk_negocio_id INTEGER        NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  nombre        VARCHAR(150)   NOT NULL,
  descripcion   TEXT,
  precio        DECIMAL(10, 2) NOT NULL,
  imagen_url    VARCHAR(255),
  stock         INTEGER        DEFAULT 0,
  categoria     VARCHAR(50),
  activo        BOOLEAN        DEFAULT TRUE,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos realizados por WhatsApp
CREATE TABLE IF NOT EXISTS pedido_whatsapp (
  pk_id            SERIAL PRIMARY KEY,
  fk_cliente_id    INTEGER   REFERENCES cliente(pk_id) ON DELETE SET NULL,
  fk_negocio_id    INTEGER   NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  fk_producto_id   INTEGER   REFERENCES producto(pk_id) ON DELETE SET NULL,
  cantidad         INTEGER   DEFAULT 1,
  mensaje_generado TEXT      NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reseñas de clientes sobre negocios
CREATE TABLE IF NOT EXISTS resena (
  pk_id         SERIAL PRIMARY KEY,
  fk_cliente_id INTEGER NOT NULL REFERENCES cliente(pk_id) ON DELETE CASCADE,
  fk_negocio_id INTEGER NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  calificacion  INTEGER CHECK (calificacion BETWEEN 1 AND 5),
  comentario    TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (fk_cliente_id, fk_negocio_id)
);

-- Planes iniciales
INSERT INTO plan (nombre, precio, max_productos, tiene_pasarela, tiene_analiticas, descripcion)
VALUES
  ('Gratis',        0,   20,  FALSE, FALSE, 'Para empezar a digitalizarte sin costo.'),
  ('Basico',       49,   50,  FALSE, FALSE, 'Ideal para negocios que quieren crecer.'),
  ('Pro',         129, 9999,  TRUE,  TRUE,  'El favorito de los negocios establecidos.'),
  ('Empresarial',   0, 9999,  TRUE,  TRUE,  'Para negocios con múltiples sucursales.')
ON CONFLICT DO NOTHING;
