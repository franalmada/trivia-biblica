'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// MISMA FUNCIÓN que en guardarPartida.ts
function obtenerSemanaActual() {
  const hoy = new Date()
  const diaSemana = hoy.getDay() // 0 = domingo, 1 = lunes, ...
  
  const inicio = new Date(hoy)
  inicio.setDate(hoy.getDate() - diaSemana)
  inicio.setHours(0, 0, 0, 0)
  
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 6)
  fin.setHours(23, 59, 59, 999)
  
  return { inicio, fin }
}

export async function obtenerRankingPorModo(modo: string = 'trivia') {
  try {
    const { inicio, fin } = obtenerSemanaActual()

    console.log(`Ranking ${modo} semana:`, inicio, 'a', fin)

    const rankings = await prisma.ranking_semanal.findMany({
      where: {
        semana_inicio: inicio,  // Coincidencia exacta ahora
        semana_fin: fin,
        modo: modo
      },
      include: {
        jugadores: true
      },
      orderBy: {
        puntaje_total: 'desc'
      }
    })

    console.log(`Registros encontrados para ${modo}:`, rankings.length)

    const ranking = rankings.map(r => ({
      jugador_id: r.jugador_id,
      nombre: r.jugadores.nombre,
      puntaje_total: r.puntaje_total,
      partidas_jugadas: r.partidas_contadas,
      mejores_partidas_contadas: 1
    }))

    return { 
      success: true, 
      data: ranking, 
      semana: { 
        inicio: inicio.toISOString(), 
        fin: fin.toISOString() 
      } 
    }
  } catch (error) {
    console.error(`Error al obtener ranking ${modo}:`, error)
    return { success: false, error: `Error al cargar el ranking de ${modo}` }
  }
}

export async function obtenerRankingSemanal() {
  return obtenerRankingPorModo('trivia')
}