'use client'

import { useEffect, useState, useRef } from 'react'
import { obtenerPreguntas } from '../actions/preguntas'
import { useRouter } from 'next/navigation'

import {
  Clock3,
  Trophy,
  Brain,
  CheckCircle2,
  XCircle,
  Flame,
} from 'lucide-react'

interface Opcion {
  id: number
  texto: string
  es_correcta: boolean
  orden: number
}

interface Pregunta {
  pregunta_id: number
  pregunta_texto: string
  opciones: Opcion[]
}

interface FloatingParticle {
  id: number
  puntos: number
  x: number
  y: number
}

export default function TriviaPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [puntaje, setPuntaje] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [tiempoRestante, setTiempoRestante] = useState(15)
  const [nombreJugador, setNombreJugador] = useState('')

  const [mostrarFeedback, setMostrarFeedback] = useState(false)

  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<Opcion | null>(null)

  // NUEVO: Estado para partículas
  const [particulas, setParticulas] = useState<FloatingParticle[]>([])
  const nextParticleId = useRef(0)

  // NUEVO: Estado para animación de revelación de pregunta
  const [revelandoPregunta, setRevelandoPregunta] = useState(true)

  // NUEVO: Efecto para la sacudida del reloj (últimos 3 segundos)
  const [tiemblaReloj, setTiemblaReloj] = useState(false)

  const router = useRouter()

  // NUEVO: Efecto para la sacudida del reloj
  useEffect(() => {
    if (tiempoRestante <= 3 && tiempoRestante > 0 && !mostrarFeedback) {
      setTiemblaReloj(true)
      const timer = setTimeout(() => setTiemblaReloj(false), 100)
      return () => clearTimeout(timer)
    }
  }, [tiempoRestante, mostrarFeedback])

  // NUEVO: Función para agregar partícula
  const agregarParticula = (puntos: number, x: number, y: number) => {
    const id = nextParticleId.current++
    setParticulas(prev => [...prev, { id, puntos, x, y }])
    
    setTimeout(() => {
      setParticulas(prev => prev.filter(p => p.id !== id))
    }, 1000)
  }

  useEffect(() => {
    const nombre = localStorage.getItem('jugador_nombre')

    if (!nombre) {
      router.push('/')
    } else {
      setNombreJugador(nombre)
    }

    cargarPreguntas()
  }, [])

  useEffect(() => {
    if (
      preguntas.length > 0 &&
      !cargando &&
      tiempoRestante > 0 &&
      !mostrarFeedback
    ) {
      const timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            manejarTiempoAgotado()
            return 0
          }

          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [
    preguntaActual,
    preguntas,
    cargando,
    mostrarFeedback,
  ])

  const siguientePregunta = (
    puntajeFinal = puntaje
  ) => {
    setMostrarFeedback(false)
    setRespuestaSeleccionada(null)

    // NUEVO: Activar animación de revelación para la siguiente pregunta
    setRevelandoPregunta(true)

    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1)
      setTiempoRestante(15)
      
      // Desactivar revelación después de 400ms
      setTimeout(() => setRevelandoPregunta(false), 400)
    } else {
      localStorage.setItem(
        'puntaje_final',
        puntajeFinal.toString()
      )
      localStorage.setItem('modo_juego', 'trivia')  // ← Agrega esta línea

      router.push('/resultados')
    }
  }
  const manejarTiempoAgotado = () => {
    setMostrarFeedback(true)

    setTimeout(() => {
      siguientePregunta()
    }, 2000)
  }

  const cargarPreguntas = async () => {
    setCargando(true)

    const resultado = await obtenerPreguntas()

    if (resultado.success && resultado.data) {
      setPreguntas(resultado.data as Pregunta[])
      setError('')
      // NUEVO: Desactivar revelación después de cargar
      setTimeout(() => setRevelandoPregunta(false), 400)
    } else {
      setError(resultado.error || 'Error al cargar preguntas')
    }

    setCargando(false)
  }

  const handleRespuesta = (opcion: Opcion, event: React.MouseEvent<HTMLButtonElement>) => {
    setRespuestaSeleccionada(opcion)

    let puntosGanados = 0

    if (opcion.es_correcta) {
      if (tiempoRestante >= 11) {
        puntosGanados = 15
      } else if (tiempoRestante >= 6) {
        puntosGanados = 10
      } else if (tiempoRestante >= 1) {
        puntosGanados = 5
      }

      setPuntaje((prev) => prev + puntosGanados)
      
      // NUEVO: Crear partícula en la posición del click
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top
      agregarParticula(puntosGanados, x, y)
    }

    setMostrarFeedback(true)

    setTimeout(() => {
      siguientePregunta(puntaje + puntosGanados)
    }, 2000)
  }

  // Loading
  if (cargando) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

        <div className="relative z-10 text-center">
          <div className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

          <h2 className="text-3xl font-black text-white">
            Cargando preguntas...
          </h2>

          <p className="text-gray-400 mt-3">
            Preparando el desafío bíblico
          </p>
        </div>
      </main>
    )
  }

  // Error
  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

        <div className="relative z-10 w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 text-center">
          <div className="text-7xl mb-6">❌</div>

          <h2 className="text-3xl font-black text-white">
            Ocurrió un error
          </h2>

          <p className="text-gray-300 mt-4">
            {error}
          </p>

          <button
            onClick={cargarPreguntas}
            className="
              w-full
              mt-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-red-600
              to-red-500
              text-white
              font-bold
              hover:scale-[1.02]
              transition-all
            "
          >
            Reintentar
          </button>
        </div>
      </main>
    )
  }

  // Sin preguntas
  if (preguntas.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6">📖</div>

          <h2 className="text-3xl font-black text-white">
            No hay preguntas
          </h2>

          <p className="text-gray-400 mt-3">
            Agrega preguntas a la base de datos
          </p>
        </div>
      </main>
    )
  }

  const pregunta = preguntas[preguntaActual]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4 py-8">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-red-600/30 blur-3xl rounded-full" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* NUEVO: Partículas flotantes */}
      {particulas.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-2xl font-black"
          style={{
            left: p.x,
            top: p.y,
            transform: 'translateX(-50%)',
            color: p.puntos === 15 ? '#fbbf24' : p.puntos === 10 ? '#f59e0b' : '#ef4444',
            textShadow: '0 0 5px rgba(0,0,0,0.5)',
            animation: 'float-up 1s ease-out forwards',
          }}
        >
          +{p.puntos}
        </div>
      ))}

      {/* Card */}
      <section className="relative z-10 w-full max-w-md">
        <div className={`
          backdrop-blur-2xl 
          bg-white/10 
          border 
          border-white/10 
          rounded-[32px] 
          p-6 
          shadow-[0_0_60px_rgba(255,0,0,0.15)]
          transition-all 
          duration-300
          // NUEVO: Glow rojo intenso cuando quedan ≤5 segundos
          ${tiempoRestante <= 5 && !mostrarFeedback && tiempoRestante > 0
            ? 'shadow-[0_0_30px_rgba(239,68,68,0.8)] border-red-500/50'
            : ''
          }
        `}>

          {/* TOP INFO */}
          <div className="flex items-center justify-between mb-6">

            {/* Jugador */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">
                Jugador
              </p>

              <div className="flex items-center gap-2 mt-1">
                <Brain
                  size={18}
                  className="text-red-400"
                />

                <h2 className="text-white font-bold text-lg">
                  {nombreJugador}
                </h2>
              </div>
            </div>

            {/* Puntaje */}
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-widest">
                Puntaje
              </p>

              <div className="flex items-center justify-end gap-2 mt-1">
                <Trophy
                  size={18}
                  className="text-yellow-400"
                />

                <h2 className="text-white font-black text-3xl">
                  {puntaje}
                </h2>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-300">
                Pregunta {preguntaActual + 1} de{' '}
                {preguntas.length}
              </span>

              {/* NUEVO: Reloj con animación de temblor */}
              <span
                className={`
                  flex items-center gap-1 font-bold text-sm
                  transition-all
                  ${
                    tiempoRestante <= 5
                      ? 'text-red-400'
                      : 'text-white'
                  }
                  ${tiemblaReloj ? 'animate-shake' : ''}
                `}
              >
                {tiempoRestante <= 5 && (
                  <Flame size={16} />
                )}

                <Clock3 size={15} />
                {tiempoRestante}s
              </span>
            </div>

            {/* Barra */}
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-500

                  ${
                    tiempoRestante <= 5
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                  }
                `}
                style={{
                  width: `${
                    ((preguntaActual + 1) /
                      preguntas.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* NUEVO: Pregunta con animación de revelación */}
          <div className={`
            relative 
            overflow-hidden 
            rounded-3xl 
            border 
            border-white/10 
            bg-white/5 
            p-6 
            mb-6
            transition-all
            duration-400
            ease-out
            ${revelandoPregunta
              ? 'opacity-0 scale-95 translate-y-2'
              : 'opacity-100 scale-100 translate-y-0'
            }
          `}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

            <h1 className="text-2xl font-bold text-white leading-relaxed">
              {pregunta.pregunta_texto}
            </h1>
          </div>

          {/* Opciones */}
          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => {
              const letra = String.fromCharCode(65 + index)

              let buttonClass = `
                group
                relative
                overflow-hidden
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                text-left
                transition-all
                duration-300
                hover:bg-white/10
                hover:scale-[1.01]
              `

              // FEEDBACK VISUAL
              if (mostrarFeedback) {

                // Respuesta correcta elegida
                if (
                  respuestaSeleccionada?.id ===
                    opcion.id &&
                  opcion.es_correcta
                ) {
                  buttonClass = `
                    w-full
                    rounded-2xl
                    border
                    border-green-400/40
                    bg-green-500/20
                    p-5
                    text-left
                  `
                }

                // Respuesta incorrecta elegida
                else if (
                  respuestaSeleccionada?.id ===
                    opcion.id &&
                  !opcion.es_correcta
                ) {
                  buttonClass = `
                    w-full
                    rounded-2xl
                    border
                    border-red-400/40
                    bg-red-500/20
                    p-5
                    text-left
                  `
                }

                // Restantes
                else {
                  buttonClass = `
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                    text-left
                    opacity-50
                  `
                }
              }

              return (
                <button
                  key={opcion.id}
                  disabled={mostrarFeedback}
                  onClick={(e) =>
                    !mostrarFeedback &&
                    handleRespuesta(opcion, e)
                  }
                  className={buttonClass}
                >
                  <div className="flex items-center gap-4">

                    {/* Letra/Icono */}
                    <div
                      className="
                        min-w-[42px]
                        h-[42px]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        font-black
                      "
                    >
                      {mostrarFeedback ? (
                        respuestaSeleccionada?.id ===
                        opcion.id ? (
                          opcion.es_correcta ? (
                            <div className="w-full h-full rounded-xl bg-green-500 flex items-center justify-center text-white">
                              <CheckCircle2 size={20} />
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-xl bg-red-500 flex items-center justify-center text-white">
                              <XCircle size={20} />
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center text-gray-400">
                            {letra}
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center text-red-300">
                          {letra}
                        </div>
                      )}
                    </div>

                    {/* Texto */}
                    <div className="flex-1">
                      <p className="text-white font-medium text-[16px]">
                        {opcion.texto}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* NUEVO: Estilos para las animaciones */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-shake {
          animation: shake 0.15s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  )
}