import { prisma } from './src/lib/prisma'

async function check() {
  const wl = await prisma.waitlist.count()
  const mr = await prisma.minsalReport.count()
  const sol = await prisma.solicitud.count()
  console.log('Waitlist:', wl)
  console.log('MinsalReport:', mr)
  console.log('Solicitud:', sol)
}
check()
