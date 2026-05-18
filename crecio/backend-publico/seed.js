require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const pool = require('./src/db/db')

const SUPABASE_URL = 'https://eywbardrnscdjaqjhngs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d2JhcmRybnNjZGphcWpobmdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA0NzA5NSwiZXhwIjoyMDk0NjIzMDk1fQ.JH7DMGubdAZhYNMLpQXrQCTxd-p5V5e3uOpDSurGQBY'
const BUCKET = 'imagenes'
const ASSETS_DIR = path.join(__dirname, '../frontend-publico/src/assets')

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const imgUrl = (filename) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`

async function uploadImage(filename) {
  const ext = path.extname(filename).toLowerCase()
  const mimeType = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png'
  const buffer = fs.readFileSync(path.join(ASSETS_DIR, filename))
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: mimeType,
    upsert: true,
  })
  if (error) throw new Error(`Error subiendo ${filename}: ${error.message}`)
  console.log(`  ✓ ${filename}`)
}

const negocios = [
  {
    nombre: 'Polleria El Sabor',
    categoria: 'Restaurante',
    descripcion: 'La mejor polleria del barrio con mas de 15 anos de experiencia. Pollo a la brasa al carbon, jugoso y crocante. Delivery disponible.',
    logo: 'IMG-170.png',
    direccion: 'Jr. Lima 342, Miraflores',
    distrito: 'Miraflores',
    horario: 'Lun-Dom: 12:00 pm - 10:00 pm',
    telefono: '999 123 456',
    whatsapp: '51999123456',
    rating: 4.8,
    total_resenas: 234,
    verificado: true,
    galeria: ['tienda1-img1.png', 'tienda1-img2.png', 'tienda1-img3.png', 'tienda1-img4.png'],
    productos: [
      { nombre: 'Pollo a la brasa 1/4', descripcion: '1/4 de pollo con papas fritas y salsas', precio: 28, imagen: 'tienda1-img1.png', stock: 50, categoria: 'Platos' },
      { nombre: 'Pollo a la brasa 1/2', descripcion: '1/2 pollo con papas y arroz chaufa', precio: 48, imagen: 'tienda1-img2.png', stock: 50, categoria: 'Platos' },
      { nombre: 'Pollo entero mas papas', descripcion: 'Pollo entero con papas y arroz', precio: 82, imagen: 'tienda1-img3.png', stock: 30, categoria: 'Platos' },
      { nombre: 'Anticuchos de corazon', descripcion: '4 brochetas con papa y salsa de rocoto', precio: 18, imagen: 'tienda1-img4.png', stock: 100, categoria: 'Entradas' },
    ],
    resenas: [
      { nombre_autor: 'Maria Elena R.', estrellas: 5, texto: 'El mejor pollo de Miraflores. La piel crocante y la carne jugosa.' },
      { nombre_autor: 'Carlos Vasquez', estrellas: 5, texto: 'Vengo cada domingo con mi familia. Las salsas son increibles.' },
    ],
  },
  {
    nombre: 'Boutique Valentina',
    categoria: 'Moda',
    descripcion: 'Moda femenina exclusiva con las ultimas tendencias. Ropa, accesorios y calzado para toda ocasion.',
    logo: 'IMG-210.png',
    direccion: 'Av. Larco 1205, Miraflores',
    distrito: 'Miraflores',
    horario: 'Lun-Sab: 10:00 am - 8:00 pm',
    telefono: '999 234 567',
    whatsapp: '51999234567',
    rating: 4.9,
    total_resenas: 89,
    verificado: true,
    galeria: ['tienda2-img1.png', 'tienda2-img2.png', 'tienda2-img3.png', 'tienda2-img4.png'],
    productos: [
      { nombre: 'Blusa floral', descripcion: 'Blusa de algodon con estampado floral tallas S-XL', precio: 45, imagen: 'tienda2-img1.png', stock: 30, categoria: 'Tops' },
      { nombre: 'Jeans tiro alto', descripcion: 'Jean de mezclilla stretch corte recto', precio: 89, imagen: 'tienda2-img2.png', stock: 25, categoria: 'Pantalones' },
      { nombre: 'Vestido casual', descripcion: 'Vestido midi de lino para el dia a dia', precio: 120, imagen: 'tienda2-img3.png', stock: 15, categoria: 'Vestidos' },
      { nombre: 'Cartera de cuero', descripcion: 'Cartera artesanal de cuero genuino', precio: 75, imagen: 'tienda2-img4.png', stock: 20, categoria: 'Accesorios' },
    ],
    resenas: [
      { nombre_autor: 'Ana Torres', estrellas: 5, texto: 'Encontre el vestido perfecto para mi graduacion.' },
      { nombre_autor: 'Sofia Ramos', estrellas: 5, texto: 'La mejor boutique de Miraflores.' },
    ],
  },
  {
    nombre: 'Ferreteria Don Carlos',
    categoria: 'Ferreteria',
    descripcion: 'Todo en herramientas, materiales de construccion y articulos del hogar.',
    logo: 'IMG-250.png',
    direccion: 'Calle Los Pinos 78, San Isidro',
    distrito: 'San Isidro',
    horario: 'Lun-Sab: 8:00 am - 6:00 pm',
    telefono: '999 345 678',
    whatsapp: '51999345678',
    rating: 4.7,
    total_resenas: 156,
    verificado: true,
    galeria: ['tienda3-img1.png', 'tienda3-img2.png', 'tienda3-img3.png', 'tienda3-img4.jpg'],
    productos: [
      { nombre: 'Taladro electrico', descripcion: 'Taladro 750W con accesorios incluidos', precio: 180, imagen: 'tienda3-img1.png', stock: 10, categoria: 'Herramientas' },
      { nombre: 'Pintura latex blanca', descripcion: 'Balde 4 litros rendimiento 40m2', precio: 65, imagen: 'tienda3-img2.png', stock: 40, categoria: 'Pinturas' },
      { nombre: 'Juego de llaves', descripcion: 'Set 12 llaves combinadas de acero', precio: 45, imagen: 'tienda3-img3.png', stock: 20, categoria: 'Herramientas' },
      { nombre: 'Cinta metrica', descripcion: 'Cinta metrica 5m con freno de seguridad', precio: 12, imagen: 'tienda3-img4.jpg', stock: 60, categoria: 'Herramientas' },
    ],
    resenas: [
      { nombre_autor: 'Pedro Huanca', estrellas: 5, texto: 'Don Carlos siempre tiene todo lo que necesito.' },
      { nombre_autor: 'Marco Silva', estrellas: 4, texto: 'Buena variedad de productos.' },
    ],
  },
  {
    nombre: 'Panaderia La Tradicion',
    categoria: 'Panaderia',
    descripcion: 'Pan artesanal horneado cada manana con recetas tradicionales de mas de 30 anos.',
    logo: 'IMG-284.png',
    direccion: 'Jr. Cusco 45, Barranco',
    distrito: 'Barranco',
    horario: 'Lun-Dom: 6:00 am - 9:00 pm',
    telefono: '999 456 789',
    whatsapp: '51999456789',
    rating: 4.6,
    total_resenas: 98,
    verificado: true,
    galeria: ['tienda5-img1.jpg', 'tienda5-img2.jpg', 'tienda5-img3.jpg', 'tienda5-img4.jpg'],
    productos: [
      { nombre: 'Pan frances', descripcion: 'Docena de pan frances recien horneado', precio: 6, imagen: 'tienda5-img1.jpg', stock: 100, categoria: 'Panes' },
      { nombre: 'Torta de chocolate', descripcion: 'Torta entera de 1kg con cobertura de chocolate', precio: 55, imagen: 'tienda5-img2.jpg', stock: 10, categoria: 'Tortas' },
      { nombre: 'Empanadas', descripcion: '6 empanadas de carne o pollo al horno', precio: 18, imagen: 'tienda5-img3.jpg', stock: 50, categoria: 'Empanadas' },
      { nombre: 'Croissant mantequilla', descripcion: 'Croissant hojaldrado con mantequilla francesa', precio: 5, imagen: 'tienda5-img4.jpg', stock: 40, categoria: 'Panes' },
    ],
    resenas: [
      { nombre_autor: 'Rosa Mendoza', estrellas: 5, texto: 'El mejor pan del barrio.' },
      { nombre_autor: 'Jorge Quispe', estrellas: 5, texto: 'La torta de chocolate es increible.' },
    ],
  },
  {
    nombre: 'Sant Royal Peru',
    categoria: 'Tecnologia',
    descripcion: 'Especialistas en equipos tecnologicos, accesorios y reparacion de celulares y laptops.',
    logo: 'IMG-324.png',
    direccion: 'Av. Brasil 890, Pueblo Libre',
    distrito: 'Pueblo Libre',
    horario: 'Lun-Sab: 9:00 am - 7:00 pm',
    telefono: '999 567 890',
    whatsapp: '51999567890',
    rating: 4.7,
    total_resenas: 201,
    verificado: true,
    galeria: ['tienda6-img1.jpg', 'tienda6-img2.jpg', 'tienda6-img3.jpg', 'tienda6-img4.jpg'],
    productos: [
      { nombre: 'Audifonos Bluetooth', descripcion: 'Audifonos inalambricos con cancelacion de ruido', precio: 120, imagen: 'tienda6-img1.jpg', stock: 15, categoria: 'Audio' },
      { nombre: 'Cargador rapido', descripcion: 'Cargador 65W compatible con todos los celulares', precio: 35, imagen: 'tienda6-img2.jpg', stock: 30, categoria: 'Accesorios' },
      { nombre: 'Funda para celular', descripcion: 'Funda silicona premium para iPhone y Samsung', precio: 15, imagen: 'tienda6-img3.jpg', stock: 50, categoria: 'Accesorios' },
      { nombre: 'Cable USB-C', descripcion: 'Cable trenzado 2m carga rapida y datos', precio: 18, imagen: 'tienda6-img4.jpg', stock: 40, categoria: 'Cables' },
    ],
    resenas: [
      { nombre_autor: 'Luis Garcia', estrellas: 5, texto: 'Me repararon el celular en 2 horas.' },
      { nombre_autor: 'Diana Flores', estrellas: 4, texto: 'Buena atencion y productos originales.' },
    ],
  },
  {
    nombre: 'Floreria Primavera',
    categoria: 'Flores',
    descripcion: 'Arreglos florales para toda ocasion. Flores frescas importadas y nacionales. Delivery el mismo dia.',
    logo: 'IMG-364.png',
    direccion: 'Calle Las Rosas 12, Surco',
    distrito: 'Surco',
    horario: 'Lun-Dom: 8:00 am - 8:00 pm',
    telefono: '999 678 901',
    whatsapp: '51999678901',
    rating: 5.0,
    total_resenas: 312,
    verificado: true,
    galeria: ['tienda4-img1.png', 'tienda4-img2.png', 'tienda4-img3.png', 'tienda4-img4.jpg'],
    productos: [
      { nombre: 'Ramo de rosas rojas', descripcion: 'Docena de rosas rojas con lazo y tarjeta', precio: 65, imagen: 'tienda4-img1.png', stock: 20, categoria: 'Ramos' },
      { nombre: 'Arreglo primaveral', descripcion: 'Mix de flores de temporada en florero de vidrio', precio: 85, imagen: 'tienda4-img2.png', stock: 15, categoria: 'Arreglos' },
      { nombre: 'Bouquet de bodas', descripcion: 'Ramo personalizado para novias', precio: 150, imagen: 'tienda4-img3.png', stock: 10, categoria: 'Especiales' },
      { nombre: 'Orquideas blancas', descripcion: 'Maceta de orquideas blancas para regalo', precio: 95, imagen: 'tienda4-img4.jpg', stock: 12, categoria: 'Plantas' },
    ],
    resenas: [
      { nombre_autor: 'Carmen Lopez', estrellas: 5, texto: 'Las flores llegaron hermosas y muy frescas.' },
      { nombre_autor: 'Patricia Vega', estrellas: 5, texto: 'El bouquet de bodas quedo perfecto.' },
    ],
  },
]

async function seed() {
  // 1. Subir todas las imagenes a Supabase Storage
  const todasLasImagenes = new Set()
  for (const n of negocios) {
    todasLasImagenes.add(n.logo)
    n.galeria.forEach(f => todasLasImagenes.add(f))
    n.productos.forEach(p => todasLasImagenes.add(p.imagen))
  }

  console.log(`\n📤 Subiendo ${todasLasImagenes.size} imagenes a Supabase Storage...`)
  for (const filename of todasLasImagenes) {
    await uploadImage(filename)
  }

  // 2. Limpiar datos anteriores
  console.log('\n🗑️  Limpiando datos anteriores...')
  await pool.query('DELETE FROM galeria_negocio')
  await pool.query('DELETE FROM resena')
  await pool.query('DELETE FROM producto')
  await pool.query('DELETE FROM negocio')
  console.log('  ✓ Tablas limpiadas')

  // 3. Insertar negocios con URLs de Supabase Storage
  console.log('\n🏪 Insertando negocios...')
  for (const n of negocios) {
    const res = await pool.query(
      `INSERT INTO negocio (nombre, categoria, descripcion, logo_url, direccion, distrito, horario, telefono, whatsapp, rating, total_resenas, verificado, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,TRUE)
       RETURNING pk_id`,
      [n.nombre, n.categoria, n.descripcion, imgUrl(n.logo), n.direccion, n.distrito, n.horario, n.telefono, n.whatsapp, n.rating, n.total_resenas, n.verificado]
    )
    const id = res.rows[0].pk_id
    console.log(`  ✓ ${n.nombre} (id: ${id})`)

    for (let i = 0; i < n.galeria.length; i++) {
      await pool.query(
        'INSERT INTO galeria_negocio (fk_negocio_id, imagen_url, orden) VALUES ($1,$2,$3)',
        [id, imgUrl(n.galeria[i]), i + 1]
      )
    }

    for (const p of n.productos) {
      await pool.query(
        `INSERT INTO producto (fk_negocio_id, nombre, descripcion, precio, imagen_url, stock, categoria, activo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)`,
        [id, p.nombre, p.descripcion, p.precio, imgUrl(p.imagen), p.stock, p.categoria]
      )
    }

    for (const r of n.resenas) {
      await pool.query(
        'INSERT INTO resena (fk_negocio_id, nombre_autor, estrellas, texto) VALUES ($1,$2,$3,$4)',
        [id, r.nombre_autor, r.estrellas, r.texto]
      )
    }
  }

  console.log('\n✅ Listo! Imagenes en Supabase Storage, datos en la BD.')
  await pool.end()
}

seed().catch(err => {
  console.error('\n❌ Error:', err.message)
  pool.end()
  process.exit(1)
})
