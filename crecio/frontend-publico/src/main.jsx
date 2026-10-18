import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { consumirSesionDeUrl } from './services/sesion'

// Primero toma la sesión si venimos desde el panel, luego muestra la app
consumirSesionDeUrl().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})