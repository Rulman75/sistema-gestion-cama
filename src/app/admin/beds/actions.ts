'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBed(formData: FormData) {
  const unitId = formData.get('unitId') as string
  const sectorId = formData.get('sectorId') as string
  const tipoCamaId = formData.get('tipoCamaId') as string
  const numCama = formData.get('numCama') as string
  const status = formData.get('status') as string

  if (!unitId || !status) {
    return { error: 'Unidad y estado son obligatorios' }
  }

  await prisma.bed.create({
    data: {
      unitId: Number(unitId),
      sectorId: sectorId ? Number(sectorId) : null,
      tipoCamaId: tipoCamaId ? Number(tipoCamaId) : null,
      numCama: numCama || null,
      status,
    }
  })

  revalidatePath('/admin/beds')
  revalidatePath('/')
  return { success: true }
}

export async function updateBed(id: number, formData: FormData) {
  const unitId = formData.get('unitId') as string
  const sectorId = formData.get('sectorId') as string
  const tipoCamaId = formData.get('tipoCamaId') as string
  const numCama = formData.get('numCama') as string
  const status = formData.get('status') as string

  await prisma.bed.update({
    where: { id },
    data: {
      unitId: Number(unitId),
      sectorId: sectorId ? Number(sectorId) : null,
      tipoCamaId: tipoCamaId ? Number(tipoCamaId) : null,
      numCama: numCama || null,
      status,
    }
  })
  
  revalidatePath('/admin/beds')
  revalidatePath('/')
  return { success: true }
}

export async function updateBedStatus(id: number, status: string) {
  await prisma.bed.update({
    where: { id },
    data: { status }
  })
  
  revalidatePath('/admin/beds')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBed(id: number) {
  await prisma.bed.delete({ where: { id } })
  revalidatePath('/admin/beds')
  revalidatePath('/')
  return { success: true }
}
