import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const filePath = 'Analisis/AREAS.xlsx'
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data: any[] = XLSX.utils.sheet_to_json(worksheet)

  console.log(`Procesando ${data.length} áreas...`)

  const updatedData = []

  for (const row of data) {
    const descArea = row['DESC_AREA']?.toString().trim()
    if (!descArea) continue

    // Insert or update area
    const area = await prisma.area.upsert({
      where: { name: descArea },
      update: {},
      create: { name: descArea }
    })

    // Add ID to row
    updatedData.push({
      ID: area.id,
      DESC_AREA: descArea
    })
  }

  // Create new worksheet and save
  const newWorksheet = XLSX.utils.json_to_sheet(updatedData)
  workbook.Sheets[sheetName] = newWorksheet
  
  XLSX.writeFile(workbook, filePath)
  console.log('Archivo Excel actualizado correctamente con los IDs.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
