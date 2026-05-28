const pasos = ['Tu Negocio', 'Tu Cuenta', 'Revisar']

function StepIndicator({ paso }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="flex items-center">
        {pasos.map((label, i) => {
          const num = i + 1
          const completado = paso > num
          const activo = paso === num
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  completado ? 'bg-[#0D9488] text-white'
                  : activo   ? 'bg-[#0D9488] text-white ring-4 ring-[#0D9488]/20'
                  :            'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}>
                  {completado ? <i className="ri-check-line text-sm" /> : num}
                </div>
                <span className={`text-[10px] font-semibold whitespace-nowrap transition-colors ${
                  activo ? 'text-[#0D9488]' : completado ? 'text-[#0D9488]' : 'text-[#9CA3AF]'
                }`}>
                  {label}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div className={`w-16 md:w-24 h-px mx-2 mb-5 transition-all duration-500 ${
                  paso > num ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StepIndicator