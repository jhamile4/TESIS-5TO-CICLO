# CRECIO — Frontend Público

Aplicación web para que clientes exploren negocios locales, vean productos y realicen pedidos por WhatsApp.

## Tecnologías

- React 18 + Vite
- React Router v6
- CSS Variables (sistema de diseño propio)
- Lucide React (íconos)

## Estructura del proyecto

```
src/
├── App.jsx                  # Rutas principales de la aplicación
├── main.jsx                 # Punto de entrada
├── data/
│   └── negociosData.js      # Datos locales de los 6 negocios demo
├── services/
│   ├── api.js               # Llamadas al backend privado (auth, perfil)
│   └── apiPublico.js        # Llamadas al backend público (negocios, productos)
├── components/
│   ├── Auth/                # Guards de ruta (ProtectedRoute, GuestRoute)
│   ├── Navbar/              # Barra de navegación global
│   └── Footer/              # Pie de página
├── layouts/
│   └── PageLayout.jsx       # Layout con Navbar para páginas internas
└── pages/
    ├── LandingPage/         # Página principal (Hero, Directorio, secciones)
    ├── AuthPage/            # Login y Registro
    ├── ClientePage/         # Perfil del cliente con historial de pedidos
    ├── NegocioPage/         # Página pública de negocio (legacy)
    └── TiendaPage/          # Vista completa de tienda con carrito
```

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page con directorio de negocios |
| `/login` | Solo invitados | Inicio de sesión |
| `/register` | Solo invitados | Registro de cuenta |
| `/perfil` | Autenticado | Perfil y pedidos del cliente |
| `/tienda/:slug` | Autenticado | Vista completa de la tienda |

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Variables de entorno

Crear un archivo `.env` en la raíz con:

```
VITE_API_URL=http://localhost:3001
```
