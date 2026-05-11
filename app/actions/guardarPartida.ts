'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para obtener el inicio y fin de la semana actual (domingo a sábado)
function obtenerSemanaActual() {
  const hoy = new Date()
  const diaSemana = hoy.getDay() // 0 = domingo, 1 = lunes, ...
  
  // Inicio de semana: domingo (restar días)
  const inicio = new Date(hoy)
  inicio.setDate(hoy.getDate() - diaSemana)
  inicio.setHours(0, 0, 0, 0)
  
  // Fin de semana: sábado (sumar 6 días)
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 6)
  fin.setHours(23, 59, 59, 999)
  
  return { inicio, fin }
}

export async function guardarPartida(
  nombre: string, 
  puntaje: number, 
  respuestasCorrectas: number,
  modo: string = 'trivia'
) {
  try {
    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ')
    const soloLetras = /^[A-Za-záéíóúñÁÉÍÓÚÑüÜ\s]+$/.test(nombreLimpio)
    
    if (!soloLetras) {
      return { success: false, error: 'El nombre solo puede contener letras y espacios' }
    }

    // Buscar o crear jugador
    let jugador = await prisma.jugadores.findFirst({
      where: { nombre: nombreLimpio }
    })

    if (!jugador) {
      jugador = await prisma.jugadores.create({
        data: { nombre: nombreLimpio }
      })
    }

    // Guardar la partida
    const partida = await prisma.partidas.create({
      data: {
        jugador_id: jugador.id,
        puntaje_total: puntaje,
        respuestas_correctas: respuestasCorrectas,
        modo: modo
      }
    })

    // ============================================
    // ACTUALIZAR RANKING SEMANAL (por modo)
    // ============================================
    const { inicio, fin } = obtenerSemanaActual()

    // Buscar si ya existe un registro de ranking para este jugador, esta semana y este modo
    const rankingExistente = await prisma.ranking_semanal.findFirst({
      where: {
        jugador_id: jugador.id,
        semana_inicio: inicio,
        semana_fin: fin,
        modo: modo
      }
    })

    if (rankingExistente) {
      // Actualizar: sumar puntaje y contar una partida más
      await prisma.ranking_semanal.update({
        where: { id: rankingExistente.id },
        data: {
          puntaje_total: rankingExistente.puntaje_total + puntaje,
          partidas_contadas: rankingExistente.partidas_contadas + 1,
          actualizado_en: new Date()
        }
      })
    } else {
      // Crear nuevo registro de ranking para este modo
      await prisma.ranking_semanal.create({
        data: {
          jugador_id: jugador.id,
          puntaje_total: puntaje,
          partidas_contadas: 1,
          semana_inicio: inicio,
          semana_fin: fin,
          modo: modo
        }
      })
    }

    return { success: true, partida }
  } catch (error) {
    console.error('Error al guardar partida:', error)
    return { success: false, error: 'Error al guardar la partida' }
  }
}