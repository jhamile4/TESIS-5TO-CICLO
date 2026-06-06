import { useState, useEffect } from 'react'

const IMAGE_POOLS = [
  ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80','https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80'],
  ['https://images.unsplash.com/photo-1490750967868-88df5691cc8e?w=400&q=80','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
  ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80','https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80'],
  ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80','https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80','https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'],
]
const CYCLE_INTERVALS = [3000, 3400, 2800, 3200]

function ImageCell({ pool, interval }) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    const tick = setInterval(() => {
      setFading(true)
      setTimeout(() => { setCurrent(p => (p + 1) % pool.length); setFading(false) }, 700)
    }, interval)
    return () => clearInterval(tick)
  }, [pool.length, interval])

  return (
    <div className="relative overflow-hidden w-full h-full bg-[#1a1a1a]">
      <img src={pool[current]} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: fading ? 0 : 1 }} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {pool.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-500"
            style={{ width: i === current ? '18px' : '5px', height: '5px',
              background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  )
}

function PerfilHero({ heroLoaded, onDescubrir }) {
  return (
    <div className="relative w-full h-[300px] md:h-[360px] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-4 gap-px z-10">
        {IMAGE_POOLS.map((pool, i) => <ImageCell key={i} pool={pool} interval={CYCLE_INTERVALS[i]} />)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-20" />
      <div className={`absolute bottom-0 left-0 right-0 z-30 text-center px-4 pb-6 md:pb-8 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h1 className="text-[28px] md:text-[44px] font-black text-white leading-tight tracking-tight">
          AQUÍ LO OBTENGO <span className="font-light italic text-white/80">todo</span>
        </h1>
        <p className="mt-1.5 text-sm text-white/60">Tus pedidos, tus favoritos, tu estilo. Todo en un solo lugar.</p>
        <button onClick={onDescubrir}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer">
          <i className="ri-arrow-down-line" /> Descubrir
        </button>
      </div>
    </div>
  )
}

export default PerfilHero