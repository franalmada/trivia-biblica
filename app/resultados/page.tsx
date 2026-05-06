'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { guardarPartida } from '../actions/guardarPartida'

import {
  Trophy,
  Play,
  Home,
  BarChart3,
  Sparkles,
  Save,
  Crown,
  Flame,
} from 'lucide-react'

export default function ResultadosPage() {
  const [puntaje, setPuntaje] = useState(0)
  const [nombreJugador, setNombreJugador] = useState('')
  const [guardando, setGuardando] = useState(true)

  const yaGuardo = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const nombre = localStorage.getItem('jugador_nombre')
    const puntajeFinal =
      localStorage.getItem('puntaje_final')

    if (!nombre) {
      router.push('/')
    } else {
      setNombreJugador(nombre)

      const puntajeNum = puntajeFinal
        ? parseInt(puntajeFinal)
        : 0

      setPuntaje(puntajeNum)

      const guardar = async () => {
        if (yaGuardo.current) return

        yaGuardo.current = true

        const resultado = await guardarPartida(
          nombre,
          puntajeNum
        )

        if (resultado.success) {
          console.log('Partida guardada correctamente')
        } else {
          console.error(
            'Error al guardar partida:',
            resultado.error
          )
        }

        setGuardando(false)
      }

      guardar()
    }
  }, [])

  const handleJugarOtra = () => {
    router.push('/trivia')
  }

  const handleVerRanking = () => {
    router.push('/ranking')
  }

  // Loading
  if (guardando) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        {/* Fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />

        {/* Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-red-600/30 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full" />

        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 text-center shadow-[0_0_60px_rgba(255,0,0,0.15)]">

            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-red-500 blur-2xl opacity-40 animate-pulse" />

              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Save
                  size={40}
                  className="text-white animate-pulse"
                />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white">
              Guardando resultado...
            </h2>

            <p className="text-gray-400 mt-3">
              Actualizando el ranking semanal
            </p>

            <div className="mt-8 w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </main>
    )
  }

  // Calificación
  const obtenerMensaje = () => {
    if (puntaje >= 130)
      return {
        texto: '¡Legendario!',
        color: 'text-yellow-400',
        icono: <Crown size={22} />,
      }

    if (puntaje >= 100)
      return {
        texto: '¡Excelente!',
        color: 'text-green-400',
        icono: <Flame size={22} />,
      }

    if (puntaje >= 60)
      return {
        texto: '¡Muy bien!',
        color: 'text-blue-400',
        icono: <Sparkles size={22} />,
      }

    return {
      texto: '¡Sigue practicando!',
      color: 'text-red-400',
      icono: <Trophy size={22} />,
    }
  }

  const resultado = obtenerMensaje()

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
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(255,0,0,0.15)]">

          {/* Trophy */}
          <div className="text-center">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-40 rounded-full" />

              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center shadow-2xl">
                <Trophy
                  size={58}
                  className="text-yellow-950"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/20 px-4 py-1 rounded-full text-red-200 text-sm mb-4">
              <Sparkles size={16} />
              Partida completada
            </div>

            <h1 className="text-4xl font-black text-white">
              ¡Partida
              <span className="block text-red-500">
                Finalizada!
              </span>
            </h1>

            <p className="text-gray-300 mt-3 text-lg">
              {nombreJugador}
            </p>
          </div>

          {/* Score */}
          <div className="relative overflow-hidden mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

            <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">
              Puntaje final
            </p>

            <div className="mt-4 text-7xl font-black text-white">
              {puntaje}
            </div>

            <p className="text-gray-500 text-sm mt-2">
              de 150 puntos posibles
            </p>

            {/* Resultado */}
            <div
              className={`
                mt-6
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/5
                border
                border-white/10
                font-bold
                ${resultado.color}
              `}
            >
              {resultado.icono}
              {resultado.texto}
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">⚡</div>

              <p className="text-white font-bold">
                {puntaje >= 100
                  ? 'Rápido'
                  : puntaje >= 60
                  ? 'Bien'
                  : 'Normal'}
              </p>

              <p className="text-gray-500 text-xs">
                Velocidad
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🧠</div>

              <p className="text-white font-bold">
                {Math.floor((puntaje / 150) * 100)}%
              </p>

              <p className="text-gray-500 text-xs">
                Precisión
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🏆</div>

              <p className="text-white font-bold">
                TOP
              </p>

              <p className="text-gray-500 text-xs">
                Ranking
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4 mt-8">
            {/* Jugar otra */}
            <button
              onClick={handleJugarOtra}
              className="
                group
                relative
                overflow-hidden
                w-full
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
              "
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

              <span className="relative flex items-center justify-center gap-2">
                <Play size={20} />
                Jugar otra vez
              </span>
            </button>

            {/* Ranking */}
            <button
              onClick={handleVerRanking}
              className="
                w-full
                py-4
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

            {/* Inicio */}
            <button
              onClick={() => router.push('/')}
              className="
                w-full
                py-4
                rounded-2xl
                border
                border-white/10
                bg-transparent
                hover:bg-white/5
                text-gray-400
                font-medium
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Home size={18} />
              Volver al inicio
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}