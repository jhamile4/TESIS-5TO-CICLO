// ─────────────────────────────────────────────────────────────────────────────
// negociosData.js — Datos compartidos de los 6 negocios de CRECIO
// Usado por: Directorio, NegocioModal y TiendaPage
// ─────────────────────────────────────────────────────────────────────────────

import polleriaIMG   from '../assets/IMG-170.png'
import boutiqueIMG   from '../assets/IMG-210.png'
import ferreteriaIMG from '../assets/IMG-250.png'
import panaderiaIMG  from '../assets/IMG-284.png'
import barberiaIMG   from '../assets/IMG-324.png'
import floreriaIMG   from '../assets/IMG-364.png'

import t1img1 from '../assets/tienda1-img1.png'
import t1img2 from '../assets/tienda1-img2.png'
import t1img3 from '../assets/tienda1-img3.png'
import t1img4 from '../assets/tienda1-img4.png'
import t2img1 from '../assets/tienda2-img1.png'
import t2img2 from '../assets/tienda2-img2.png'
import t2img3 from '../assets/tienda2-img3.png'
import t2img4 from '../assets/tienda2-img4.png'
import t3img1 from '../assets/tienda3-img1.png'
import t3img2 from '../assets/tienda3-img2.png'
import t3img3 from '../assets/tienda3-img3.png'
import t3img4 from '../assets/tienda3-img4.jpg'
import t4img1 from '../assets/tienda4-img1.png'
import t4img2 from '../assets/tienda4-img2.png'
import t4img3 from '../assets/tienda4-img3.png'
import t4img4 from '../assets/tienda4-img4.jpg'
import t5img1 from '../assets/tienda5-img1.jpg'
import t5img2 from '../assets/tienda5-img2.jpg'
import t5img3 from '../assets/tienda5-img3.jpg'
import t5img4 from '../assets/tienda5-img4.jpg'
import t6img1 from '../assets/tienda6-img1.jpg'
import t6img2 from '../assets/tienda6-img2.jpg'
import t6img3 from '../assets/tienda6-img3.jpg'
import t6img4 from '../assets/tienda6-img4.jpg'

