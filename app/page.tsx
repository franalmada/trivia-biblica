'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Timer, Brain, Play, BarChart3, X } from 'lucide-react'

export default function Home() {
  const [nombre, setNombre] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMensaje, setModalMensaje] = useState('')
  const [modalTipo, setModalTipo] = useState<'error' | 'warning'>('error')
  const router = useRouter()

  const handleJugar = () => {
    const nombreLimpio = nombre.trim()
    const soloLetras = /^[A-Za-záéíóúñÁÉÍÓÚÑüÜ\s]+$/.test(nombreLimpio)

    if (nombreLimpio === '') {
      setModalMensaje('Por favor ingresa tu nombre')
      setModalTipo('warning')
      setModalVisible(true)
      return
    }

    if (!soloLetras) {
      setModalMensaje('Usá solo letras sin espacios. Si ya estas registrado/a y te sale este mensaje es porque hay un espacio demás😊')
      setModalTipo('error')
      setModalVisible(true)
      return
    }

    localStorage.setItem('jugador_nombre', nombreLimpio)
    router.push('/trivia')
  }

  return (
    <>
      {/* Modal flotante centrado */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Fondo oscuro con blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setModalVisible(false)}
          />
          
          {/* Modal */}
          <div className="relative z-10 w-full max-w-md animate-bounce-in">
            <div className={`
              backdrop-blur-2xl 
              bg-gradient-to-br 
              ${modalTipo === 'error' 
                ? 'from-red-950/95 via-black/95 to-red-900/95' 
                : 'from-yellow-950/95 via-black/95 to-yellow-900/95'
              }
              border-2 
              ${modalTipo === 'error' 
                ? 'border-red-500/50' 
                : 'border-yellow-500/50'
              }
              rounded-3xl 
              p-8 
              text-center
              shadow-2xl
              shadow-red-500/20
            `}>
              
              {/* Botón cerrar */}
              <button
                onClick={() => setModalVisible(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* Icono animado */}
             <div className="text-8xl mb-4 animate-float">
                {modalTipo === 'error' ? '😇' : '📖'}  
                </div>
              
              {/* Título con efecto glow */}
              <h3 className={`
                text-3xl font-black mb-3
                ${modalTipo === 'error' 
                  ? 'text-red-400' 
                  : 'text-yellow-400'
                }
              `}>
                {modalTipo === 'error' ? '¡Atención!' : '¡Atención!'}
              </h3>
              
              {/* Línea decorativa */}
              <div className={`
                w-20 h-1 mx-auto mb-5 rounded-full
                ${modalTipo === 'error' 
                  ? 'bg-gradient-to-r from-red-600 to-red-400' 
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                }
              `} />
              
              {/* Mensaje */}
              <p className="text-gray-200 text-base mb-8 leading-relaxed">
                {modalMensaje}
              </p>
              
              {/* Botón de acción */}
              <button
                onClick={() => setModalVisible(false)}
                className={`
                  group
                  relative
                  w-full
                  overflow-hidden
                  rounded-2xl
                  py-4
                  font-bold
                  text-white
                  shadow-2xl
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  ${modalTipo === 'error'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:shadow-red-500/40'
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:shadow-yellow-500/40'
                  }
                `}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
                <span className="relative flex items-center justify-center gap-2">
                  Entendido
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        {/* Fondo moderno */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

        {/* Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-red-600/30 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full" />

        {/* Grid decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Card */}
        <section className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(255,0,0,0.15)]">

            {/* Logo */}
            <div className="text-center">
              <div className="relative mx-auto w-36 h-36 mb-6">
                <div className="absolute inset-0 rounded-full bg-red-500 blur-2xl opacity-40 animate-pulse" />

                <div className="relative w-full h-full rounded-full overflow-hidden border-[5px] border-white/20 shadow-2xl">
                  <img
                    src="/foto.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/20 px-4 py-1 rounded-full text-red-200 text-sm mb-4">
                <Brain size={16} />
                Desafío semanal
              </div>

              <h1 className="text-5xl font-black tracking-tight text-white">
                Trivia
                <span className="block text-red-500">
                  Bíblica
                </span>
              </h1>

              <p className="text-gray-300 mt-3 text-sm">
                Demuestra cuánto sabes y entra al ranking
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Brain className="mx-auto mb-2 text-red-400" size={20} />
                <p className="text-white font-bold text-lg">10</p>
                <p className="text-gray-400 text-xs">Preguntas</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Timer className="mx-auto mb-2 text-orange-400" size={20} />
                <p className="text-white font-bold text-lg">15s</p>
                <p className="text-gray-400 text-xs">Por ronda</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Trophy className="mx-auto mb-2 text-yellow-400" size={20} />
                <p className="text-white font-bold text-lg">TOP</p>
                <p className="text-gray-400 text-xs">Ranking</p>
              </div>
            </div>

            {/* Input */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ingresa tu nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJugar()}
                placeholder="Ej: Juan Pérez"
                autoFocus
                className="
                  w-full
                  bg-white/10
                  border border-white/10
                  text-white
                  placeholder:text-gray-500
                  px-5 py-4
                  rounded-2xl
                  outline-none
                  focus:ring-2
                  focus:ring-red-500
                  transition
                "
              />
            </div>

            {/* Botón principal */}
            <button
              onClick={handleJugar}
              className="
                group
                relative
                w-full
                mt-6
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-red-600
                to-red-500
                py-4
                font-bold
                text-white
                shadow-2xl
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-red-500/40
              "
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

              <span className="relative flex items-center justify-center gap-2">
                <Play size={20} />
                Comenzar partida
              </span>
            </button>

            {/* Ranking */}
            <button
              onClick={() => router.push('/ranking')}
              className="
                w-full
                mt-4
                py-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                hover:bg-white/10
                text-gray-200
                font-semibold
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <BarChart3 size={18} />
              Ver ranking semanal
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                ⚡ Mientras más rápido respondas, más puntos obtienes
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}