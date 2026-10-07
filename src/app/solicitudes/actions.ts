'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createSolicitud(formData: FormData) {
  const tipoSolicitud = formData.get('tipoSolicitud') as string
  const unidadOrigen = formData.get('unidadOrigen') as string
  const nombrePaciente = formData.get('nombrePaciente') as string
  const diagnostico = formData.get('diagnostico') as string
  const requerimiento = formData.get('requerimiento') as string
  const camaAsignada = formData.get('camaAsignada') as string

  if (!unidadOrigen || !nombrePaciente) return { error: 'Campos requeridos faltantes' }

  await prisma.solicitud.create({
    data: {
      tipoSolicitud,
      unidadOrigen,
      nombrePaciente,
      diagnostico,
      requerimiento,
      camaAsignada: camaAsignada || null,
      estado: camaAsignada ? 'ASIGNADA' : 'PENDIENTE'
    }
  })

  revalidatePath('/solicitudes')
  return { success: true }
}

export async function updateSolicitud(id: number, camaAsignada: string) {
  await prisma.solicitud.update({
    where: { id },
    data: {
      camaAsignada,
      estado: camaAsignada ? 'ASIGNADA' : 'PENDIENTE'
    }
  })
  revalidatePath('/solicitudes')
  return { success: true }
}
