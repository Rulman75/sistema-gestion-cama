import { prisma } from '@/lib/prisma'
import { UnitForm, DeleteUnitButton } from './UnitForm'

export default async function UnitsPage() {
  const units = await prisma.unit.findMany({
    include: {
      _count: {
        select: { beds: true, waitlist: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mantenedor de Unidades (Sectores)</h1>
        <UnitForm />
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Camas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Espera</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {unit.type === 'CRITICAL' ? 'Crítica' : unit.type === 'BASIC' ? 'Básica' : 'Otra'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{unit._count.beds}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{unit._count.waitlist}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900">Editar</a>
                  <DeleteUnitButton id={unit.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
