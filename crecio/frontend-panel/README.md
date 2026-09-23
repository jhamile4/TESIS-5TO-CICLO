# Panel de negocios CRECIO

Aplicación independiente para propietarios de negocios. Consume la API central
del proyecto mediante `VITE_API_URL` (por defecto `http://localhost:3001/api`).

## Ejecución local

1. Inicia `backend-publico` en el puerto 3001.
2. En esta carpeta instala dependencias con `npm install`.
3. Ejecuta `npm run dev`. El panel se abre en `http://localhost:5174`.

El primer módulo implementado es el dashboard, que consulta `GET /api/admin/resumen`.
