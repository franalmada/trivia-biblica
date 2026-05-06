'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function guardarPartida(nombre: string, puntaje: number) {
  try {
    // Buscar o crear el jugador
    let jugador = await prisma.jugadores.findFirst({
      where: { nombre: nombre }
    })

    if (!jugador) {
      jugador = await prisma.jugadores.create({
        data: { nombre: nombre }
      })
    }

    // Guardar la partida
    const partida = await prisma.partidas.create({
      data: {
        jugador_id: jugador.id,
        puntaje_total: puntaje,
        respuestas_correctas: Math.floor(puntaje / 10) // Aproximado
      }
    })

    return { success: true, partida }
  } catch (error) {
    console.error('Error al guardar partida:', error)
    return { success: false, error: 'Error al guardar la partida' }
  }
}