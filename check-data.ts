import { prisma } from './src/lib/prisma'

async function check() {
  const mr = await prisma.minsalReport.findMany()
  const sol = await prisma.solicitud.findMany()
  console.log('MinsalReport:', JSON.stringify(mr, null, 2))
  console.log('Solicitud:', JSON.stringify(sol, null, 2))
}
check()
