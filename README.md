# CRECIO

Plataforma web para la digitalización de microempresas (MYPE). Permite a los negocios tener un catálogo digital y a los clientes explorar productos y contactar por WhatsApp.

Proyecto de Pre-Tesis — Carrera: Diseño y Desarrollo de Software — Tecsup (5to ciclo) — Grupo 48

---

## ¿Qué hace la aplicación?

- Los clientes pueden registrarse, explorar negocios y ver sus productos
- Al hacer clic en un producto, se abre WhatsApp con un mensaje listo para enviar
- El sistema guarda un historial de los pedidos realizados por WhatsApp
- El marketplace tiene buscador y filtros por categoría de negocio

---

## Tecnologías usadas

**Frontend**
- React + Vite
- React Router DOM
- CSS (sin librerías externas)

**Backend**
- Node.js + Express
- PostgreSQL
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)

---

## Estructura del proyecto

```
crecio/
└── crecio/
    ├── backend-publico/        # API REST (Node.js + Express)
    │   ├── index.js
    │   ├── .env.example
    │   └── src/
    │       ├── controllers/    # Lógica de cada endpoint
    │       ├── db/             # Archivos SQL y conexión a PostgreSQL
    │       ├── middleware/     # Verificación de token JWT
    │       └── routes/         # Definición de rutas
    └── frontend-publico/       # Interfaz de usuario (React + Vite)
        └── src/
            ├── assets/         # Imágenes locales
            ├── components/     # Componentes reutilizables (Navbar, guards)
            ├── layouts/        # Layout con Navbar
            ├── pages/          # Páginas de la aplicación
            └── services/       # Llamadas al backend
```

---

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL instalado y corriendo

### 1. Base de datos

En pgAdmin (Query Tool), ejecutar los archivos en este orden:

```
crecio/backend-publico/src/db/01_schema.sql   ← crea las tablas
crecio/backend-publico/src/db/02_seed.sql     ← inserta datos de prueba
```

### 2. Backend

```bash
cd crecio/backend-publico
npm install
cp .env.example .env
# Editar .env con tus datos de PostgreSQL
npm run dev
```

El servidor corre en: `http://localhost:3001`

### 3. Frontend

```bash
cd crecio/frontend-publico
npm install
npm run dev
```

El frontend corre en: `http://localhost:5173`

---

## Endpoints principales

| Método | Ruta                           | Acceso     | Descripción                   |
|--------|--------------------------------|------------|-------------------------------|
| POST   | /api/auth/register             | Público    | Registrar nuevo cliente       |
| POST   | /api/auth/login                | Público    | Iniciar sesión                |
| GET    | /api/auth/me                   | Protegido  | Datos del cliente autenticado |
| GET    | /api/negocios                  | Público    | Listar todos los negocios     |
| GET    | /api/negocios/:id              | Público    | Ver un negocio                |
| GET    | /api/productos/negocio/:id     | Público    | Productos de un negocio       |
| POST   | /api/pedidos                   | Protegido  | Registrar pedido WhatsApp     |
| GET    | /api/pedidos/mis-pedidos       | Protegido  | Historial de pedidos          |
