import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const units = await prisma.unit.findMany({
    orderBy: { name: 'asc' }
  })

  // Add UTF-8 BOM so Excel opens it with correct encoding (accents, etc.)
  let csvContent = '\uFEFF'
  csvContent += 'ID_Unidad;Nombre_Unidad;Tipo\n'

  for (const unit of units) {
    const tipo = unit.type === 'CRITICAL' ? 'Crítica' : unit.type === 'BASIC' ? 'Básica' : 'Otra'
    csvContent += `"${unit.id}";"${unit.name}";"${tipo}"\n`
  }

  fs.writeFileSync('UNIDADES_ID_REFERENCIA.csv', csvContent)
  console.log('Archivo generado correctamente.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
