'use client'

import { useState } from 'react'

type Bed = any // Using any for simplicity in this mockup, we can type it fully later

export default function BedGrid({ initialData }: { initialData: Record<string, Record<string, Record<string, Bed[]>>> }) {
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)

  // Sort areas logically (e.g. 4to PISO before 5to PISO if possible)
  const areas = Object.keys(initialData).sort((a, b) => a.localeCompare(b))

  function getStatusColor(status: string) {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500 text-white border-green-600 shadow-green-200'
      case 'OCCUPIED': return 'bg-red-500 text-white border-red-600 shadow-red-200'
      case 'MAINTENANCE': return 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-yellow-100'
      case 'BLOCKED': return 'bg-gray-500 text-white border-gray-600 shadow-gray-200'
      default: return 'bg-gray-200 text-gray-700 border-gray-300'
    }
  }

  function handleExportExcel() {
    import('xlsx').then(XLSX => {
      // Build a visual matrix similar to the physical sheet
      // Columns represent Area -> Sector -> Unit
      // Rows represent the beds underneath
      
      const columnsData: any[] = [] // Array of { area, sector, unit, beds: Bed[] }
      
      areas.forEach(area => {
        const sectors = Object.keys(initialData[area]).sort()
        sectors.forEach(sector => {
          const units = Object.keys(initialData[area][sector]).sort()
          units.forEach(unit => {
            columnsData.push({
              area,
              sector,
              unit,
              beds: initialData[area][sector][unit]
            })
          })
        })
      })

      // We need 4 header rows: Title, Area, Sector, Unit
      const maxBeds = Math.max(...columnsData.map(c => c.beds.length), 0)
      const aoa: any[][] = []
      
      // Row 0: Title and Date
      aoa.push(['REPORTE DE GESTIÓN DE CAMAS', '', '', `FECHA: ${new Date().toLocaleDateString()}`])
      aoa.push([]) // Empty row
      
      // Headers
      const areaRow: string[] = []
      const sectorRow: string[] = []
      const unitRow: string[] = []
      
      columnsData.forEach(col => {
        areaRow.push(col.area, '') // 2 columns per unit: Cama, Estado
        sectorRow.push(col.sector, '')
        unitRow.push(col.unit, '')
      })
      
      aoa.push(areaRow)
      aoa.push(sectorRow)
      aoa.push(unitRow)
      
      // Data rows
      for (let i = 0; i < maxBeds; i++) {
        const row: string[] = []
        columnsData.forEach(col => {
          if (i < col.beds.length) {
            const bed = col.beds[i]
            const bedName = bed.numCama || bed.id
            const statusLabel = bed.status === 'AVAILABLE' ? 'Libre' : bed.status === 'OCCUPIED' ? 'Ocup' : bed.status === 'MAINTENANCE' ? 'Mant' : bed.status === 'BLOCKED' ? 'Bloq' : 'Otro'
            // We put Bed Name in one cell, Status in the next
            row.push(bedName, statusLabel)
          } else {
            row.push('', '')
          }
        })
        aoa.push(row)
      }

      const worksheet = XLSX.utils.aoa_to_sheet(aoa)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sábana")
      XLSX.writeFile(workbook, `Gestion_Camas_${new Date().toISOString().split('T')[0]}.xlsx`)
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow">
          Exportar a Excel
        </button>
      </div>
      <div className="space-y-8">
      {areas.map(area => (
        <div key={area} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Encabezado del Área (Piso) */}
          <div className="bg-[#004A98] text-white px-6 py-3 font-bold text-lg flex justify-between items-center">
            <h2>{area}</h2>
          </div>

          <div className="p-4 space-y-6">
            {Object.keys(initialData[area]).sort().map(sector => (
              <div key={sector} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                <h3 className="font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">{sector}</h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {Object.keys(initialData[area][sector]).sort().map(unit => (
                    <div key={unit} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{unit}</h4>
                      
                      <div className="flex flex-wrap gap-2">
                        {initialData[area][sector][unit].map((bed: Bed) => (
                          <button
                            key={bed.id}
                            onClick={() => setSelectedBed(bed)}
                            className={`w-12 h-12 flex flex-col items-center justify-center rounded-md border-b-2 shadow-sm text-xs font-bold transition-transform hover:scale-110 ${getStatusColor(bed.status)}`}
                            title={`${unit} - Cama ${bed.numCama || bed.id}${bed.notes ? `\nObservación: ${bed.notes}` : ''}`}
                          >
                            <span className="truncate w-full text-center px-1">
                              {bed.numCama ? bed.numCama : bed.id}
                            </span>
                            {/* Here we could show patient initials if occupied */}
                            {bed.status === 'OCCUPIED' && (
                              <span className="text-[9px] opacity-80 font-normal truncate w-full text-center">Ocup</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedBed && (
        <BedModal 
          bed={selectedBed} 
          onClose={() => setSelectedBed(null)} 
          onUpdate={async (status, notes) => {
            const { updateBedStatus } = await import('./actions')
            await updateBedStatus(selectedBed.id, status, notes)
            selectedBed.status = status
            selectedBed.notes = notes
            setSelectedBed({...selectedBed})
          }} 
        />
      )}
    </div>
    </div>
  )
}

function BedModal({ bed, onClose, onUpdate }: { bed: Bed, onClose: () => void, onUpdate: (status: string, notes: string) => void }) {
  const [status, setStatus] = useState(bed.status)
  const [notes, setNotes] = useState(bed.notes || '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    await onUpdate(status, notes)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          ×
        </button>
        <h3 className="text-xl font-bold text-[#004A98] mb-1">Cama {bed.numCama || bed.id}</h3>
        <p className="text-sm text-gray-500 mb-6">{bed.unit.name} • {bed.sector?.name || 'Sin sector'}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Cambiar Estado</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setStatus('AVAILABLE')}
                className={`py-2 rounded font-medium text-xs border transition-colors ${status === 'AVAILABLE' ? 'bg-green-500 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                Disponible
              </button>
              <button 
                onClick={() => setStatus('OCCUPIED')}
                className={`py-2 rounded font-medium text-xs border transition-colors ${status === 'OCCUPIED' ? 'bg-red-500 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                Ocupada
              </button>
              <button 
                onClick={() => setStatus('MAINTENANCE')}
                className={`py-2 rounded font-medium text-xs border transition-colors ${status === 'MAINTENANCE' ? 'bg-yellow-400 text-yellow-900 border-yellow-500' : 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100'}`}>
                Mantención
              </button>
              <button 
                onClick={() => setStatus('BLOCKED')}
                className={`py-2 rounded font-medium text-xs border transition-colors ${status === 'BLOCKED' ? 'bg-gray-500 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>
                Bloqueada
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Observaciones / Paciente</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm h-24 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Ej: JSB - Ingresa por urgencia..."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={handleSave} disabled={loading} className="bg-[#004A98] text-white px-4 py-2 rounded-md hover:bg-[#003875] font-medium text-sm disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
