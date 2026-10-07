import { prisma } from '@/lib/prisma'
import BedGrid from './BedGrid'

export default async function GestionCamasPage() {
  const beds = await prisma.bed.findMany({
    include: {
      unit: { include: { area: true } },
      sector: true,
      tipoCama: true
    },
    orderBy: [
      { unit: { area: { name: 'asc' } } },
      { sector: { name: 'asc' } },
      { unit: { name: 'asc' } },
      { numCama: 'asc' },
      { id: 'asc' }
    ]
  })

  // Structure the data for the UI
  // Map: AreaName -> SectorName -> UnitName -> Beds[]
  const gridData: Record<string, Record<string, Record<string, typeof beds>>> = {}

  beds.forEach(bed => {
    const areaName = bed.unit.area?.name || 'Otras Áreas'
    const sectorName = bed.sector?.name || 'Sin Sector'
    const unitName = bed.unit.name

    if (!gridData[areaName]) gridData[areaName] = {}
    if (!gridData[areaName][sectorName]) gridData[areaName][sectorName] = {}
    if (!gridData[areaName][sectorName][unitName]) gridData[areaName][sectorName][unitName] = []

    gridData[areaName][sectorName][unitName].push(bed)
  })

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#004A98]">Gestión Camas</h1>
          <p className="text-gray-500 text-sm">Visión general del estado de todas las camas del hospital</p>
        </div>
        <div className="flex space-x-4 text-sm font-medium">
          <div className="flex items-center"><span className="w-4 h-4 rounded bg-green-500 mr-2"></span> Disponible</div>
          <div className="flex items-center"><span className="w-4 h-4 rounded bg-red-500 mr-2"></span> Ocupada</div>
          <div className="flex items-center"><span className="w-4 h-4 rounded bg-yellow-500 mr-2"></span> Mantenimiento</div>
        </div>
      </div>

      <BedGrid initialData={gridData} />
    </div>
  )
}
