function ResenasList({ reviews }) {
  if (reviews.length === 0) return (
    <div className="text-center py-16 text-[#9CA3AF]">
      <i className="ri-chat-1-line text-4xl block mb-3" />
      <p className="text-sm">Aún no hay reseñas para este negocio.</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#0D9488]/20 transition-all">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-sm font-bold text-[#0D9488] shrink-0">
              {r.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#111827] truncate">{r.nombre}</span>
                <span className="text-[10px] text-[#9CA3AF] shrink-0">{r.tiempo}</span>
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <i key={j} className={`text-xs ${j < r.estrellas ? 'ri-star-fill text-amber-400' : 'ri-star-line text-[#E5E7EB]'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-[#374151] leading-relaxed">{r.texto}</p>
        </div>
      ))}
    </div>
  )
}

export default ResenasList