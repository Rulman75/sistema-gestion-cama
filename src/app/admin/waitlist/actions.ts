'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createWaitlistEntry(formData: FormData) {
  const unitId = formData.get('unitId') as string
  const notes = formData.get('notes') as string | null

  if (!unitId) {
    return { error: 'Unidad es obligatoria' }
  }

  await prisma.waitlist.create({
    data: {
      unitId: Number(unitId),
      status: 'WAITING',
      notes: notes || null
    }
  })

  revalidatePath('/admin/waitlist')
  revalidatePath('/')
  return { success: true }
}

export async function updateWaitlistStatus(id: number, status: string) {
  await prisma.waitlist.update({
    where: { id },
    data: { status }
  })
  
  revalidatePath('/admin/waitlist')
  revalidatePath('/')
  return { success: true }
}
