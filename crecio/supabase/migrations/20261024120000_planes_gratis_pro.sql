-- Planes Gratis y Pro: se registra cada uso de IA para contar el límite mensual del plan Gratis
CREATE TABLE IF NOT EXISTS public.uso_ia (
  pk_id         serial PRIMARY KEY,
  fk_negocio_id integer NOT NULL REFERENCES public.negocio(pk_id) ON DELETE CASCADE,
  tipo          varchar(20) NOT NULL,            -- 'texto' (publicación) o 'imagen'
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS uso_ia_negocio_fecha_idx ON public.uso_ia (fk_negocio_id, created_at);

-- El plan Empresarial ya no existe: quien lo tuviera pasa a Pro con la misma fecha de vencimiento
UPDATE public.negocio SET plan = 'pro' WHERE plan = 'enterprise';
UPDATE public.negocio SET plan = 'gratis' WHERE plan IS NULL;
