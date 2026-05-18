const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const enviarCodigoVerificacion = async (destinatario, codigo) => {
  await transporter.sendMail({
    from: `"CRECIO" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Verifica tu cuenta en CRECIO',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #00B894; margin-bottom: 8px;">Verifica tu correo</h2>
        <p style="color: #4A5568;">Gracias por registrarte en CRECIO. Usa este codigo para verificar tu cuenta:</p>
        <div style="background: #F0FFF4; border: 2px solid #00B894; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #00B894;">${codigo}</span>
        </div>
        <p style="color: #718096; font-size: 14px;">Este codigo expira en <strong>15 minutos</strong>.</p>
        <p style="color: #718096; font-size: 14px;">Si no creaste una cuenta en CRECIO, ignora este correo.</p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
        <p style="color: #A0AEC0; font-size: 12px;">CRECIO - Plataforma de negocios locales</p>
      </div>
    `,
  })
}

module.exports = { enviarCodigoVerificacion }
