// Descarga un archivo CSV que Excel abre directamente (separador ";" y BOM para las tildes)
export function descargarCsv(nombreArchivo, filas) {
  const celda = (valor) => {
    const texto = valor === null || valor === undefined ? '' : String(valor)
    return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
  }
  const contenido = '﻿' + filas.map((fila) => fila.map(celda).join(';')).join('\r\n')
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(new Blob([contenido], { type: 'text/csv;charset=utf-8' }))
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

export const fechaArchivo = () => new Date().toLocaleDateString('en-CA')
