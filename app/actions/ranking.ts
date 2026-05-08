'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function obtenerRankingSemanal() {
  try {
    // Obtener fecha actual
    const fechaActual = new Date()
    
    // Calcular el lunes de la semana actual
    const diaSemana = fechaActual.getDay() // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1 // Si es domingo, va 6 días atrás
    
    const inicioSemana = new Date(fechaActual)
    inicioSemana.setDate(fechaActual.getDate() - diasHastaLunes)
    inicioSemana.setHours(0, 0, 0, 0)
    
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 6)
    finSemana.setHours(23, 59, 59, 999)

    console.log('Ranking semana:', inicioSemana, 'a', finSemana)

    // Obtener todas las partidas de la semana
    const partidas = await prisma.partidas.findMany({
      where: {
        fecha: {
          gte: inicioSemana,
          lte: finSemana
        }
      },
      include: {
        jugadores: true
      },
      orderBy: {
        puntaje_total: 'desc'
      }
    })

    console.log('Partidas encontradas:', partidas.length)

    // Agrupar por jugador y obtener la MEJOR partida (no la suma)
    const rankingMap = new Map()

    for (const partida of partidas) {
      const jugadorId = partida.jugador_id
      const nombre = partida.jugadores.nombre
      const puntaje = partida.puntaje_total
      
      if (!rankingMap.has(jugadorId)) {
        rankingMap.set(jugadorId, {
          nombre,
          mejorPuntaje: puntaje,
          partidas_jugadas: 1
        })
      } else {
        const actual = rankingMap.get(jugadorId)
        if (puntaje > actual.mejorPuntaje) {
          actual.mejorPuntaje = puntaje
        }
        actual.partidas_jugadas++
      }
    }

    // Construir ranking con la mejor puntuación de cada jugador
    const ranking = Array.from(rankingMap.entries()).map(([id, data]) => ({
      jugador_id: id,
      nombre: data.nombre,
      puntaje_total: data.mejorPuntaje,
      partidas_jugadas: data.partidas_jugadas,
      mejores_partidas_contadas: 1 // Solo cuenta su mejor partida
    }))

    // Ordenar por puntaje total descendente
    ranking.sort((a, b) => b.puntaje_total - a.puntaje_total)

    return { 
      success: true, 
      data: ranking, 
      semana: { 
        inicio: inicioSemana.toISOString(), 
        fin: finSemana.toISOString() 
      } 
    }
  } catch (error) {
    console.error('Error al obtener ranking:', error)
    return { success: false, error: 'Error al cargar el ranking' }
  }
}