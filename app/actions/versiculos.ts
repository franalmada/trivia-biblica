'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function obtenerVersiculos(cantidad: number = 5) {
  try {
    // Usar SQL nativo para aleatoriedad real
    const versiculos = await prisma.$queryRaw`
      SELECT * FROM versiculos 
      WHERE activo = true 
      ORDER BY RANDOM() 
      LIMIT ${cantidad}
    `

    console.log('Versículos aleatorios obtenidos:', (versiculos as any[]).length)

    return { success: true, data: versiculos as any[] }
  } catch (error) {
    console.error('Error al obtener versículos:', error)
    return { success: false, error: 'Error al cargar versículos' }
  }
}