import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Borrando datos antiguos...')
  await prisma.bed.deleteMany({})
  await prisma.waitlist.deleteMany({})
  await prisma.unit.deleteMany({}) // Borramos todas las unidades para recrearlas correctamente

  console.log('Procesando UNIDADES_ID_REFERENCIA.xlsx...')
  const unPath = 'Analisis/UNIDADES_ID_REFERENCIA.xlsx'
  const unWb = XLSX.readFile(unPath)
  const unWs = unWb.Sheets[unWb.SheetNames[0]]
  const unData: any[] = XLSX.utils.sheet_to_json(unWs)

  const newUnData = []
  
  for (const row of unData) {
    const nombre = row['Nombre_Unidad']?.toString().trim()
    const idArea = row['ID_AREA']?.toString().trim() || null

    if (!nombre) continue

    // Crear SIEMPRE una nueva unidad para cada fila, para asegurar IDs distintos
    // incluso si tienen el mismo nombre (ej: "CAMA MEDIA")
    const unit = await prisma.unit.create({
      data: {
        name: nombre,
        areaId: idArea,
        type: 'BASIC'
      }
    })
    
    newUnData.push({
      ID_UNIDAD: unit.id,
      ID_AREA: idArea,
      Nombre_Unidad: nombre
    })
  }

  unWb.Sheets[unWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newUnData)
  XLSX.writeFile(unWb, unPath)
  console.log(`- UNIDADES recreadas: ${newUnData.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
