import { prisma } from '@/lib/prisma'
import { Activity, Bed, Users } from 'lucide-react'

export default async function DashboardPage() {
  const units = await prisma.unit.findMany({
    include: {
      beds: true,
      waitlist: true
    }
  })

  const totalBeds = units.reduce((acc, u) => acc + u.beds.length, 0)
  const availableBeds = units.reduce((acc, u) => acc + u.beds.filter(b => b.status === 'AVAILABLE').length, 0)
  const waitingPatients = units.reduce((acc, u) => acc + u.waitlist.filter(w => w.status === 'WAITING').length, 0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard - Resumen de Camas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Camas Disponibles</p>
              <p className="text-2xl font-semibold text-gray-900">{availableBeds} / {totalBeds}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pacientes en Espera UE</p>
              <p className="text-2xl font-semibold text-gray-900">{waitingPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unidades Activas</p>
              <p className="text-2xl font-semibold text-gray-900">{units.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Estado por Unidad</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {units.map(unit => {
            const unitAvailable = unit.beds.filter(b => b.status === 'AVAILABLE').length
            const unitWaiting = unit.waitlist.filter(w => w.status === 'WAITING').length
            
            return (
              <div key={unit.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{unit.name}</h3>
                  <p className="text-sm text-gray-500">{unit.type === 'CRITICAL' ? 'Unidad Crítica' : unit.type === 'BASIC' ? 'Unidad Básica' : 'Otra'}</p>
                </div>
                <div className="flex space-x-8 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 mb-1">Disponibles</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${unitAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {unitAvailable}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 mb-1">En Espera</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${unitWaiting > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                      {unitWaiting}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