export const negocios = [
  {
    id: 0,
    slug: 'polleria-el-sabor',
    img: polleriaIMG,
    nombre: 'Pollería El Sabor',
    categoria: 'Restaurante',
    rating: '4.8',
    resenas: '234',
    direccion: 'Jr. Lima 342, Miraflores',
    horario: 'Lun-Dom: 12:00 pm - 10:00 pm',
    telefono: '999 123 456',
    whatsapp: '51936780724',
    desc: 'La mejor pollería del barrio con más de 15 años de experiencia. Pollo a la brasa al carbón, jugoso y crocante. Delivery disponible.',
    galeria: [t1img1, t1img2, t1img3, t1img4],
    productos: [
      { img: t1img1, nombre: 'Pollo a la brasa 1/4', desc: '1/4 de pollo con papas fritas y salsas', precio: 28 },
      { img: t1img2, nombre: 'Pollo a la brasa 1/2', desc: '1/2 pollo con papas y arroz chaufa', precio: 48 },
      { img: t1img3, nombre: 'Pollo entero más papas', desc: 'Pollo entero con papas y arroz', precio: 82 },
      { img: t1img4, nombre: 'Anticuchos de corazón', desc: '4 brochetas con papa y salsa de rocoto', precio: 18 },
    ],
    reviews: [
      { nombre: 'María Elena R.', tiempo: '2 semanas atrás', estrellas: 5, texto: 'El mejor pollo de Miraflores. La piel crocante y la carne jugosa.' },
      { nombre: 'Carlos Vásquez', tiempo: '1 mes atrás', estrellas: 5, texto: 'Vengo cada domingo con mi familia. Las salsas son increíbles.' },
    ],
  },
  {
    id: 1,
    slug: 'boutique-valentina',
    img: boutiqueIMG,
    nombre: 'Boutique Valentina',
    categoria: 'Moda',
    rating: '4.9',
    resenas: '89',
    direccion: 'Av. Larco 1205, Miraflores',
    horario: 'Lun-Sab: 10:00 am - 8:00 pm',
    telefono: '999 234 567',
    whatsapp: '51936780724',
    desc: 'Moda femenina exclusiva con las últimas tendencias. Ropa, accesorios y calzado para toda ocasión.',
    galeria: [t2img1, t2img2, t2img3, t2img4],
    productos: [
      { img: t2img1, nombre: 'Blusa floral', desc: 'Blusa de algodón con estampado floral tallas S-XL', precio: 45 },
      { img: t2img2, nombre: 'Jeans tiro alto', desc: 'Jean de mezclilla stretch corte recto', precio: 89 },
      { img: t2img3, nombre: 'Vestido casual', desc: 'Vestido midi de lino para el día a día', precio: 120 },
      { img: t2img4, nombre: 'Cartera de cuero', desc: 'Cartera artesanal de cuero genuino', precio: 75 },
    ],
    reviews: [
      { nombre: 'Ana Torres', tiempo: '1 semana atrás', estrellas: 5, texto: 'Encontré el vestido perfecto para mi graduación.' },
      { nombre: 'Sofía Ramos', tiempo: '3 semanas atrás', estrellas: 5, texto: 'La mejor boutique de Miraflores.' },
    ],
  },
  {
    id: 2,
    slug: 'ferreteria-don-carlos',
    img: ferreteriaIMG,
    nombre: 'Ferretería Don Carlos',
    categoria: 'Ferretería',
    rating: '4.7',
    resenas: '156',
    direccion: 'Calle Los Pinos 78, San Isidro',
    horario: 'Lun-Sab: 8:00 am - 6:00 pm',
    telefono: '999 345 678',
    whatsapp: '51936780724',
    desc: 'Todo en herramientas, materiales de construcción y artículos del hogar.',
    galeria: [t3img1, t3img2, t3img3, t3img4],
    productos: [
      { img: t3img1, nombre: 'Taladro eléctrico', desc: 'Taladro 750W con accesorios incluidos', precio: 180 },
      { img: t3img2, nombre: 'Pintura látex blanca', desc: 'Balde 4 litros rendimiento 40m2', precio: 65 },
      { img: t3img3, nombre: 'Juego de llaves', desc: 'Set 12 llaves combinadas de acero', precio: 45 },
      { img: t3img4, nombre: 'Cinta métrica', desc: 'Cinta métrica 5m con freno de seguridad', precio: 12 },
    ],
    reviews: [
      { nombre: 'Pedro Huanca', tiempo: '2 semanas atrás', estrellas: 5, texto: 'Don Carlos siempre tiene todo lo que necesito.' },
      { nombre: 'Marco Silva', tiempo: '1 mes atrás', estrellas: 4, texto: 'Buena variedad de productos.' },
    ],
  },
  {
    id: 3,
    slug: 'panaderia-la-tradicion',
    img: panaderiaIMG,
    nombre: 'Panadería La Tradición',
    categoria: 'Panadería',
    rating: '4.6',
    resenas: '98',
    direccion: 'Jr. Cusco 45, Barranco',
    horario: 'Lun-Dom: 6:00 am - 9:00 pm',
    telefono: '999 456 789',
    whatsapp: '51936780724',
    desc: 'Pan artesanal horneado cada mañana con recetas tradicionales de más de 30 años.',
    galeria: [t4img1, t4img2, t4img3, t4img4],
    productos: [
      { img: t4img1, nombre: 'Pan francés', desc: 'Docena de pan francés recién horneado', precio: 6 },
      { img: t4img2, nombre: 'Torta de chocolate', desc: 'Torta entera de 1kg con cobertura de chocolate', precio: 55 },
      { img: t4img3, nombre: 'Empanadas', desc: '6 empanadas de carne o pollo al horno', precio: 18 },
      { img: t4img4, nombre: 'Croissant mantequilla', desc: 'Croissant hojaldrado con mantequilla francesa', precio: 5 },
    ],
    reviews: [
      { nombre: 'Rosa Mendoza', tiempo: '3 días atrás', estrellas: 5, texto: 'El mejor pan del barrio.' },
      { nombre: 'Jorge Quispe', tiempo: '2 semanas atrás', estrellas: 5, texto: 'La torta de chocolate es increíble.' },
    ],
  },
  {
    id: 4,
    slug: 'sant-royal-peru',
    img: barberiaIMG,
    nombre: 'Sant Royal Perú',
    categoria: 'Tecnología',
    rating: '4.7',
    resenas: '201',
    direccion: 'Av. Brasil 890, Pueblo Libre',
    horario: 'Lun-Sab: 9:00 am - 7:00 pm',
    telefono: '999 567 890',
    whatsapp: '51936780724',
    desc: 'Especialistas en equipos tecnológicos, accesorios y reparación de celulares y laptops.',
    galeria: [t5img1, t5img2, t5img3, t5img4],
    productos: [
      { img: t5img1, nombre: 'Audífonos Bluetooth', desc: 'Audífonos inalámbricos con cancelación de ruido', precio: 120 },
      { img: t5img2, nombre: 'Cargador rápido', desc: 'Cargador 65W compatible con todos los celulares', precio: 35 },
      { img: t5img3, nombre: 'Funda para celular', desc: 'Funda silicona premium para iPhone y Samsung', precio: 15 },
      { img: t5img4, nombre: 'Cable USB-C', desc: 'Cable trenzado 2m carga rápida y datos', precio: 18 },
    ],
    reviews: [
      { nombre: 'Luis García', tiempo: '1 semana atrás', estrellas: 5, texto: 'Me repararon el celular en 2 horas.' },
      { nombre: 'Diana Flores', tiempo: '1 mes atrás', estrellas: 4, texto: 'Buena atención y productos originales.' },
    ],
  },
  {
    id: 5,
    slug: 'floreria-primavera',
    img: floreriaIMG,
    nombre: 'Florería Primavera',
    categoria: 'Flores',
    rating: '5.0',
    resenas: '312',
    direccion: 'Calle Las Rosas 12, Surco',
    horario: 'Lun-Dom: 8:00 am - 8:00 pm',
    telefono: '999 678 901',
    whatsapp: '51936780724',
    desc: 'Arreglos florales para toda ocasión. Flores frescas importadas y nacionales. Delivery el mismo día.',
    galeria: [t6img1, t6img2, t6img3, t6img4],
    productos: [
      { img: t6img1, nombre: 'Ramo de rosas rojas', desc: 'Docena de rosas rojas con lazo y tarjeta', precio: 65 },
      { img: t6img2, nombre: 'Arreglo primaveral', desc: 'Mix de flores de temporada en florero de vidrio', precio: 85 },
      { img: t6img3, nombre: 'Bouquet de bodas', desc: 'Ramo personalizado para novias', precio: 150 },
      { img: t6img4, nombre: 'Orquídeas blancas', desc: 'Maceta de orquídeas blancas para regalo', precio: 95 },
    ],
    reviews: [
      { nombre: 'Carmen López', tiempo: '5 días atrás', estrellas: 5, texto: 'Las flores llegaron hermosas y muy frescas.' },
      { nombre: 'Patricia Vega', tiempo: '2 semanas atrás', estrellas: 5, texto: 'El bouquet de bodas quedó perfecto.' },
    ],
  },
]
