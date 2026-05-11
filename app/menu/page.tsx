'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Brain, Trophy, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MenuPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    const jugador = localStorage.getItem('jugador_nombre')
    if (!jugador) {
      router.push('/')
    } else {
      setNombre(jugador)
    }
  }, [router])

  const handleModo = (modo: 'trivia' | 'revuelto') => {
    if (modo === 'trivia') {
      router.push('/trivia')
    } else {
      router.push('/revuelto')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900" />
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-red-600/30 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(255,0,0,0.15)]">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-4 py-1 rounded-full text-red-200 text-sm mb-4">
              <Brain size={16} />
              {nombre}
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Elige tu modo
            </h1>
            <p className="text-gray-300 text-sm">
              ¿Qué desafío quieres enfrentar?
            </p>
          </div>

          {/* Cards de modos */}
          <div className="space-y-5">
  {/* Modo Trivia */}
  <button
    onClick={() => handleModo('trivia')}
    className="group relative w-full overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
  >
    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative border border-cyan-400/20 bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-6 hover:border-cyan-300/50 transition-all duration-500 shadow-[0_0_40px_rgba(34,211,238,0.08)]">

      {/* Línea decorativa */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          
          {/* Icono */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 rounded-2xl" />
            
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-lg">
              <Brain className="text-white" size={30} />
            </div>
          </div>

          {/* Texto */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-cyan-200 text-[10px] uppercase tracking-widest">
                Competitivo
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Trivia Bíblica
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Responde rápido
            </p>
          </div>
        </div>

        <ArrowRight className="text-cyan-200 group-hover:translate-x-1 transition-transform duration-300" />
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-cyan-200 text-lg font-bold">15s</p>
          <p className="text-[11px] text-gray-400">Tiempo</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-cyan-200 text-lg font-bold">+Pts</p>
          <p className="text-[11px] text-gray-400">Velocidad</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-cyan-200 text-lg font-bold">10</p>
          <p className="text-[11px] text-gray-400">Preguntas</p>
        </div>
      </div>
    </div>
  </button>

  {/* Modo Versículo Revuelto */}
  <button
    onClick={() => handleModo('revuelto')}
    className="group relative w-full overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
  >
    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative border border-fuchsia-400/20 bg-[#161320]/80 backdrop-blur-xl rounded-3xl p-6 hover:border-fuchsia-300/50 transition-all duration-500 shadow-[0_0_40px_rgba(217,70,239,0.08)]">

      {/* Línea decorativa */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent" />

      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          
          {/* Icono */}
          <div className="relative">
            <div className="absolute inset-0 bg-fuchsia-400 blur-xl opacity-30 rounded-2xl" />

            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={30} />
            </div>
          </div>

          {/* Texto */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 rounded-full bg-fuchsia-400/10 border border-fuchsia-300/20 text-fuchsia-200 text-[10px] uppercase tracking-widest">
                Creativo
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Versículo Revuelto
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Ordena correctamente cada versículo
            </p>
          </div>
        </div>

        <ArrowRight className="text-fuchsia-200 group-hover:translate-x-1 transition-transform duration-300" />
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-fuchsia-200 text-lg font-bold">20s</p>
          <p className="text-[11px] text-gray-400">Tiempo</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-fuchsia-200 text-lg font-bold">1:1</p>
          <p className="text-[11px] text-gray-400">Puntos</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center">
          <p className="text-fuchsia-200 text-lg font-bold">5</p>
          <p className="text-[11px] text-gray-400">Versículos</p>
        </div>
      </div>
    </div>
  </button>
</div>

          {/* Botón ranking */}
          <button
            onClick={() => router.push('/ranking')}
            className="w-full mt-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Trophy size={18} />
            Ver ranking semanal
          </button>
        </div>
      </section>
    </main>
  )
}