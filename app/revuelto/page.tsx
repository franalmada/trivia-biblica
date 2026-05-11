'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trophy, BookOpen, Check, Shuffle, Award } from 'lucide-react'
import { obtenerVersiculos } from '../actions/versiculos'

interface VersiculoActual {
  id: number
  textoOriginal: string
  palabrasDesordenadas: string[]
  referencia: string
}

interface FloatingParticle {
  id: number
  puntos: number
  x: number
  y: number
}

export default function RevueltoPage() {
  const router = useRouter()
  const [nombreJugador, setNombreJugador] = useState('')
  const [versiculoActual, setVersiculoActual] = useState<VersiculoActual | null>(null)
  const [palabrasSeleccionadas, setPalabrasSeleccionadas] = useState<string[]>([])
  const [palabrasDisponibles, setPalabrasDisponibles] = useState<string[]>([])
  const [indiceActual, setIndiceActual] = useState(0)
  const [puntajeTotal, setPuntajeTotal] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState(20)
  const [juegoTerminado, setJuegoTerminado] = useState(false)
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [feedbackExito, setFeedbackExito] = useState(false)
  const [puntosObtenidos, setPuntosObtenidos] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [particulas, setParticulas] = useState<FloatingParticle[]>([])
  const [tiemblaReloj, setTiemblaReloj] = useState(false)
  const nextParticleId = useRef(0)
const [versiculos, setVersiculos] = useState<any[]>([])

  // Verificar sesión
useEffect(() => {
  const nombre = localStorage.getItem('jugador_nombre')
  if (!nombre) {
    router.push('/')
  } else {
    setNombreJugador(nombre)
    cargarVersiculos()
  }
}, [])


const cargarVersiculos = async () => {
  setCargando(true)
  const resultado = await obtenerVersiculos(5)
  
  if (resultado.success && resultado.data) {
    setVersiculos(resultado.data)
    // No llamar a iniciarVersiculo aquí directamente
    // Se llamará en el useEffect que monitorea versiculos
  } else {
    setCargando(false)
    console.error('Error cargando versículos desde BD')
  }
}

// Iniciar el juego cuando los versículos estén cargados
useEffect(() => {
  if (versiculos.length > 0 && cargando) {
    iniciarVersiculo(0)
  }
}, [versiculos, cargando])

  // Timer
  useEffect(() => {
    if (!versiculoActual || mostrarFeedback || juegoTerminado) return

    if (tiempoRestante <= 0) {
      manejarTiempoAgotado()
      return
    }

    const timer = setInterval(() => {
      setTiempoRestante(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [tiempoRestante, versiculoActual, mostrarFeedback, juegoTerminado])

  // Animación de temblor del reloj (últimos 3 segundos)
  useEffect(() => {
    if (tiempoRestante <= 3 && tiempoRestante > 0 && !mostrarFeedback) {
      setTiemblaReloj(true)
      const timer = setTimeout(() => setTiemblaReloj(false), 100)
      return () => clearTimeout(timer)
    }
  }, [tiempoRestante, mostrarFeedback])

  const agregarParticula = (puntos: number, x: number, y: number) => {
    const id = nextParticleId.current++
    setParticulas(prev => [...prev, { id, puntos, x, y }])
    setTimeout(() => {
      setParticulas(prev => prev.filter(p => p.id !== id))
    }, 1000)
  }

  const desordenarPalabras = (texto: string): string[] => {
    const palabras = texto.split(' ')
    // Desordenar Fisher-Yates
    for (let i = palabras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[palabras[i], palabras[j]] = [palabras[j], palabras[i]]
    }
    return palabras
  }

const iniciarVersiculo = (indice: number) => {
  console.log('Iniciando versículo índice:', indice, 'Total:', versiculos.length)
  
  if (indice >= versiculos.length) {
    console.log('No hay más versículos, finalizando juego')
    finalizarJuego()
    return
  }

  const versiculo = versiculos[indice]
  const palabrasDesordenadas = desordenarPalabras(versiculo.texto)

  setVersiculoActual({
    id: versiculo.id,
    textoOriginal: versiculo.texto,
    palabrasDesordenadas: palabrasDesordenadas,
    referencia: versiculo.referencia
  })
  setPalabrasSeleccionadas([])
  setPalabrasDisponibles([...palabrasDesordenadas])
  setTiempoRestante(20)
  setMostrarFeedback(false)
  setCargando(false)
}

  const manejarTiempoAgotado = () => {
    setMostrarFeedback(true)
    setFeedbackExito(false)
    setPuntosObtenidos(0)

    setTimeout(() => {
      const siguiente = indiceActual + 1
      setIndiceActual(siguiente)
      iniciarVersiculo(siguiente)
    }, 2000)
  }

  const handlePalabraClick = (palabra: string, index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (mostrarFeedback || juegoTerminado) return

    const nuevasSeleccionadas = [...palabrasSeleccionadas, palabra]
    setPalabrasSeleccionadas(nuevasSeleccionadas)

    const nuevasDisponibles = [...palabrasDisponibles]
    nuevasDisponibles.splice(index, 1)
    setPalabrasDisponibles(nuevasDisponibles)

    // Verificar si completó el versículo
    const textoCompleto = nuevasSeleccionadas.join(' ')
    if (textoCompleto === versiculoActual?.textoOriginal) {
      // Correcto!
        let puntos = 0
        if (tiempoRestante >= 17) puntos = 20
        else if (tiempoRestante >= 13) puntos = 15
        else if (tiempoRestante >= 8) puntos = 10
        else if (tiempoRestante >= 1) puntos = 5
        else puntos = 0

setPuntosObtenidos(puntos)
setPuntajeTotal(prev => prev + puntos)
setMostrarFeedback(true)
setFeedbackExito(true)

      // Agregar partícula en posición del click
      const rect = event.currentTarget.getBoundingClientRect()
      agregarParticula(puntos, rect.left + rect.width / 2, rect.top)

      setTimeout(() => {
        const siguiente = indiceActual + 1
        setIndiceActual(siguiente)
        iniciarVersiculo(siguiente)
      }, 2000)
    }
  }

  const handleDeshacer = () => {
    if (mostrarFeedback || juegoTerminado || palabrasSeleccionadas.length === 0) return

    const ultimaPalabra = palabrasSeleccionadas[palabrasSeleccionadas.length - 1]
    const nuevasSeleccionadas = palabrasSeleccionadas.slice(0, -1)
    setPalabrasSeleccionadas(nuevasSeleccionadas)

    // Reinsertar la palabra en las disponibles (al final)
    setPalabrasDisponibles(prev => [...prev, ultimaPalabra])
  }

  const finalizarJuego = () => {
    setJuegoTerminado(true)
    // Guardar en localStorage para resultados
    localStorage.setItem('puntaje_final', puntajeTotal.toString())
    localStorage.setItem('modo_juego', 'revuelto')
    router.push('/resultados')
  }

  if (cargando) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-900" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white">Preparando versículos...</h2>
        </div>
      </main>
    )
  }

  if (!versiculoActual) return null

  const progreso = ((indiceActual) / versiculos.length) * 100
  const versiculoCompletado = palabrasSeleccionadas.join(' ')

  return (
    <main className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4 py-8">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-900" />
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/30 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-500/20 blur-3xl rounded-full" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Partículas */}
      {particulas.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-2xl font-black"
          style={{
            left: p.x,
            top: p.y,
            transform: 'translateX(-50%)',
            color: '#a855f7',
            textShadow: '0 0 5px rgba(0,0,0,0.5)',
            animation: 'float-up 1s ease-out forwards',
          }}
        >
          +{p.puntos}
        </div>
      ))}

      <section className="relative z-10 w-full max-w-2xl">
        <div className={`backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-[0_0_60px_rgba(168,85,247,0.15)] transition-all duration-300 ${tiempoRestante <= 3 && !mostrarFeedback ? 'shadow-[0_0_30px_rgba(168,85,247,0.8)] border-purple-500/50' : ''}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Jugador</p>
              <div className="flex items-center gap-2 mt-1">
                <BookOpen size={18} className="text-purple-400" />
                <h2 className="text-white font-bold text-lg">{nombreJugador}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-widest">Puntaje</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <Trophy size={18} className="text-yellow-400" />
                <h2 className="text-white font-black text-3xl">{puntajeTotal}</h2>
              </div>
            </div>
          </div>

          {/* Progreso y Timer */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-300">
Versículo {indiceActual + 1} de {versiculos.length}              </span>
              <span className={`flex items-center gap-1 font-bold text-sm transition-all ${tiempoRestante <= 3 ? 'text-purple-400' : 'text-white'} ${tiemblaReloj ? 'animate-shake' : ''}`}>
                <Clock size={15} />
                {tiempoRestante}s
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          {/* Referencia del versículo */}
          <div className="text-center mb-4">
            <span className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm">
              {versiculoActual.referencia}
            </span>
          </div>

          {/* Feedback de resultado */}
          {mostrarFeedback && (
            <div className={`mb-6 p-4 rounded-2xl text-center ${feedbackExito ? 'bg-green-500/20 border border-green-400/40' : 'bg-red-500/20 border border-red-400/40'}`}>
              {feedbackExito ? (
                <div>
                  <Check className="inline-block text-green-400 mr-2" size={24} />
                  <span className="text-white font-bold">¡Correcto! +{puntosObtenidos} puntos</span>
                </div>
              ) : (
                <div>
                  <span className="text-red-400 font-bold">⏰ Tiempo agotado</span>
                </div>
              )}
            </div>
          )}

          {/* Versículo construido */}
          {!mostrarFeedback && (
            <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 min-h-[120px]">
              <p className="text-white text-lg leading-relaxed text-center">
                {versiculoCompletado || <span className="text-gray-500">Toca las palabras en orden...</span>}
              </p>
            </div>
          )}

          {/* Palabras disponibles */}
          {!mostrarFeedback && (
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm mb-3">Palabras disponibles:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {palabrasDisponibles.map((palabra, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handlePalabraClick(palabra, idx, e)}
                    className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-xl text-white font-medium transition-all hover:scale-105"
                  >
                    {palabra}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón deshacer */}
          {!mostrarFeedback && palabrasSeleccionadas.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleDeshacer}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 transition-all"
              >
                <Shuffle size={16} />
                Deshacer
              </button>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
      `}</style>
    </main>
  )
}