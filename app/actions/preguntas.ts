'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function obtenerPreguntas() {
  try {
    const preguntas = await prisma.$queryRaw`
      SELECT 
        p.id as pregunta_id,
        p.texto as pregunta_texto,
        json_agg(json_build_object('id', o.id, 'texto', o.texto, 'es_correcta', o.es_correcta, 'orden', o.orden_opcion) ORDER BY o.orden_opcion) as opciones
      FROM preguntas p
      JOIN opciones o ON o.pregunta_id = p.id
      GROUP BY p.id
      ORDER BY RANDOM()
      LIMIT 10
    `
    
    return { success: true, data: preguntas }
  } catch (error) {
    console.error('Error al obtener preguntas:', error)
    return { success: false, error: 'Error al cargar las preguntas' }
  }
}