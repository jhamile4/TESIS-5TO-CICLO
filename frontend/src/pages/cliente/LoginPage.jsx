import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();

  // Estado del formulario con los campos email y contraseña
  const [form, setForm]         = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  // Actualiza el campo correspondiente del formulario al escribir
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Envía las credenciales al backend; si son correctas guarda el token y redirige
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { token } = await login(form);

      // Guarda el token en localStorage para mantener la sesión activa
      localStorage.setItem('crecio_token', token);

      // Recarga completa para que el Navbar detecte la nueva sesión
      window.location.href = '/marketplace';
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Iniciar sesión</h1>
        <p className={styles.subtitulo}>Bienvenido de nuevo a CRECIO</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Muestra el mensaje de error si las credenciales son incorrectas */}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.linkTexto}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
