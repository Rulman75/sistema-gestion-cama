'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createSector(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'El campo es obligatorio' }
  await prisma.sector.create({ data: { name } })
  revalidatePath('/admin/sectors')
  return { success: true }
}

export async function updateSector(id: number, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'El campo es obligatorio' }
  await prisma.sector.update({ where: { id }, data: { name } })
  revalidatePath('/admin/sectors')
  return { success: true }
}

export async function deleteSector(id: number) {
  try {
    await prisma.sector.delete({ where: { id } })
    revalidatePath('/admin/sectors')
    return { success: true }
  } catch (e) {
    return { error: 'No se puede eliminar porque está en uso.' }
  }
}
