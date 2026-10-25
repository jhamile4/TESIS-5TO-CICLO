import { useNavigate } from 'react-router-dom'
import logoCrecio from '../../assets/logoCrecio.png'

const ACTUALIZADO = '25 de octubre de 2026'

// Correo para solicitudes de datos personales (se define en el hosting con VITE_CONTACTO_EMAIL)
const CONTACTO = import.meta.env.VITE_CONTACTO_EMAIL || ''
const escribenos = CONTACTO ? ` escribiendo a ${CONTACTO} desde el correo de tu cuenta` : ' escribiendo desde el correo de tu cuenta al contacto de CRECIO'

const PRIVACIDAD = {
  titulo: 'Política de privacidad',
  secciones: [
    ['Quiénes somos', 'CRECIO es una plataforma desarrollada como proyecto de tesis que permite a negocios locales del Perú crear su tienda online, recibir pedidos y gestionar su negocio desde un panel.'],
    ['Qué datos recopilamos', 'De los compradores: nombre, correo, contraseña (guardada cifrada), direcciones de entrega y su historial de pedidos, favoritos y reseñas. De los negocios: datos de la tienda (nombre, dirección, horario, contacto, redes, logo y fotos), productos, ventas y gastos registrados en el panel.'],
    ['Para qué los usamos', 'Para mostrar las tiendas, procesar pedidos, enviar correos de verificación, recuperación de contraseña y estado de los pedidos, y para que cada negocio vea sus ventas y finanzas. No vendemos ni compartimos tus datos con fines publicitarios.'],
    ['Pagos', 'Los pagos con tarjeta los procesa Stripe. CRECIO no ve ni guarda los datos de tu tarjeta.'],
    ['Facebook e Instagram', 'Si un negocio conecta su Página de Facebook o su cuenta de Instagram, CRECIO guarda un permiso de acceso (token) solo para publicar el contenido que el propio negocio decide publicar. El negocio puede desconectarlo cuando quiera desde su panel o desde la configuración de su cuenta de Facebook.'],
    ['Inteligencia artificial', 'Los textos que escribes para generar publicaciones o conversar con el asistente se envían a proveedores de IA (Groq y Pollinations) solo para generar la respuesta.'],
    ['Cookies y almacenamiento', 'Usamos el almacenamiento del navegador para mantener tu sesión iniciada y tu carrito. No usamos cookies de publicidad ni de seguimiento.'],
    ['Tus derechos', `Puedes pedir acceder, corregir o eliminar tus datos (Ley N.° 29733 de Protección de Datos Personales del Perú)${escribenos}. Los datos de tu tienda los puedes editar en todo momento desde tu panel. Más detalles en la página «Eliminación de datos».`],
  ],
}

const TERMINOS = {
  titulo: 'Términos de servicio',
  secciones: [
    ['Uso de CRECIO', 'Al crear una cuenta aceptas usar CRECIO de forma lícita. Cada negocio es responsable de la información, los precios, los productos y la atención que ofrece en su tienda.'],
    ['Pedidos y entregas', 'Las entregas (delivery o recojo en tienda) las realiza directamente cada negocio. CRECIO facilita el pedido, el pago y el seguimiento, pero no transporta productos.'],
    ['Pagos y reembolsos', 'Los pagos con tarjeta se procesan con Stripe. Si un negocio cancela un pedido pagado con tarjeta, el pago se reembolsa automáticamente. Los pagos en efectivo se acuerdan con el negocio al momento de la entrega o recojo.'],
    ['Reseñas', 'Solo puede reseñar quien recibió su pedido, una vez por pedido. Las reseñas deben ser respetuosas y basadas en una compra real.'],
    ['Planes', 'Puedes usar el plan gratuito sin tarjeta. Los planes de pago se cobran por adelantado por el periodo elegido.'],
    ['Cuentas', 'Eres responsable de mantener tu contraseña segura. Podemos suspender cuentas que publiquen contenido falso, engañoso o ilegal.'],
    ['Proyecto académico', 'CRECIO es un proyecto de tesis en etapa de validación; algunas funciones pueden cambiar o estar en modo de prueba (por ejemplo, los pagos con tarjeta).'],
  ],
}

// Meta (Facebook) exige una página que explique cómo borrar los datos que la app obtiene de Facebook
const ELIMINACION = {
  titulo: 'Eliminación de datos',
  secciones: [
    ['Qué guarda CRECIO de Facebook e Instagram', 'Si conectaste tu Página de Facebook o tu cuenta de Instagram, CRECIO guarda el nombre de la cuenta, su identificador y un permiso de acceso (token) para publicar lo que tú decides. No guarda tus mensajes, amigos ni datos personales de tu perfil.'],
    ['Quitar la conexión desde CRECIO', 'Entra a tu panel → Marketing IA → Redes conectadas y presiona «Desconectar» en cada cuenta. El permiso de acceso se borra de inmediato de nuestra base de datos.'],
    ['Quitar la conexión desde Facebook', 'En Facebook ve a Configuración y privacidad → Configuración → Integraciones comerciales (o Apps y sitios web), elige la app de CRECIO y presiona «Eliminar». Desde ese momento CRECIO ya no puede publicar en tu nombre.'],
    ['Borrar toda tu cuenta de CRECIO', `Para borrar tu cuenta, tu tienda, tus productos, pedidos y cualquier dato que obtuvimos de Facebook, solicítalo${escribenos} indicando «Eliminar mi cuenta». Lo hacemos en un máximo de 30 días y te confirmamos por correo. Los comprobantes de pagos se conservan solo el tiempo que exige la ley.`],
  ],
}

const DOCUMENTOS = { terminos: TERMINOS, privacidad: PRIVACIDAD, eliminacion: ELIMINACION }

function LegalPage({ tipo }) {
  const navigate = useNavigate()
  const doc = DOCUMENTOS[tipo] || PRIVACIDAD

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="h-16 border-b border-[#E5E7EB] bg-white flex items-center px-4 md:px-8">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <img src={logoCrecio} alt="CRECIO" className="h-7 w-auto object-contain" />
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#111827]">{doc.titulo}</h1>
        <p className="text-sm text-[#6B7280] mt-2">Última actualización: {ACTUALIZADO}</p>

        <div className="mt-8 flex flex-col gap-6">
          {doc.secciones.map(([titulo, texto]) => (
            <section key={titulo}>
              <h2 className="text-lg font-semibold text-[#111827] mb-1.5">{titulo}</h2>
              <p className="text-sm text-[#374151] leading-relaxed">{texto}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex gap-4 text-sm">
          <button onClick={() => navigate(tipo === 'terminos' ? '/privacidad' : '/terminos')} className="text-[#0D9488] font-semibold hover:underline cursor-pointer">
            Ver {tipo === 'terminos' ? 'política de privacidad' : 'términos de servicio'}
          </button>
          <button onClick={() => navigate('/')} className="text-[#6B7280] hover:underline cursor-pointer">Volver al inicio</button>
        </div>
      </main>
    </div>
  )
}

export default LegalPage
