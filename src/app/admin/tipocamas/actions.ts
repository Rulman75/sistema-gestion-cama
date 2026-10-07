'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTipoCama(formData: FormData) {
  const descripcion = formData.get('descripcion') as string
  if (!descripcion) return { error: 'El campo es obligatorio' }
  await prisma.tipoCama.create({ data: { descripcion } })
  revalidatePath('/admin/tipocamas')
  return { success: true }
}

export async function updateTipoCama(id: number, formData: FormData) {
  const descripcion = formData.get('descripcion') as string
  if (!descripcion) return { error: 'El campo es obligatorio' }
  await prisma.tipoCama.update({ where: { id }, data: { descripcion } })
  revalidatePath('/admin/tipocamas')
  return { success: true }
}

export async function deleteTipoCama(id: number) {
  try {
    await prisma.tipoCama.delete({ where: { id } })
    revalidatePath('/admin/tipocamas')
    return { success: true }
  } catch (e) {
    return { error: 'No se puede eliminar porque está en uso.' }
  }
}
