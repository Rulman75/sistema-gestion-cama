import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando base de datos...')
  await prisma.bed.deleteMany()
  await prisma.waitlist.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.sector.deleteMany()
  await prisma.tipoCama.deleteMany()
  await prisma.area.deleteMany()

  // 1. Map old Area IDs
  const arPath = 'Analisis/AREAS.xlsx'
  const arWb = XLSX.readFile(arPath)
  const arWs = arWb.Sheets[arWb.SheetNames[0]]
  const arData: any[] = XLSX.utils.sheet_to_json(arWs)
  
  const oldAreaToNewArea = new Map<string, number>()
  const newArData = []
  
  for (const row of arData) {
    const desc = row['DESC_AREA']?.toString().trim()
    const oldId = row['ID']?.toString().trim()
    if (!desc) continue
    const area = await prisma.area.create({ data: { name: desc } })
    if (oldId) oldAreaToNewArea.set(oldId, area.id)
    newArData.push({ ID: area.id, DESC_AREA: desc })
  }
  arWb.Sheets[arWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newArData)
  XLSX.writeFile(arWb, arPath)
  console.log('- AREAS migradas a Numérico')

  // 2. SECTORES
  const sectPath = 'Analisis/SECTORES.xlsx'
  const sectWb = XLSX.readFile(sectPath)
  const sectWs = sectWb.Sheets[sectWb.SheetNames[0]]
  const sectData: any[] = XLSX.utils.sheet_to_json(sectWs)
  const newSectData = []
  for (const row of sectData) {
    const desc = row['DESC_SECTOR']?.toString().trim()
    if (!desc) continue
    const sector = await prisma.sector.create({ data: { name: desc } })
    newSectData.push({ ID_SECTOR: sector.id, DESC_SECTOR: desc })
  }
  sectWb.Sheets[sectWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newSectData)
  XLSX.writeFile(sectWb, sectPath)
  console.log('- SECTORES migrados a Numérico')

  // 3. TIPO_CAMAS
  const tcPath = 'Analisis/TIPO_CAMAS.xlsx'
  const tcWb = XLSX.readFile(tcPath)
  const tcWs = tcWb.Sheets[tcWb.SheetNames[0]]
  const tcData: any[] = XLSX.utils.sheet_to_json(tcWs)
  const newTcData = []
  for (const row of tcData) {
    const desc = row['DESCRIPCIÓN']?.toString().trim()
    if (!desc) continue
    const tc = await prisma.tipoCama.create({ data: { descripcion: desc } })
    newTcData.push({ ID_TIPO_CAMA: tc.id, DESCRIPCIÓN: desc })
  }
  tcWb.Sheets[tcWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newTcData)
  XLSX.writeFile(tcWb, tcPath)
  console.log('- TIPO_CAMAS migrados a Numérico')

  // 4. UNIDADES
  const unPath = 'Analisis/UNIDADES_ID_REFERENCIA.xlsx'
  const unWb = XLSX.readFile(unPath)
  const unWs = unWb.Sheets[unWb.SheetNames[0]]
  const unData: any[] = XLSX.utils.sheet_to_json(unWs)
  const newUnData = []
  
  for (const row of unData) {
    const nombre = row['Nombre_Unidad']?.toString().trim()
    const oldAreaId = row['ID_AREA']?.toString().trim()
    
    if (!nombre) continue

    // Translate old area CUID to new Numeric ID
    const newAreaId = oldAreaId ? oldAreaToNewArea.get(oldAreaId) : null

    const unit = await prisma.unit.create({
      data: {
        name: nombre,
        areaId: newAreaId || null,
        type: 'BASIC'
      }
    })
    
    newUnData.push({
      ID_UNIDAD: unit.id,
      ID_AREA: newAreaId || '',
      Nombre_Unidad: nombre
    })
  }

  unWb.Sheets[unWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newUnData)
  XLSX.writeFile(unWb, unPath)
  console.log('- UNIDADES migradas a Numérico')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
