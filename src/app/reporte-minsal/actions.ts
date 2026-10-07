'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveReport(data: { shift: string, demandaUE: string, disponibilidad: string }) {
  await prisma.minsalReport.create({
    data: {
      shift: data.shift,
      demandaUE: data.demandaUE,
      disponibilidad: data.disponibilidad
    }
  })

  revalidatePath('/reporte-minsal')
  return { success: true }
}
