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

    // Agrupar por jugador y tomar mejores 10 partidas
    const rankingMap = new Map()

    for (const partida of partidas) {
      const jugadorId = partida.jugador_id
      const nombre = partida.jugadores.nombre
      
      if (!rankingMap.has(jugadorId)) {
        rankingMap.set(jugadorId, {
          nombre,
          puntajes: []
        })
      }
      
      rankingMap.get(jugadorId).puntajes.push(partida.puntaje_total)
    }

    // Calcular suma de mejores 10 puntajes
    const ranking = Array.from(rankingMap.entries()).map(([id, data]) => {
      const mejoresPuntajes = data.puntajes.sort((a: number, b: number) => b - a).slice(0, 10)
      const total = mejoresPuntajes.reduce((sum: number, p: number) => sum + p, 0)
      return {
        jugador_id: id,
        nombre: data.nombre,
        puntaje_total: total,
        partidas_jugadas: data.puntajes.length,
        mejores_partidas_contadas: Math.min(data.puntajes.length, 10)
      }
    })

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