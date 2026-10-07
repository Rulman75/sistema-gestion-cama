import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Borrando datos antiguos...')
  await prisma.bed.deleteMany({})
  await prisma.waitlist.deleteMany({})
  await prisma.unit.deleteMany({})

  console.log('Procesando UNIDADES_ID_REFERENCIA.xlsx...')
  const filePath = 'Analisis/UNIDADES_ID_REFERENCIA.xlsx'
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data: any[] = XLSX.utils.sheet_to_json(worksheet)

  const updatedData = []
  
  for (const row of data) {
    const idArea = row['ID_AREA']?.toString().trim()
    const nombreUnidad = row['Nombre_Unidad']?.toString().trim()

    if (nombreUnidad) {
      const unit = await prisma.unit.create({
        data: {
          name: nombreUnidad,
          areaId: idArea || null,
          type: 'BASIC' // Asignado por defecto, ya que no viene en el excel
        }
      })

      updatedData.push({
        ID_UNIDAD: unit.id,
        ID_AREA: idArea,
        Nombre_Unidad: nombreUnidad
      })
    }
  }

  const newWorksheet = XLSX.utils.json_to_sheet(updatedData)
  workbook.Sheets[sheetName] = newWorksheet
  XLSX.writeFile(workbook, filePath)
  
  console.log(`Se insertaron ${updatedData.length} unidades y se actualizó el Excel con los IDs.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
