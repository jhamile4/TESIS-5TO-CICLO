# CRECIO 🛍️

Plataforma web para la digitalización de microempresas. Permite a los negocios tener un catálogo digital y a los clientes explorar y contactar por WhatsApp.

Proyecto de Pre-Tesis — Carrera: Diseño y Desarrollo de Software — Tecsup (5to ciclo)

---

## ¿Qué hace la aplicación?

- Los clientes pueden registrarse, explorar negocios y ver sus productos
- Al hacer clic en un producto, se abre WhatsApp con un mensaje listo para enviar
- El sistema guarda un historial de los pedidos realizados
- El marketplace tiene buscador y filtros por categoría de negocio

---

## Tecnologías usadas

**Frontend**
- React + Vite
- React Router DOM
- Axios
- CSS Modules

**Backend**
- Node.js + Express
- PostgreSQL
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)

---

## Estructura del proyecto

```
crecio/
├── backend/
│   ├── index.js
│   └── src/
│       ├── config/        # Conexión a la base de datos
│       ├── controllers/   # Lógica de negocio
│       ├── middlewares/   # Verificación de token
│       ├── models/        # Archivos SQL (schema y datos de prueba)
│       └── routes/        # Endpoints de la API
└── frontend/
    └── src/
        ├── components/    # Componentes reutilizables
        ├── pages/         # Páginas de la aplicación
        └── services/      # Llamadas a la API
```

---

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js instalado
- PostgreSQL instalado y corriendo

### Base de datos

1. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE crecio_db;
```

2. Ejecutar los archivos SQL en orden:
```
backend/src/models/01_schema.sql
backend/src/models/02_seed.sql
```

### Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` basándose en `.env.example` y completar los datos de conexión.

```bash
npm run dev
```

El servidor corre en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

