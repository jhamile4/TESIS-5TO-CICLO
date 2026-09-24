CREATE SEQUENCE "public"."cliente_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."galeria_negocio_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."negocio_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."pedido_pago_numero_pedido_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."pedido_whatsapp_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."plan_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."producto_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."resena_pk_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE TABLE "public"."carrito" (
  "pk_id"          uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "fk_cliente_id"  integer,
  "fk_producto_id" integer,
  "fk_negocio_id"  integer,
  "cantidad"       integer                     DEFAULT 1,
  "updated_at"     timestamp without time zone DEFAULT now(),
  CONSTRAINT "carrito_fk_cliente_id_fk_producto_id_key" UNIQUE (fk_cliente_id, fk_producto_id),
  CONSTRAINT "carrito_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."cliente" (
  "pk_id"               integer                     NOT NULL DEFAULT nextval('public.cliente_pk_id_seq'::regclass),
  "nombre"              character varying(100)      NOT NULL,
  "email"               character varying(150)      NOT NULL,
  "password"            character varying(255)      NOT NULL,
  "rol"                 character varying(20)       DEFAULT 'cliente'::character varying,
  "created_at"          timestamp without time zone DEFAULT now(),
  "codigo_verificacion" character varying(6),
  "codigo_expira"       timestamp without time zone,
  "email_verificado"    boolean                     DEFAULT false,
  "es_comprador"        boolean                     DEFAULT false,
  CONSTRAINT "cliente_email_key" UNIQUE (email),
  CONSTRAINT "cliente_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."favorito" (
  "pk_id"          uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "fk_cliente_id"  integer,
  "fk_producto_id" integer,
  "created_at"     timestamp without time zone DEFAULT now(),
  CONSTRAINT "favorito_fk_cliente_id_fk_producto_id_key" UNIQUE (fk_cliente_id, fk_producto_id),
  CONSTRAINT "favorito_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."galeria_negocio" (
  "pk_id"         integer                     NOT NULL DEFAULT nextval('public.galeria_negocio_pk_id_seq'::regclass),
  "fk_negocio_id" integer                     NOT NULL,
  "imagen_url"    text                        NOT NULL,
  "orden"         integer                     DEFAULT 0,
  "created_at"    timestamp without time zone DEFAULT now(),
  CONSTRAINT "galeria_negocio_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."negocio" (
  "pk_id"         integer                     NOT NULL DEFAULT nextval('public.negocio_pk_id_seq'::regclass),
  "nombre"        character varying(150)      NOT NULL,
  "categoria"     character varying(100),
  "descripcion"   text,
  "direccion"     character varying(200),
  "distrito"      character varying(100),
  "whatsapp"      character varying(20),
  "logo_url"      text,
  "verificado"    boolean                     DEFAULT false,
  "activo"        boolean                     DEFAULT true,
  "horario"       character varying(150),
  "telefono"      character varying(20),
  "rating"        numeric(2,1)                DEFAULT 0.0,
  "total_resenas" integer                     DEFAULT 0,
  "fk_plan_id"    integer,
  "created_at"    timestamp without time zone DEFAULT now(),
  "latitud"       double precision,
  "longitud"      double precision,
  "fk_cliente_id" integer,
  "plan"          character varying           DEFAULT 'gratis'::character varying,
  "plan_expira"   timestamp without time zone,
  CONSTRAINT "negocio_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."pedido_pago" (
  "pk_id"                 uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "fk_cliente_id"         integer,
  "fk_negocio_id"         integer,
  "stripe_payment_intent" text,
  "monto_total"           numeric(10,2),
  "estado"                text                        DEFAULT 'pendiente'::text,
  "items"                 jsonb,
  "created_at"            timestamp without time zone DEFAULT now(),
  "numero_pedido"         integer                     NOT NULL DEFAULT nextval('public.pedido_pago_numero_pedido_seq'::regclass),
  "direccion"             text,
  "ciudad"                text,
  "notas"                 text,
  CONSTRAINT "pedido_pago_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."pedido_whatsapp" (
  "pk_id"            integer                     NOT NULL DEFAULT nextval('public.pedido_whatsapp_pk_id_seq'::regclass),
  "fk_cliente_id"    integer,
  "fk_negocio_id"    integer                     NOT NULL,
  "mensaje_generado" text,
  "created_at"       timestamp without time zone DEFAULT now(),
  CONSTRAINT "pedido_whatsapp_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."plan" (
  "pk_id"      integer                     NOT NULL DEFAULT nextval('public.plan_pk_id_seq'::regclass),
  "nombre"     character varying(50)       NOT NULL,
  "precio"     numeric(10,2)               DEFAULT 0,
  "created_at" timestamp without time zone DEFAULT now(),
  CONSTRAINT "plan_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."producto_visto" (
  "pk_id"          uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "fk_cliente_id"  integer,
  "fk_producto_id" integer,
  "visto_at"       timestamp without time zone DEFAULT now(),
  CONSTRAINT "producto_visto_fk_cliente_id_fk_producto_id_key" UNIQUE (fk_cliente_id, fk_producto_id),
  CONSTRAINT "producto_visto_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."producto" (
  "pk_id"         integer                     NOT NULL DEFAULT nextval('public.producto_pk_id_seq'::regclass),
  "nombre"        character varying(150)      NOT NULL,
  "descripcion"   text,
  "precio"        numeric(10,2)               NOT NULL,
  "imagen_url"    text,
  "stock"         integer                     DEFAULT 0,
  "categoria"     character varying(100),
  "activo"        boolean                     DEFAULT true,
  "fk_negocio_id" integer                     NOT NULL,
  "created_at"    timestamp without time zone DEFAULT now(),
  "precio_oferta" numeric(10,2)               DEFAULT NULL::numeric,
  CONSTRAINT "producto_pkey" PRIMARY KEY (pk_id)
);

