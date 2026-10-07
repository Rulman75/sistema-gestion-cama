import { prisma } from '@/lib/prisma'
import { WaitlistForm, WaitlistActions } from './WaitlistForm'

export default async function WaitlistPage() {
  const waitlist = await prisma.waitlist.findMany({
    include: { unit: true },
    orderBy: { createdAt: 'desc' }
  })
  
  const units = await prisma.unit.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Demanda / Lista de Espera (UE)</h1>
        <WaitlistForm units={units} />
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad Solicitada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {waitlist.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.unit.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.notes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {new Date(entry.createdAt).toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'WAITING' ? 'bg-orange-100 text-orange-800' : 
                    entry.status === 'ASSIGNED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {entry.status === 'WAITING' ? 'En Espera' : entry.status === 'ASSIGNED' ? 'Cama Asignada' : 'Cancelado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <WaitlistActions id={entry.id} currentStatus={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
