'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerRankingPorModo } from '../actions/ranking'

import {
  Trophy,
  Medal,
  Crown,
  Play,
  Home,
  Sparkles,
  Flame,
  BookOpen,
  Brain,
} from 'lucide-react'

interface RankingItem {
  jugador_id: number
  nombre: string
  puntaje_total: number
  partidas_jugadas: number
  mejores_partidas_contadas: number
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [fechaSemana, setFechaSemana] = useState('')
  const [modoActivo, setModoActivo] = useState<'trivia' | 'revuelto'>('trivia')

  const router = useRouter()

  useEffect(() => {
    cargarRanking()
  }, [modoActivo])

  const cargarRanking = async () => {
    setCargando(true)
    setError('')

    const resultado = await obtenerRankingPorModo(modoActivo)

    if (resultado.success && resultado.data) {
      setRanking(resultado.data)

      if (resultado.semana) {
        const inicio = new Date(resultado.semana.inicio).toLocaleDateString()
        const fin = new Date(resultado.semana.fin).toLocaleDateString()
        setFechaSemana(`${inicio} - ${fin}`)
      }
    } else {
      setError(resultado.error || 'Error al cargar el ranking')
    }

    setCargando(false)
  }

  const handleJugar = () => {
    router.push('/menu')
  }

  // Loading
  if (cargando) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white">Cargando ranking...</h2>
          <p className="text-gray-400 mt-3">Preparando a los mejores jugadores</p>
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
          <h2 className="text-3xl font-black text-white">Ocurrió un error</h2>
          <p className="text-gray-300 mt-4">{error}</p>
          <button onClick={cargarRanking} className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:scale-[1.02] transition-all">Reintentar</button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 flex items-center justify-center">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-red-600/30 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-[0_0_60px_rgba(255,0,0,0.15)]">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-flex mb-5">
              <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 rounded-full" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                <Trophy size={42} className="text-yellow-950" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/20 px-4 py-1 rounded-full text-red-200 text-sm mb-4">
              <Sparkles size={16} />
              Competencia semanal
            </div>

            <h1 className="text-4xl font-black text-white">
              Ranking
              <span className="block text-red-500">Semanal</span>
            </h1>

            <p className="text-gray-300 text-sm mt-3">{fechaSemana}</p>
          </div>

          {/* TABS para cambiar entre modos */}
          <div className="flex gap-2 mb-6 bg-white/5 rounded-2xl p-1 border border-white/10">
            <button
              onClick={() => setModoActivo('trivia')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                modoActivo === 'trivia'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain size={18} />
              Trivia
            </button>
           <button
  onClick={() => setModoActivo('revuelto')}
  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
    modoActivo === 'revuelto'
      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-lg'
      : 'text-gray-400 hover:text-white hover:bg-white/10'
  }`}
>
  <BookOpen size={18} />
  Revuelto
</button>
          </div>

          {/* Subtítulo según modo */}
          <div className="text-center mb-4">
            <p className="text-gray-500 text-xs">
              {modoActivo === 'trivia' 
                ? '🏆 Máximo: 150 puntos · 10 preguntas' 
                : '🏆 Máximo: 100 puntos · 5 versículos'}
            </p>
            <p className="text-gray-500 text-xs mt-1">✨ Solo cuenta tu mejor partida</p>
          </div>

          {/* Ranking */}
          {ranking.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-5">😴</div>
              <h3 className="text-2xl font-bold text-white">Aún no hay jugadores</h3>
              <p className="text-gray-400 mt-3">¡Sé el primero en entrar al ranking!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {ranking.map((item, index) => {
                const isTop1 = index === 0
                const isTop2 = index === 1
                const isTop3 = index === 2

                return (
                  <div
                    key={item.jugador_id}
                    className={`relative overflow-hidden rounded-3xl border p-4 transition-all duration-300 hover:scale-[1.01] ${
                      isTop1 ? 'bg-yellow-500/10 border-yellow-400/30' :
                      isTop2 ? 'bg-gray-500/10 border-gray-300/20' :
                      isTop3 ? 'bg-orange-500/10 border-orange-400/20' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                    {isTop1 && <div className="absolute inset-0 bg-yellow-400/5" />}
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
                          isTop1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-950' :
                          isTop2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800' :
                          isTop3 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950' :
                          'bg-white/10 text-white'
                        }`}>
                          {isTop1 ? <Crown size={24} /> : isTop2 || isTop3 ? <Medal size={22} /> : index + 1}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-lg">{item.nombre}</p>
                            {isTop1 && <Flame size={16} className="text-orange-400" />}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.partidas_jugadas} partidas
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-black text-white">{item.puntaje_total}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">puntos</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-4 mt-8">
            <button onClick={handleJugar} className="group relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
              <span className="relative flex items-center justify-center gap-2">
                <Play size={20} /> Jugar
              </span>
            </button>

            <button onClick={() => router.push('/')} className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold transition-all flex items-center justify-center gap-2">
              <Home size={18} /> Volver al inicio
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}