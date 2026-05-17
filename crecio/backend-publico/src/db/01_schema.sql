-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - PROYECTO CRECIO
-- Ejecutar primero antes que cualquier otro SQL
-- =====================================================

-- Tabla de planes disponibles para los negocios
CREATE TABLE IF NOT EXISTS plan (
  pk_id       SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) NOT NULL,
  precio      DECIMAL(10,2) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes (compradores de la plataforma)
CREATE TABLE IF NOT EXISTS cliente (
  pk_id       SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  rol         VARCHAR(20) DEFAULT 'cliente',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabla de negocios (comerciantes MYPE)
CREATE TABLE IF NOT EXISTS negocio (
  pk_id         SERIAL PRIMARY KEY,
  nombre        VARCHAR(150) NOT NULL,
  categoria     VARCHAR(100),
  descripcion   TEXT,
  direccion     VARCHAR(200),
  distrito      VARCHAR(100),
  whatsapp      VARCHAR(20),
  logo_url      TEXT,
  verificado    BOOLEAN DEFAULT FALSE,
  activo        BOOLEAN DEFAULT TRUE,
  horario       VARCHAR(150),
  telefono      VARCHAR(20),
  rating        DECIMAL(2,1) DEFAULT 0.0,
  total_resenas INT DEFAULT 0,
  fk_plan_id    INT REFERENCES plan(pk_id),
  created_at    TIMESTAMP DEFAULT NOW()
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
  mensaje_generado   TEXT,
  created_at         TIMESTAMP DEFAULT NOW()
);

-- Tabla de imágenes de galería por negocio
CREATE TABLE IF NOT EXISTS galeria_negocio (
  pk_id          SERIAL PRIMARY KEY,
  fk_negocio_id  INT NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  imagen_url     TEXT NOT NULL,
  orden          INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- Tabla de reseñas de negocios
CREATE TABLE IF NOT EXISTS resena (
  pk_id          SERIAL PRIMARY KEY,
  fk_negocio_id  INT NOT NULL REFERENCES negocio(pk_id) ON DELETE CASCADE,
  nombre_autor   VARCHAR(100) NOT NULL,
  estrellas      INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  texto          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);
