import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Procesando CAMAS_INSERT.xlsx...')
  const filePath = 'Analisis/CAMAS_INSERT.xlsx'
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data: any[] = XLSX.utils.sheet_to_json(worksheet)

  console.log(`Encontradas ${data.length} filas en el Excel.`)

  const updatedData = []
  
  for (const row of data) {
    const unitId = Number(row['ID_UNIDAD'])
    const sectorId = Number(row['ID_SECTOR']) || null
    const tipoCamaId = Number(row['ID_TIPO_CAMA']) || null
    const numCama = row['NUM_CAMA']?.toString().trim() || null

    if (!unitId) continue

    const bed = await prisma.bed.create({
      data: {
        unitId,
        sectorId,
        tipoCamaId,
        numCama,
        status: 'AVAILABLE' // We default to AVAILABLE for imported beds
      }
    })

    // Retain all original properties but assign ID
    updatedData.push({
      ID: bed.id,
      ...row
    })
  }

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(updatedData)
  XLSX.writeFile(workbook, filePath)
  
  console.log(`Se insertaron ${updatedData.length} camas y se actualizaron los IDs en el Excel.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
