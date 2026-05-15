import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  // Estado del formulario con nombre, email y contraseña
  const [form, setForm]         = useState({ nombre: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  // Actualiza el campo correspondiente del formulario al escribir
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Envía los datos al backend para crear la cuenta; si tiene éxito guarda el token y redirige
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { token } = await register(form);

      // Guarda el token en localStorage para iniciar sesión automáticamente tras el registro
      localStorage.setItem('crecio_token', token);

      // Recarga completa para que el Navbar detecte la nueva sesión
      window.location.href = '/marketplace';
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Crear cuenta</h1>
        <p className={styles.subtitulo}>Únete a CRECIO gratis</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              className={styles.input}
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

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

          {/* Muestra el mensaje de error si el registro falla (ej. email ya registrado) */}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.linkTexto}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
