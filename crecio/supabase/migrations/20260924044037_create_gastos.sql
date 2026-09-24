CREATE TABLE IF NOT EXISTS gasto (
  pk_id BIGSERIAL PRIMARY KEY,
  fk_negocio_id BIGINT NOT NULL REFERENCES negocio(pk_id),
  descripcion TEXT NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gasto_negocio_fecha
ON gasto (fk_negocio_id, fecha);     