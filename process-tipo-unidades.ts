import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Process TIPO_CAMAS.xlsx
  console.log('Procesando TIPO_CAMAS.xlsx...')
  const tcFilePath = 'Analisis/TIPO_CAMAS.xlsx'
  const tcWorkbook = XLSX.readFile(tcFilePath)
  const tcSheetName = tcWorkbook.SheetNames[0]
  const tcWorksheet = tcWorkbook.Sheets[tcSheetName]
  const tcData: any[] = XLSX.utils.sheet_to_json(tcWorksheet)

  const updatedTcData = []
  for (const row of tcData) {
    const desc = row['DESCRIPCIÓN']?.toString().trim()
    if (!desc) continue

    const tc = await prisma.tipoCama.upsert({
      where: { descripcion: desc },
      update: {},
      create: { descripcion: desc }
    })

    updatedTcData.push({
      ID: tc.id,
      DESCRIPCIÓN: desc
    })
  }

  const newTcWorksheet = XLSX.utils.json_to_sheet(updatedTcData)
  tcWorkbook.Sheets[tcSheetName] = newTcWorksheet
  XLSX.writeFile(tcWorkbook, tcFilePath)
  console.log('TIPO_CAMAS.xlsx actualizado con los IDs.')

  // 2. Process UNIDADES_ID_REFERENCIA.xlsx to link units with areaId
  console.log('Procesando UNIDADES_ID_REFERENCIA.xlsx...')
  const unFilePath = 'Analisis/UNIDADES_ID_REFERENCIA.xlsx'
  const unWorkbook = XLSX.readFile(unFilePath)
  const unSheetName = unWorkbook.SheetNames[0]
  const unWorksheet = unWorkbook.Sheets[unSheetName]
  const unData: any[] = XLSX.utils.sheet_to_json(unWorksheet)

  let updatedUnits = 0
  for (const row of unData) {
    const idArea = row['ID_AREA']?.toString().trim()
    const nombreUnidad = row['Nombre_Unidad']?.toString().trim()

    if (idArea && nombreUnidad) {
      // Find the unit by name and update it with the areaId
      const unit = await prisma.unit.findFirst({ where: { name: nombreUnidad } })
      if (unit) {
        await prisma.unit.update({
          where: { id: unit.id },
          data: { areaId: idArea }
        })
        updatedUnits++
      }
    }
  }
  console.log(`Se actualizaron ${updatedUnits} unidades con su respectiva Área.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
