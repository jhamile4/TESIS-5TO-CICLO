# CRECIO — Backend Público

API REST del proyecto CRECIO. Gestiona autenticación de clientes, negocios, productos, galería, reseñas y pedidos por WhatsApp.

**Proyecto de Pre-Tesis · Tecsup · 5to Ciclo**

---

## Tecnologías

- Node.js + Express
- PostgreSQL (pg)
- JWT (autenticación)
- bcryptjs (hash de contraseñas)
- dotenv, cors, nodemon

---

## Estructura del proyecto

```
backend-publico/
├── index.js                        # Entrada principal, configura Express y rutas
├── .env.example                    # Variables de entorno requeridas
└── src/
    ├── db/
    │   ├── db.js                   # Pool de conexión a PostgreSQL
    │   ├── 01_schema.sql           # Creación de tablas
    │   ├── 02_seed.sql             # Datos de prueba
    │   └── 03_migration.sql        # Columnas y tablas adicionales
    ├── middleware/
    │   └── verifyToken.js          # Middleware de autenticación JWT
    ├── controllers/
    │   ├── authController.js       # Registro, login y perfil del cliente
    │   ├── businessController.js   # Listado y detalle de negocios
    │   ├── productController.js    # Productos por negocio
    │   ├── orderController.js      # Registro de pedidos por WhatsApp
    │   ├── galeriaController.js    # Imágenes de galería por negocio
    │   └── resenaController.js     # Reseñas por negocio
    └── routes/
        ├── authRoutes.js           # /api/auth/*
        ├── businessRoutes.js       # /api/negocios/*
        ├── productRoutes.js        # /api/productos/*
        ├── orderRoutes.js          # /api/pedidos/*
        ├── galeriaRoutes.js        # /api/negocios/:id/galeria
        └── resenaRoutes.js         # /api/negocios/:id/resenas
```

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro de cliente |
| POST | `/api/auth/login` | No | Login, retorna JWT |
| GET | `/api/auth/me` | Sí | Datos del cliente autenticado |
| GET | `/api/negocios` | No | Lista de negocios |
| GET | `/api/negocios/:id` | No | Detalle de un negocio |
| GET | `/api/negocios/:id/galeria` | No | Galería del negocio |
| GET | `/api/negocios/:id/resenas` | No | Reseñas del negocio |
| GET | `/api/productos/negocio/:id` | No | Productos de un negocio |
| POST | `/api/pedidos` | Sí | Registrar pedido por WhatsApp |
| GET | `/api/pedidos/mis-pedidos` | Sí | Pedidos del cliente autenticado |

---

## Instalación y uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus datos de PostgreSQL y JWT
```

### 3. Crear la base de datos

En pgAdmin, crear la base de datos `crecio_db` y ejecutar los SQL en orden:

```
src/db/01_schema.sql    ← crea las tablas
src/db/02_seed.sql      ← inserta datos de prueba
src/db/03_migration.sql ← agrega columnas y tablas adicionales
```

### 4. Iniciar el servidor

```bash
npm run dev   # desarrollo con nodemon
npm start     # producción
```

El servidor queda disponible en: `http://localhost:3001`

---

## Variables de entorno (.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crecio_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_jwt
PORT=3001
```
