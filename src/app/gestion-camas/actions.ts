'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBedStatus(id: number, status: string, notes: string) {
  await prisma.bed.update({
    where: { id },
    data: { status, notes }
  })
  revalidatePath('/gestion-camas')
  revalidatePath('/')
  return { success: true }
}
