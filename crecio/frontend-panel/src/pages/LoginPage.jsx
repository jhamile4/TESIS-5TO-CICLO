import { useState } from 'react'
import { ChartNoAxesCombined, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { iniciarSesion } from '../services/apiAdmin'
import { PUBLIC_URL } from '../config/env'

export default function LoginPage() {
  const navigate = useNavigate(); const { login } = useAuth()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); try { const data = await iniciarSesion(email, password); login(data); navigate('/') } catch (err) { setError(err.message) } finally { setLoading(false) } }
  return <main className="login-shell"><form className="login-card" onSubmit={submit}><div className="brand-mark"><ChartNoAxesCombined size={28} /></div><p className="eyebrow">CRECIO PARA NEGOCIOS</p><h1>Gestiona tu negocio</h1><p className="muted">Accede a tus ventas, inventario y clientes.</p><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="tu@correo.com" /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Tu contraseña" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar al panel'}<ChevronRight size={17} /></button><a className="public-link" href={PUBLIC_URL}>Volver a CRECIO público</a></form></main>
}
