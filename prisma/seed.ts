import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@hospital.cl' },
    update: {},
    create: {
      email: 'admin@hospital.cl',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const units = [
    { name: 'UCI', type: 'CRITICAL' },
    { name: 'UTI', type: 'CRITICAL' },
    { name: 'UCO', type: 'CRITICAL' },
    { name: 'UCIP', type: 'CRITICAL' },
    { name: 'UTIP', type: 'CRITICAL' },
    { name: 'MEDICINA', type: 'BASIC' },
    { name: 'CIRUGIA', type: 'BASIC' },
    { name: 'NEUROLOGIA', type: 'BASIC' },
    { name: 'CARDIOLOGIA', type: 'BASIC' },
    { name: 'NEUROCIRUGIA', type: 'BASIC' },
    { name: 'UROLOGIA', type: 'BASIC' },
    { name: 'TRAUMATOLOGIA', type: 'BASIC' },
    { name: 'PABELLON', type: 'OTHER' },
    { name: 'PSIQUIATRIA ADULTO', type: 'BASIC' },
    { name: 'PSIQUIATRIA I-JUVENIL', type: 'BASIC' },
    { name: 'RECU', type: 'OTHER' },
    { name: 'SALA PREHOSPITALIZACION', type: 'OTHER' },
    { name: 'RED', type: 'OTHER' },
    { name: 'PACIENTES CRR', type: 'OTHER' },
    { name: 'PACIENTES POLI', type: 'OTHER' },
    { name: 'TRASLADOS MACRORED', type: 'OTHER' },
    { name: 'CIRUGIA BASICA', type: 'BASIC' },
    { name: 'UCM CX', type: 'BASIC' },
    { name: 'BQE', type: 'BASIC' },
    { name: 'AREA GINECOLOGICA', type: 'BASIC' },
    { name: 'AREA PUERPERIO', type: 'BASIC' },
    { name: 'ARO', type: 'BASIC' },
    { name: 'LACTANTES', type: 'BASIC' },
    { name: 'CX INFANTIL Y 2DA INFANCIA', type: 'BASIC' },
  ]

  for (const u of units) {
    const unit = await prisma.unit.create({ data: u })
    
    // Create some default beds if critical (e.g. 5 beds)
    if (u.type === 'CRITICAL') {
      for (let i = 0; i < 5; i++) {
        await prisma.bed.create({
          data: {
            unitId: unit.id,
            status: 'AVAILABLE',
          }
        })
      }
    } else if (u.type === 'BASIC') {
      // Create some basic beds with gender
      for (let i = 0; i < 3; i++) {
        await prisma.bed.create({
          data: {
            unitId: unit.id,
            status: 'AVAILABLE',
            gender: i % 2 === 0 ? 'H' : 'M'
          }
        })
      }
    }
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
