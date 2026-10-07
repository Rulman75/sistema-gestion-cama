import { prisma } from '@/lib/prisma'
import { SectorForm, DeleteButton } from './Form'

export default async function Page() {
  const items = await prisma.sector.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#004A98]">Mantenedor de Sectores</h1>
        <SectorForm />
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-[#004A98] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <SectorForm item={item} />
                  <DeleteButton id={item.id} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No hay registros</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
