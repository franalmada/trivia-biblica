'use client'

import { useEffect, useState } from 'react'
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

export default function TriviaPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [puntaje, setPuntaje] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [tiempoRestante, setTiempoRestante] = useState(15)
  const [nombreJugador, setNombreJugador] = useState('')
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [feedbackCorrecta, setFeedbackCorrecta] =
    useState<Opcion | null>(null)

  const router = useRouter()

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

  const manejarTiempoAgotado = () => {
    const correcta =
      pregunta?.opciones.find((o) => o.es_correcta) || null

    setFeedbackCorrecta(correcta)
    setMostrarFeedback(true)

    setTimeout(() => {
      setMostrarFeedback(false)
      setFeedbackCorrecta(null)

      if (preguntaActual + 1 < preguntas.length) {
        setPreguntaActual(preguntaActual + 1)
        setTiempoRestante(15)
      } else {
        localStorage.setItem(
          'puntaje_final',
          puntaje.toString()
        )

        router.push('/resultados')
      }
    }, 2000)
  }

  const cargarPreguntas = async () => {
    setCargando(true)

    const resultado = await obtenerPreguntas()

    if (resultado.success && resultado.data) {
      setPreguntas(resultado.data as Pregunta[])
      setError('')
    } else {
      setError(resultado.error || 'Error al cargar preguntas')
    }

    setCargando(false)
  }

  const handleRespuesta = (opcion: Opcion) => {
    let puntosGanados = 0

    if (opcion.es_correcta) {
      if (tiempoRestante >= 11) {
        puntosGanados = 15
      } else if (tiempoRestante >= 6) {
        puntosGanados = 10
      } else if (tiempoRestante >= 1) {
        puntosGanados = 5
      }

      setPuntaje(puntaje + puntosGanados)
    }

    const correcta =
      pregunta?.opciones.find((o) => o.es_correcta) || null

    setFeedbackCorrecta(correcta)
    setMostrarFeedback(true)

    setTimeout(() => {
      setMostrarFeedback(false)
      setFeedbackCorrecta(null)

      if (preguntaActual + 1 < preguntas.length) {
        setPreguntaActual(preguntaActual + 1)
        setTiempoRestante(15)
      } else {
        localStorage.setItem(
          'puntaje_final',
          (puntaje + puntosGanados).toString()
        )

        router.push('/resultados')
      }
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

      {/* Card */}
      <section className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-[0_0_60px_rgba(255,0,0,0.15)]">

          {/* TOP INFO */}
          <div className="flex items-center justify-between mb-6">
            {/* Jugador */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">
                Jugador
              </p>

              <div className="flex items-center gap-2 mt-1">
                <Brain size={18} className="text-red-400" />

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
                <Trophy size={18} className="text-yellow-400" />

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

              <span
                className={`
                  flex items-center gap-1 font-bold text-sm
                  ${
                    tiempoRestante <= 5
                      ? 'text-red-400'
                      : 'text-white'
                  }
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

          {/* Pregunta */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 mb-6">
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

              if (mostrarFeedback) {
                if (opcion.es_correcta) {
                  buttonClass = `
                    w-full
                    rounded-2xl
                    border
                    border-green-400/40
                    bg-green-500/20
                    p-5
                    text-left
                  `
                } else {
                  buttonClass = `
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                    text-left
                    opacity-60
                  `
                }
              }

              return (
                <button
                  key={opcion.id}
                  disabled={mostrarFeedback}
                  onClick={() =>
                    !mostrarFeedback &&
                    handleRespuesta(opcion)
                  }
                  className={buttonClass}
                >
                  <div className="flex items-center gap-4">
                    {/* Letra */}
                    <div
                      className={`
                        min-w-[42px]
                        h-[42px]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        font-black

                        ${
                          mostrarFeedback &&
                          opcion.es_correcta
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-red-300'
                        }
                      `}
                    >
                      {mostrarFeedback &&
                      opcion.es_correcta ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        letra
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

          {/* Feedback */}
          {mostrarFeedback && (
            <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-500/10 p-4 flex items-start gap-3">
              <CheckCircle2
                className="text-green-400 mt-0.5"
                size={22}
              />

              <div>
                <p className="text-green-300 font-bold">
                  Respuesta correcta
                </p>

                <p className="text-white text-sm mt-1">
                  {feedbackCorrecta?.texto}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}