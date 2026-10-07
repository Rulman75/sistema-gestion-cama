import { prisma } from '@/lib/prisma'
import ReporteForm from './ReporteForm'

export default async function ReporteMinsalPage() {
  // Obtain live snapshot of beds availability
  const beds = await prisma.bed.findMany({
    include: { unit: true },
    where: { status: 'AVAILABLE' }
  })

  // Summarize availability by unit
  // Structure: { [unitName]: { H: number, M: number, I: number, total: number, type: string } }
  const availability: Record<string, any> = {}

  beds.forEach(bed => {
    const unitName = bed.unit.name
    if (!availability[unitName]) {
      availability[unitName] = { H: 0, M: 0, I: 0, total: 0, type: bed.unit.type }
    }
    
    availability[unitName].total += 1
    if (bed.gender === 'H') availability[unitName].H += 1
    else if (bed.gender === 'M') availability[unitName].M += 1
    else availability[unitName].I += 1 // Indeterminado/Sin especificar
  })

  // All active units for the Demand inputs
  const allUnits = await prisma.unit.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-[#004A98]">Reporte MINSAL</h1>
        <p className="text-gray-500 text-sm">Generación del reporte de las 07:00 AM o 19:00 PM</p>
      </div>

      <ReporteForm initialAvailability={availability} allUnits={allUnits} />
    </div>
  )
}
