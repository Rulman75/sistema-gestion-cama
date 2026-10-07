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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#004A98] mb-8">Dashboard - Resumen de Camas</h1>

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

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Estado por Unidad (Tarjetones)</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {units.map(unit => {
          const unitAvailable = unit.beds.filter(b => b.status === 'AVAILABLE').length
          const unitOccupied = unit.beds.filter(b => b.status === 'OCCUPIED').length
          const unitMaintenance = unit.beds.filter(b => b.status === 'MAINTENANCE').length
          
          return (
            <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="px-5 py-4 border-b border-gray-100 bg-[#004A98] text-white flex justify-between items-center">
                <h3 className="text-sm font-bold truncate pr-2">{unit.name}</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Disponibles</span>
                  <span className="text-xl font-bold text-green-600">{unitAvailable}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Ocupadas</span>
                  <span className="text-xl font-bold text-red-600">{unitOccupied}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Mantención</span>
                  <span className="text-xl font-bold text-yellow-600">{unitMaintenance}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 text-xs text-center text-gray-500 font-medium">
                Total Camas: {unit.beds.length}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
