'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function guardarPartida(nombre: string, puntaje: number) {
  try {
    // Limpiar nombre: eliminar espacios al inicio/final y múltiples espacios internos
    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ')

    // Validar que solo tenga letras y espacios
    const soloLetras = /^[A-Za-záéíóúñÁÉÍÓÚÑüÜ\s]+$/.test(nombreLimpio)
    if (!soloLetras) {
      return { success: false, error: 'El nombre solo puede contener letras y espacios' }
    }

    // Buscar el jugador por nombre exacto (ya limpio)
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
        respuestas_correctas: Math.floor(puntaje / 10)
      }
    })

    return { success: true, partida }
  } catch (error) {
    console.error('Error al guardar partida:', error)
    return { success: false, error: 'Error al guardar la partida' }
  }
}