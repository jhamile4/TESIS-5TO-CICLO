import { useState, useEffect } from 'react'

// Fotos abstractas orgánicas de Pawel Czerwinski en Unsplash
// Sin personas — solo texturas fluidas, pinturas, formas orgánicas en tonos pasteles naturales
const IMAGE_POOLS = [
  [
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f665?w=420&q=85', // verde oliva fluido
    'https://images.unsplash.com/photo-1552083375-1447ce886485?w=420&q=85', // verde esmeralda
    'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=420&q=85', // beige crema orgánico
    'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=420&q=85', // azul teal fluido
  ],
  [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=420&q=85', // dorado naranja pintura
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=420&q=85', // amarillo dorado fluido
    'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=420&q=85', // naranja coral
    'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=420&q=85', // coral pintura
  ],
  [
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=420&q=85', // rosa pastel fluido
    'https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=420&q=85', // rosa magenta
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=420&q=85', // morado lila
    'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=420&q=85', // magenta fluido
  ],
  [
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=420&q=85', // azul fluido
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=420&q=85', // turquesa pastel
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=420&q=85', // terracota arcilla
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=420&q=85', // pintura abstracta
  ],
]

const CYCLE_INTERVALS = [4000, 4500, 3800, 4200]

const FALLBACK_COLORS = [
  'linear-gradient(160deg, #134e4a 0%, #1a3a1a 100%)',
  'linear-gradient(160deg, #7c2d12 0%, #92400e 100%)',
  'linear-gradient(160deg, #4a1d96 0%, #6d28d9 100%)',
  'linear-gradient(160deg, #1e3a5f 0%, #134e4a 100%)',
]

function ImageCell({ pool, interval, fallbackColor }) {
  const [current, setCurrent] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [loaded, setLoaded]   = useState(false)
  const [error, setError]     = useState(false)

  useEffect(() => {
    pool.forEach(url => { const img = new Image(); img.src = url })
  }, [])

  useEffect(() => {
    const tick = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        const next = (current + 1) % pool.length
        setCurrent(next)
        setLoaded(false)
        setError(false)
        setOpacity(1)
      }, 900)
    }, interval)
    return () => clearInterval(tick)
  }, [current, pool, interval])

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div className="absolute inset-0" style={{ background: fallbackColor }} />
      <img
        src={pool[current]}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: loaded && !error ? opacity : 0, transition: 'opacity 0.9s ease-in-out' }}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {pool.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-500"
            style={{
              width: i === current ? '18px' : '5px', height: '5px',
              background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
            }} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
    </div>
  )
}

function PerfilHero({ heroLoaded, onDescubrir }) {
  return (
    <div className="relative w-full h-[300px] md:h-[360px] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-4 gap-px z-10">
        {IMAGE_POOLS.map((pool, i) => (
          <ImageCell key={i} pool={pool} interval={CYCLE_INTERVALS[i]} fallbackColor={FALLBACK_COLORS[i]} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent z-20 pointer-events-none" />
      <div className={`absolute bottom-0 left-0 right-0 z-30 text-center px-4 pb-6 md:pb-8 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h1 className="text-[28px] md:text-[44px] font-black text-white leading-tight tracking-tight drop-shadow-2xl">
          AQUÍ LO OBTENGO <span className="font-light italic text-white/80">todo</span>
        </h1>
        <p className="mt-1.5 text-sm text-white/60 drop-shadow-lg">
          Tus pedidos, tus favoritos, tu estilo. Todo en un solo lugar.
        </p>
        <button onClick={onDescubrir}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer">
          <i className="ri-arrow-down-line" /> Descubrir
        </button>
      </div>
    </div>
  )
}

export default PerfilHero