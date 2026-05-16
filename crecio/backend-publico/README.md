# CRECIO — Backend API

API REST del proyecto CRECIO desarrollada con Node.js, Express y PostgreSQL.

**Proyecto de Pre-Tesis · Tecsup · 5to Ciclo · Grupo 48**

---

## Tecnologías

- Node.js + Express
- PostgreSQL
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)

---

## Cómo correr el proyecto localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Duplica el archivo `.env.example`, renómbralo a `.env` y completa con tus datos de PostgreSQL:

```bash
cp .env.example .env
```

### 3. Crear la base de datos

En **pgAdmin**, abre el Query Tool y ejecuta:

```sql
CREATE DATABASE crecio_db;
```

Luego, conectado a `crecio_db`, ejecuta los archivos SQL en este orden:

```
src/db/01_schema.sql   ← crea las tablas
src/db/02_seed.sql     ← inserta datos de prueba
```

> Abre cada archivo en el Query Tool de pgAdmin y presiona F5 para ejecutar.

### 4. Iniciar el servidor

```bash
npm run dev
```

El servidor queda disponible en: `http://localhost:3001`

---

## Archivos SQL

| Archivo               | Qué hace                                      |
|-----------------------|-----------------------------------------------|
| `src/db/01_schema.sql` | Crea todas las tablas del proyecto            |
| `src/db/02_seed.sql`   | Inserta negocios y productos de prueba        |

---

## Endpoints

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
