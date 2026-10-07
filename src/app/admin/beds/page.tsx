import { prisma } from '@/lib/prisma'
import { BedForm, BedActions } from './BedForm'

export default async function BedsPage() {
  const beds = await prisma.bed.findMany({
    include: { 
      unit: { include: { area: true } },
      sector: true,
      tipoCama: true
    },
    orderBy: [{ unit: { name: 'asc' } }]
  })
  
  const units = await prisma.unit.findMany({ orderBy: { name: 'asc' } })
  const areas = await prisma.area.findMany({ orderBy: { name: 'asc' } })
  const sectors = await prisma.sector.findMany({ orderBy: { name: 'asc' } })
  const tipoCamas = await prisma.tipoCama.findMany({ orderBy: { descripcion: 'asc' } })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#004A98]">Mantenedor de Camas</h1>
        <BedForm units={units} areas={areas} sectors={sectors} tipoCamas={tipoCamas} />
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">Unidad (Área)</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">Sector</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">ID / Núm</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#004A98] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-[#004A98] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {beds.map((bed) => (
              <tr key={bed.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{bed.unit.name}</div>
                  {bed.unit.area?.name && <div className="text-xs text-gray-500">{bed.unit.area.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed.sector?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed.tipoCama?.descripcion || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{bed.numCama || bed.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bed.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                    bed.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bed.status === 'AVAILABLE' ? 'Disponible' : bed.status === 'OCCUPIED' ? 'Ocupada' : 'Mantenimiento'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end">
                    <BedForm units={units} areas={areas} sectors={sectors} tipoCamas={tipoCamas} item={bed} />
                    <BedActions id={bed.id} currentStatus={bed.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