CREATE TABLE "public"."resena" (
  "pk_id"         integer                     NOT NULL DEFAULT nextval('public.resena_pk_id_seq'::regclass),
  "fk_negocio_id" integer                     NOT NULL,
  "nombre_autor"  character varying(100)      NOT NULL,
  "estrellas"     integer                     NOT NULL,
  "texto"         text,
  "created_at"    timestamp without time zone DEFAULT now(),
  CONSTRAINT "resena_estrellas_check" CHECK (((estrellas >= 1) AND (estrellas <= 5))),
  CONSTRAINT "resena_pkey" PRIMARY KEY (pk_id)
);

ALTER SEQUENCE "public"."cliente_pk_id_seq" OWNED BY "public"."cliente"."pk_id";

ALTER SEQUENCE "public"."galeria_negocio_pk_id_seq" OWNED BY "public"."galeria_negocio"."pk_id";

ALTER SEQUENCE "public"."negocio_pk_id_seq" OWNED BY "public"."negocio"."pk_id";

ALTER SEQUENCE "public"."pedido_pago_numero_pedido_seq" OWNED BY "public"."pedido_pago"."numero_pedido";

ALTER SEQUENCE "public"."pedido_whatsapp_pk_id_seq" OWNED BY "public"."pedido_whatsapp"."pk_id";

ALTER SEQUENCE "public"."plan_pk_id_seq" OWNED BY "public"."plan"."pk_id";

ALTER SEQUENCE "public"."producto_pk_id_seq" OWNED BY "public"."producto"."pk_id";

ALTER SEQUENCE "public"."resena_pk_id_seq" OWNED BY "public"."resena"."pk_id";

ALTER TABLE "public"."carrito"
  ADD CONSTRAINT "carrito_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."favorito"
  ADD CONSTRAINT "favorito_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."negocio"
  ADD CONSTRAINT "negocio_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id);

ALTER TABLE "public"."carrito"
  ADD CONSTRAINT "carrito_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id);

ALTER TABLE "public"."galeria_negocio"
  ADD CONSTRAINT "galeria_negocio_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."pedido_pago"
  ADD CONSTRAINT "pedido_pago_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id);

ALTER TABLE "public"."pedido_pago"
  ADD CONSTRAINT "pedido_pago_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id);

ALTER TABLE "public"."pedido_whatsapp"
  ADD CONSTRAINT "pedido_whatsapp_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id);

ALTER TABLE "public"."pedido_whatsapp"
  ADD CONSTRAINT "pedido_whatsapp_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id);

ALTER TABLE "public"."negocio"
  ADD CONSTRAINT "negocio_fk_plan_id_fkey" FOREIGN KEY (fk_plan_id) REFERENCES public.plan(pk_id);

ALTER TABLE "public"."producto"
  ADD CONSTRAINT "producto_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id);

ALTER TABLE "public"."carrito"
  ADD CONSTRAINT "carrito_fk_producto_id_fkey" FOREIGN KEY (fk_producto_id) REFERENCES public.producto(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."favorito"
  ADD CONSTRAINT "favorito_fk_producto_id_fkey" FOREIGN KEY (fk_producto_id) REFERENCES public.producto(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."producto_visto"
  ADD CONSTRAINT "producto_visto_fk_cliente_id_fkey" FOREIGN KEY (fk_cliente_id) REFERENCES public.cliente(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."producto_visto"
  ADD CONSTRAINT "producto_visto_fk_producto_id_fkey" FOREIGN KEY (fk_producto_id) REFERENCES public.producto(pk_id) ON DELETE CASCADE;

ALTER TABLE "public"."resena"
  ADD CONSTRAINT "resena_fk_negocio_id_fkey" FOREIGN KEY (fk_negocio_id) REFERENCES public.negocio(pk_id) ON DELETE CASCADE;

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."cliente_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."galeria_negocio_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."negocio_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."pedido_pago_numero_pedido_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."pedido_whatsapp_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."plan_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."producto_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."resena_pk_id_seq" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."carrito" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cliente" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."favorito" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."galeria_negocio" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."negocio" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pedido_pago" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pedido_whatsapp" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."plan" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."producto" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."producto_visto" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resena" TO "anon", "authenticated", "postgres", "service_role";

