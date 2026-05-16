-- =====================================================
-- ESQUEMA DE BASE DE DATOS - PROYECTO CRECIO
-- Tecsup 5to Ciclo - Grupo 48
-- =====================================================

-- Tabla de planes disponibles para los negocios
CREATE TABLE IF NOT EXISTS plan (
  pk_id       SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) NOT NULL,       -- Ej: Gratuito, Básico, Pro
  precio      DECIMAL(10,2) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes (compradores de la plataforma)
CREATE TABLE IF NOT EXISTS cliente (
  pk_id       SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,      -- Hash bcrypt
  rol         VARCHAR(20) DEFAULT 'cliente',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabla de negocios (comerciantes MYPE)
CREATE TABLE IF NOT EXISTS negocio (
  pk_id        SERIAL PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  categoria    VARCHAR(100),              -- Ej: Textil, Gastronomía, Tecnología
  descripcion  TEXT,
  direccion    VARCHAR(200),
  distrito     VARCHAR(100),
  whatsapp     VARCHAR(20),               -- Número para el enlace de WhatsApp
  logo_url     TEXT,
  verificado   BOOLEAN DEFAULT FALSE,
  activo       BOOLEAN DEFAULT TRUE,
  fk_plan_id   INT REFERENCES plan(pk_id),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos de cada negocio
CREATE TABLE IF NOT EXISTS producto (
  pk_id          SERIAL PRIMARY KEY,
  nombre         VARCHAR(150) NOT NULL,
  descripcion    TEXT,
  precio         DECIMAL(10,2) NOT NULL,
  imagen_url     TEXT,
  stock          INT DEFAULT 0,
  categoria      VARCHAR(100),
  activo         BOOLEAN DEFAULT TRUE,
  fk_negocio_id  INT NOT NULL REFERENCES negocio(pk_id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- Tabla de pedidos generados por WhatsApp
CREATE TABLE IF NOT EXISTS pedido_whatsapp (
  pk_id              SERIAL PRIMARY KEY,
  fk_cliente_id      INT NOT NULL REFERENCES cliente(pk_id),
  fk_producto_id     INT NOT NULL REFERENCES producto(pk_id),
  fk_negocio_id      INT NOT NULL REFERENCES negocio(pk_id),
  mensaje_generado   TEXT,               -- Mensaje que se envió por WhatsApp
  created_at         TIMESTAMP DEFAULT NOW()
);
