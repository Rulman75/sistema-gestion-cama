import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const units = await prisma.unit.findMany({
    orderBy: { name: 'asc' }
  })
  console.table(units)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
