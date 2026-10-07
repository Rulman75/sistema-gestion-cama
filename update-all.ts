import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. SECTORES.xlsx
  console.log('Procesando SECTORES.xlsx...')
  const sectPath = 'Analisis/SECTORES.xlsx'
  const sectWb = XLSX.readFile(sectPath)
  const sectWs = sectWb.Sheets[sectWb.SheetNames[0]]
  const sectData: any[] = XLSX.utils.sheet_to_json(sectWs)

  const newSectData = []
  for (const row of sectData) {
    const desc = row['DESC_SECTOR']?.toString().trim()
    if (!desc) continue
    const sector = await prisma.sector.upsert({
      where: { name: desc },
      update: {},
      create: { name: desc }
    })
    newSectData.push({ ID_SECTOR: sector.id, DESC_SECTOR: desc })
  }
  sectWb.Sheets[sectWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newSectData)
  XLSX.writeFile(sectWb, sectPath)
  console.log(`- SECTORES actualizados: ${newSectData.length}`)

  // 2. TIPO_CAMAS.xlsx
  console.log('Procesando TIPO_CAMAS.xlsx...')
  const tcPath = 'Analisis/TIPO_CAMAS.xlsx'
  const tcWb = XLSX.readFile(tcPath)
  const tcWs = tcWb.Sheets[tcWb.SheetNames[0]]
  const tcData: any[] = XLSX.utils.sheet_to_json(tcWs)

  const newTcData = []
  for (const row of tcData) {
    const desc = row['DESCRIPCIÓN']?.toString().trim()
    if (!desc) continue
    const tc = await prisma.tipoCama.upsert({
      where: { descripcion: desc },
      update: {},
      create: { descripcion: desc }
    })
    newTcData.push({ ID_TIPO_CAMA: tc.id, DESCRIPCIÓN: desc })
  }
  tcWb.Sheets[tcWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newTcData)
  XLSX.writeFile(tcWb, tcPath)
  console.log(`- TIPO_CAMAS actualizados: ${newTcData.length}`)

  // 3. UNIDADES_ID_REFERENCIA.xlsx
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

    // Delete existing bed/waitlist references if they exist, but maybe they don't
    const unitExists = await prisma.unit.findFirst({ where: { name: nombre } })
    
    let unit
    if (unitExists) {
      unit = await prisma.unit.update({
        where: { id: unitExists.id },
        data: { areaId: idArea }
      })
    } else {
      unit = await prisma.unit.create({
        data: {
          name: nombre,
          areaId: idArea,
          type: 'BASIC'
        }
      })
    }
    
    newUnData.push({
      ID_UNIDAD: unit.id,
      ID_AREA: idArea,
      Nombre_Unidad: nombre
    })
  }

  unWb.Sheets[unWb.SheetNames[0]] = XLSX.utils.json_to_sheet(newUnData)
  XLSX.writeFile(unWb, unPath)
  console.log(`- UNIDADES actualizadas/creadas: ${newUnData.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
