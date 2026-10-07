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
      default: return 'bg-gray-200 text-gray-700 border-gray-300'
    }
  }

  return (
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
                            title={`${unit} - Cama ${bed.numCama || bed.id}`}
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

      {/* Modal / Panel Lateral Rápido para interactuar con la cama */}
      {selectedBed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setSelectedBed(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
               ✕
            </button>
            <h3 className="text-xl font-bold text-[#004A98] mb-1">Cama {selectedBed.numCama || selectedBed.id}</h3>
            <p className="text-sm text-gray-500 mb-6">{selectedBed.unit.name} • {selectedBed.sector?.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cambiar Estado</label>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-100 text-green-700 py-2 rounded font-medium border border-green-200 hover:bg-green-200 transition-colors">Disponible</button>
                  <button className="flex-1 bg-red-100 text-red-700 py-2 rounded font-medium border border-red-200 hover:bg-red-200 transition-colors">Ocupar</button>
                </div>
              </div>

              {/* Aquí más adelante agregaremos los campos de Iniciales Paciente, Diagnóstico, etc. */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400 italic">
                  Pronto: Opciones para colorear con conceptos, vincular paciente y generar traslados.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
