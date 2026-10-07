'use client'

import { useState } from 'react'
import { saveReport } from './actions'
import { Check, Save } from 'lucide-react'

export default function ReporteForm({ initialAvailability, allUnits }: { initialAvailability: Record<string, any>, allUnits: any[] }) {
  const [shift, setShift] = useState('AM')
  const [demand, setDemand] = useState<Record<string, number>>({})
  const [demandNotes, setDemandNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDemandChange = (unitName: string, value: string) => {
    setDemand(prev => ({ ...prev, [unitName]: parseInt(value) || 0 }))
  }

  const handleNoteChange = (unitName: string, value: string) => {
    setDemandNotes(prev => ({ ...prev, [unitName]: value }))
  }

  const onSubmit = async () => {
    if (!confirm('¿Deseas guardar y registrar este Reporte MINSAL?')) return
    setLoading(true)
    
    // Combine demand and notes
    const demandPayload = Object.keys(demand).reduce((acc: any, unitName) => {
      if (demand[unitName] > 0 || demandNotes[unitName]) {
        acc[unitName] = { count: demand[unitName] || 0, notes: demandNotes[unitName] || '' }
      }
      return acc
    }, {})

    await saveReport({
      shift,
      demandaUE: JSON.stringify(demandPayload),
      disponibilidad: JSON.stringify(initialAvailability)
    })

    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Lado Izquierdo: Demanda */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-red-50 text-red-900 px-6 py-4 border-b border-red-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Pacientes en UE / Red (Demanda)</h2>
          <select value={shift} onChange={e => setShift(e.target.value)} className="text-sm font-bold bg-white border border-red-200 rounded px-2 py-1">
            <option value="AM">Corte 07:00 AM</option>
            <option value="PM">Corte 19:00 PM</option>
          </select>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">Ingresa la cantidad de pacientes esperando cupo en cada unidad.</p>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold text-gray-600 pb-2">Unidad</th>
                <th className="text-center font-semibold text-gray-600 pb-2 w-24">Cantidad</th>
                <th className="text-left font-semibold text-gray-600 pb-2">Observaciones (Ej: Pend EV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {['SALA PREHOSPITALIZACION', 'RED', 'PACIENTES CRR', 'PACIENTES POLI', 'TRASLADOS MACRORED'].map(customOrigin => (
                <tr key={customOrigin} className="hover:bg-red-50 bg-red-50/30">
                  <td className="py-2 font-bold text-red-700">{customOrigin}</td>
                  <td className="py-2 px-2">
                    <input 
                      type="number" 
                      min="0"
                      className="w-full text-center border border-red-300 rounded-md py-1 bg-white"
                      onChange={e => handleDemandChange(customOrigin, e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input 
                      type="text" 
                      className="w-full border border-red-300 rounded-md py-1 px-2 text-xs bg-white"
                      placeholder="Opcional..."
                      onChange={e => handleNoteChange(customOrigin, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
              {allUnits.map(unit => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="py-2 font-medium text-gray-700">{unit.name}</td>
                  <td className="py-2 px-2">
                    <input 
                      type="number" 
                      min="0"
                      className="w-full text-center border border-gray-300 rounded-md py-1"
                      onChange={e => handleDemandChange(unit.name, e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-xs"
                      placeholder="Opcional..."
                      onChange={e => handleNoteChange(unit.name, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lado Derecho: Disponibilidad (Automático) */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className="bg-green-50 text-green-900 px-6 py-4 border-b border-green-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Camas Disponibles en Piso (Auto)</h2>
          <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Tiempo Real</span>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto max-h-[70vh]">
          <p className="text-sm text-gray-500 mb-4">Calculado automáticamente desde la Sábana de Camas.</p>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold text-gray-600 pb-2">Unidad</th>
                <th className="text-center font-semibold text-gray-600 pb-2">Hombres</th>
                <th className="text-center font-semibold text-gray-600 pb-2">Mujeres</th>
                <th className="text-center font-semibold text-gray-600 pb-2">Indet.</th>
                <th className="text-center font-bold text-green-700 pb-2">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(initialAvailability).sort().map(unitName => {
                const data = initialAvailability[unitName]
                return (
                  <tr key={unitName} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-700">{unitName}</td>
                    <td className="py-3 text-center text-gray-500">{data.H > 0 ? data.H : '-'}</td>
                    <td className="py-3 text-center text-gray-500">{data.M > 0 ? data.M : '-'}</td>
                    <td className="py-3 text-center text-gray-500">{data.I > 0 ? data.I : '-'}</td>
                    <td className="py-3 text-center font-bold text-green-600 text-lg">{data.total}</td>
                  </tr>
                )
              })}
              {Object.keys(initialAvailability).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No hay camas disponibles en este momento.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button 
            onClick={onSubmit} 
            disabled={loading || success}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${success ? 'bg-green-500' : 'bg-[#004A98] hover:bg-[#003875]'}`}
          >
            {success ? <><Check className="w-5 h-5" /> <span>Guardado</span></> : <><Save className="w-5 h-5" /> <span>Guardar Reporte</span></>}
          </button>
        </div>
      </div>
    </div>
  )
}
