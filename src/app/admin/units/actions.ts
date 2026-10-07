'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUnit(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string

  if (!name || !type) {
    return { error: 'Nombre y tipo son obligatorios' }
  }

  await prisma.unit.create({
    data: { name, type }
  })

  revalidatePath('/admin/units')
  revalidatePath('/')
  return { success: true }
}

export async function deleteUnit(id: number) {
  // Check if it has beds or waitlist
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { beds: true, waitlist: true }
  })

  if (unit?.beds.length || unit?.waitlist.length) {
    return { error: 'No se puede eliminar una unidad que tiene camas o pacientes en espera asignados' }
  }

  await prisma.unit.delete({ where: { id } })
  revalidatePath('/admin/units')
  revalidatePath('/')
  return { success: true }
}
