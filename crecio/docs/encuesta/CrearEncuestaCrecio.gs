/**
 * Crea en tu Google Drive la encuesta de validación de CRECIO (Google Forms)
 * y una hoja de cálculo donde caen las respuestas.
 *
 * Cómo usarlo:
 *   1. Entra a https://script.google.com con tu cuenta de Google → "Nuevo proyecto".
 *   2. Borra lo que aparece, pega TODO este archivo y guarda (Ctrl + S).
 *   3. Arriba elige la función "crearEncuesta" y presiona "Ejecutar".
 *   4. Google te pedirá permiso (es tu propio script): Revisar permisos → tu cuenta → Permitir.
 *   5. Abre "Registro de ejecución": ahí salen el enlace para ENVIAR y el enlace para EDITAR.
 */
function crearEncuesta() {
  const form = FormApp.create('Encuesta CRECIO — ¿Cómo vendes y cuánto pagarías por crecer en internet?');
  form.setDescription(
    'Hola 👋 Somos estudiantes de Tecsup y estamos creando CRECIO, una plataforma para que los ' +
    'negocios pequeños del Perú vendan por internet. Tu opinión nos ayuda a decidir qué construir y ' +
    'a qué precio. Toma unos 5 minutos, es anónima y no vendemos tus datos.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setConfirmationMessage('¡Gracias! Tu respuesta nos ayuda muchísimo 💚');

  const numero = FormApp.createTextValidation()
    .setHelpText('Escribe solo el número, por ejemplo 25')
    .requireNumberGreaterThanOrEqualTo(0)
    .build();

  // ---------- Sección 1: tu negocio ----------
  form.addSectionHeaderItem().setTitle('1. Sobre tu negocio');

  form.addMultipleChoiceItem().setTitle('¿Cuál es el rubro de tu negocio?').setRequired(true)
    .setChoiceValues([
      'Restaurante / Pollería / Comida', 'Bodega / Minimarket', 'Panadería / Pastelería',
      'Ropa y accesorios', 'Ferretería', 'Florería', 'Belleza y cuidado personal',
      'Tecnología / Celulares', 'Servicios',
    ]).showOtherOption(true);

  form.addMultipleChoiceItem().setTitle('¿Cuántas personas trabajan en tu negocio (contándote)?').setRequired(true)
    .setChoiceValues(['Solo yo', '2 a 5', '6 a 10', 'Más de 10']);

  form.addMultipleChoiceItem().setTitle('¿Tu negocio tiene RUC?').setRequired(true)
    .setChoiceValues(['Sí, RUC 20 (empresa)', 'Sí, RUC 10 (persona natural)', 'Todavía no', 'Prefiero no decir']);

  form.addTextItem().setTitle('¿En qué distrito está tu negocio?').setRequired(false);

  form.addMultipleChoiceItem().setTitle('¿Cómo llevas hoy tus ventas e inventario?').setRequired(true)
    .setChoiceValues([
      'En un cuaderno', 'En Excel', 'Con un sistema de caja o POS (ej. caja registradora, sistema de punto de venta)',
      'Con una app en el celular', 'No llevo registro',
    ]).showOtherOption(true);

  // ---------- Sección 2: cómo vendes ----------
  form.addPageBreakItem().setTitle('2. Cómo vendes hoy');

  form.addCheckboxItem().setTitle('¿Por dónde recibes pedidos? (marca todas las que uses)').setRequired(true)
    .setChoiceValues([
      'Solo en el local', 'WhatsApp', 'Facebook', 'Instagram', 'TikTok',
      'Apps de delivery (Rappi, PedidosYa, etc.)', 'Mi propia página web',
    ]).showOtherOption(true);

  form.addMultipleChoiceItem().setTitle('¿Cada cuánto publicas en tus redes sociales?').setRequired(true)
    .setChoiceValues(['Todos los días', 'Varias veces por semana', 'Una vez por semana', 'Casi nunca', 'No tengo redes del negocio']);

  form.addCheckboxItem().setTitle('¿Qué es lo que MÁS te cuesta hoy? (máximo 3)').setRequired(true)
    .setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(3).build())
    .setChoiceValues([
      'Conseguir clientes nuevos', 'Tener tiempo para publicar en redes', 'Saber qué escribir o qué foto poner',
      'Ordenar los pedidos de WhatsApp', 'Controlar mi stock', 'Saber cuánto gano realmente',
      'Cobrar con tarjeta o Yape', 'Las comisiones de las apps de delivery',
    ]).showOtherOption(true);

  form.addMultipleChoiceItem().setTitle('¿Has pagado alguna vez por una herramienta digital para tu negocio?').setRequired(true)
    .setChoiceValues(['Sí, pago una ahora', 'Sí, pero la dejé', 'Nunca']);

  form.addTextItem().setTitle('Si pagas alguna, ¿cuál es y cuánto pagas al mes (en soles)?').setRequired(false);

  // ---------- Sección 3: la idea ----------
  form.addPageBreakItem().setTitle('3. Te presentamos CRECIO')
    .setHelpText(
      'CRECIO te da, en un solo lugar:\n' +
      '• Tu tienda online con catálogo, carrito y pedidos por delivery o recojo (sin comisión por venta).\n' +
      '• Aparecer en el directorio de negocios de tu zona.\n' +
      '• Un panel para ver tus pedidos, inventario, ventas y ganancias.\n' +
      '• Marketing con IA: escribe el texto y crea la imagen de tu publicación, y la publica o programa en Facebook e Instagram.\n' +
      '• Pagos con tarjeta o en efectivo.'
    );

  form.addCheckboxItem().setTitle('¿Qué funciones te serían más útiles? (marca las que quieras)').setRequired(true)
    .setChoiceValues([
      'Tienda online con pedidos', 'Aparecer en el directorio de mi zona', 'Control de inventario',
      'Ver mis ventas y ganancias', 'Publicaciones con IA', 'Publicar y programar en Facebook / Instagram',
      'Cobrar con tarjeta',
    ]).showOtherOption(true);

  form.addScaleItem().setTitle('¿Qué tan útil sería CRECIO para tu negocio?').setRequired(true)
    .setBounds(1, 5).setLabels('Nada útil', 'Muy útil');

  // ---------- Sección 4: precio (método Van Westendorp) ----------
  form.addPageBreakItem().setTitle('4. Precio')
    .setHelpText('Piensa en un pago MENSUAL por CRECIO con todas las funciones de arriba. No hay respuestas buenas o malas.');

  form.addTextItem().setTitle('¿A qué precio al mes (S/) te parecería TAN BARATO que dudarías de su calidad?')
    .setRequired(true).setValidation(numero);
  form.addTextItem().setTitle('¿A qué precio al mes (S/) te parecería una BUENA COMPRA, barato para lo que ofrece?')
    .setRequired(true).setValidation(numero);
  form.addTextItem().setTitle('¿A qué precio al mes (S/) empezaría a parecerte CARO, pero aún lo pensarías?')
    .setRequired(true).setValidation(numero);
  form.addTextItem().setTitle('¿A qué precio al mes (S/) sería DEMASIADO CARO y no lo comprarías?')
    .setRequired(true).setValidation(numero);

  form.addMultipleChoiceItem().setTitle('Si CRECIO costara S/ 39 al mes, ¿lo contratarías?').setRequired(true)
    .setChoiceValues(['Seguro que sí', 'Probablemente sí', 'No estoy seguro', 'Probablemente no', 'Seguro que no']);

  form.addMultipleChoiceItem().setTitle('¿Cómo preferirías pagar?').setRequired(true)
    .setChoiceValues(['Mensual', 'Anual con descuento (ej. S/ 390 al año = 2 meses gratis)', 'Empezar gratis y pagar cuando venda más']);

  // ---------- Sección 5: contacto ----------
  form.addPageBreakItem().setTitle('5. Último paso (opcional)');
  form.addTextItem().setTitle('Si quieres probar CRECIO gratis antes que nadie, déjanos tu WhatsApp o correo').setRequired(false);

  // Hoja de cálculo para las respuestas
  const hoja = SpreadsheetApp.create('Respuestas — Encuesta CRECIO');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());

  Logger.log('ENLACE PARA ENVIAR (WhatsApp, redes): ' + form.getPublishedUrl());
  Logger.log('ENLACE PARA EDITAR la encuesta: ' + form.getEditUrl());
  Logger.log('HOJA DE RESPUESTAS: ' + hoja.getUrl());
}
