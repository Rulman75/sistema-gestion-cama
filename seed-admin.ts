import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@hospital.cl',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user recreated')
}

main().finally(() => prisma.$disconnect())
