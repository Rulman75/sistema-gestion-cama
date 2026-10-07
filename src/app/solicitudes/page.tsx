import { prisma } from '@/lib/prisma'
import SolicitudesClient from './SolicitudesClient'

export default async function SolicitudesPage() {
  const solicitudes = await prisma.solicitud.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  const units = await prisma.unit.findMany({ orderBy: { name: 'asc' } })
  const beds = await prisma.bed.findMany({ 
    include: { unit: true },
    orderBy: [{ unit: { name: 'asc' } }, { numCama: 'asc' }] 
  })

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-[#004A98]">Solicitudes Clínicas</h1>
        <p className="text-gray-500 text-sm">Registro de Solicitudes Áreas Procedimiento RCA-UCMA y Unidades Críticas</p>
      </div>

      <SolicitudesClient initialData={solicitudes} units={units} beds={beds} />
    </div>
  )
}
