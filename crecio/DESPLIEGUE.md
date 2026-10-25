# Despliegue de CRECIO en línea

CRECIO tiene tres partes que se publican por separado:

| Parte | Carpeta | Dónde se publica | Costo |
|---|---|---|---|
| API (backend) | `crecio/backend-publico` | **Render** (Web Service) | Gratis |
| Sitio público (tiendas) | `crecio/frontend-publico` | **Vercel** | Gratis |
| Panel del negocio | `crecio/frontend-panel` | **Vercel** | Gratis |
| Base de datos y archivos | — | **Supabase** (ya está en línea) | Gratis |

> El orden importa: primero la API (para tener su URL), luego los dos frontends,
> y al final se vuelve a la API para autorizar los dominios de los frontends.

---

## 0. Antes de empezar

1. **El código debe estar en GitHub.** Render y Vercel lo descargan desde ahí.
   El repositorio actual está en la organización `Tecsupsoft` (GitHub Classroom).
   Si Render o Vercel no pueden verlo, haz un *fork* a tu cuenta personal o pide
   acceso a la organización.
2. Ten a mano los valores de tu archivo `backend-publico/.env` (no lo subas a GitHub).
3. Crea cuentas gratuitas en [render.com](https://render.com) y [vercel.com](https://vercel.com)
   entrando con tu cuenta de GitHub.

---

## 1. API en Render

1. En Render: **New → Web Service** y elige el repositorio.
2. Configura:
   - **Root Directory:** `crecio/backend-publico`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. En **Environment Variables** agrega las mismas variables de tu `.env`
   (la lista completa está en `backend-publico/.env.example`), y además:
   - `NODE_ENV` = `production`
   - `CORS_ORIGINS` = déjalo como `http://localhost:5173` por ahora; lo cambias en el paso 4.
   - No pongas `PORT`: Render lo asigna solo.
4. Pulsa **Create Web Service** y espera a que diga *Live*.
5. Abre la URL que te da (por ejemplo `https://crecio-api.onrender.com`).
   Debe mostrar `{"mensaje":"API CRECIO funcionando"}`.

> **Importante para la demo:** en el plan gratis, Render "duerme" la API tras
> 15 minutos sin uso y la primera petición tarda ~50 segundos en despertarla.
> **Abre la URL de la API un par de minutos antes de presentar.**

---

## 2. Sitio público en Vercel

1. En Vercel: **Add New → Project** y elige el repositorio.
2. Configura:
   - **Root Directory:** `crecio/frontend-publico`
   - **Framework Preset:** Vite (lo detecta solo)
3. En **Environment Variables** (lista en `frontend-publico/.env.example`):
   - `VITE_API_URL` = `https://TU-API.onrender.com/api`
   - `VITE_PANEL_URL` = déjalo vacío por ahora; lo completas en el paso 4.
   - `VITE_STRIPE_PUBLIC_KEY` = tu clave pública de Stripe (`pk_test_...`)
4. **Deploy.** Anota la URL (por ejemplo `https://crecio.vercel.app`).

## 3. Panel en Vercel

Igual que el paso 2, pero:
- **Root Directory:** `crecio/frontend-panel`
- Variables (lista en `frontend-panel/.env.example`):
  - `VITE_API_URL` = `https://TU-API.onrender.com/api`
  - `VITE_PUBLIC_URL` = la URL del sitio público del paso 2

Anota la URL (por ejemplo `https://crecio-panel.vercel.app`).

---

## 4. Conectar las tres partes

1. **Render (API):**
   - `CORS_ORIGINS` = `https://crecio.vercel.app,https://crecio-panel.vercel.app`
     (tus dos URLs de Vercel, separadas por coma, sin `/` al final)
   - `PANEL_URL` = `https://crecio-panel.vercel.app`
   - Guarda: Render reinicia la API solo.
2. **Vercel (sitio público):** pon `VITE_PANEL_URL` = la URL del panel y haz
   **Redeploy** (las variables `VITE_` se aplican al construir, no en caliente).

---

## 4.1 Publicaciones programadas (que no se duerma la API)

La API revisa cada minuto si hay publicaciones programadas cuya hora llegó. En el plan gratis
de Render la API se duerme sin visitas, y dormida no revisa. Para evitarlo:

1. En Render agrega la variable `CRON_SECRET` con un texto largo inventado (mínimo 16 caracteres).
2. Crea una cuenta gratis en [cron-job.org](https://cron-job.org) y un trabajo nuevo:
   - **URL:** `https://TU-API.onrender.com/api/tareas/publicaciones-programadas`
   - **Método:** `POST` · **Frecuencia:** cada 5 minutos
   - **Cabecera (Header):** `x-cron-secret` = el mismo valor de `CRON_SECRET`
3. Así la API se despierta y publica lo pendiente (con hasta 5 minutos de diferencia).

---

## 5. Comprobar que todo funciona

- [ ] La URL de la API muestra el mensaje de bienvenida.
- [ ] El sitio público carga el directorio de tiendas (si sale vacío o con error,
      revisa `VITE_API_URL` y `CORS_ORIGINS`).
- [ ] Iniciar sesión, comprar con la tarjeta de prueba `4242 4242 4242 4242`
      (cualquier fecha futura y CVC).
- [ ] "Mi panel" abre el panel con la misma cuenta y el pedido aparece en **Ventas**.
- [ ] Cambiar el estado del pedido y verlo avanzar en el perfil del cliente.
- [ ] "¿Olvidaste tu contraseña?" envía el correo con el código.
- [ ] Recargar la página en una ruta interna (por ejemplo `/perfil`) no da error 404
      (lo resuelven los archivos `vercel.json`).

---

## Notas

- **Base de datos:** las migraciones de `crecio/supabase/migrations` ya están aplicadas
  en Supabase. Si algún día creas un proyecto de Supabase nuevo, ejecútalas en orden
  en el SQL Editor.
- **Correo:** Gmail exige una *contraseña de aplicación* en `EMAIL_PASS`
  (Cuenta de Google → Seguridad → Verificación en dos pasos → Contraseñas de aplicaciones).
- **Pagos:** Stripe no acepta cuentas de empresas peruanas en producción. Para la tesis se
  usa en **modo de prueba**; en un lanzamiento real la pasarela se reemplazaría por
  Culqi, Izipay o Mercado Pago.
- **Facebook / Instagram:** agrega `https://TU-PANEL.vercel.app/marketing` como URI de
  redirección válida en la app de Meta (Inicio de sesión con Facebook → Configuración).
  En la app de Meta usa también `https://TU-SITIO.vercel.app/privacidad`,
  `/terminos` y `/eliminacion-datos` como URLs de política, condiciones y eliminación de datos.
- **Cada cambio que subas a GitHub** se vuelve a publicar solo en Render y Vercel.
