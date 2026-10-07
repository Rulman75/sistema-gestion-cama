'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createArea(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'El campo es obligatorio' }
  await prisma.area.create({ data: { name } })
  revalidatePath('/admin/areas')
  return { success: true }
}

export async function updateArea(id: number, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'El campo es obligatorio' }
  await prisma.area.update({ where: { id }, data: { name } })
  revalidatePath('/admin/areas')
  return { success: true }
}

export async function deleteArea(id: number) {
  try {
    await prisma.area.delete({ where: { id } })
    revalidatePath('/admin/areas')
    return { success: true }
  } catch (e) {
    return { error: 'No se puede eliminar porque está en uso.' }
  }
}
