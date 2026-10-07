'use client'

import { useState } from 'react'
import { createSolicitud, updateSolicitud } from './actions'
import { Plus, Check, Save } from 'lucide-react'

export default function SolicitudesClient({ initialData, units, beds }: { initialData: any[], units: any[], beds: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filter based on Type
  const rcaData = initialData.filter(d => d.tipoSolicitud === 'RCA_UCMA')
  const critData = initialData.filter(d => d.tipoSolicitud === 'CRITICA')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createSolicitud(formData)
    setIsOpen(false)
    setLoading(false)
  }

  async function handleAssign(id: number, val: string) {
    await updateSolicitud(id, val)
  }

  const renderTable = (title: string, data: any[], type: string) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
      <div className="bg-[#004A98] text-white px-6 py-3 flex justify-between items-center">
        <h2 className="font-bold text-lg">{title}</h2>
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Nuevo Registro
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Unidad Origen</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Nombre Paciente</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Diagnóstico Médico</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Requerimiento</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Cama Asignada</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{req.unidadOrigen}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{req.nombrePaciente}</td>
                <td className="px-4 py-3 text-gray-600">{req.diagnostico}</td>
                <td className="px-4 py-3 text-gray-600">{req.requerimiento}</td>
                <td className="px-4 py-3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-32 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    defaultValue={req.camaAsignada || ''}
                    onChange={(e) => handleAssign(req.id, e.target.value)}
                  >
                    <option value="">-- Asignar --</option>
                    {beds.map((b: any) => (
                      <option key={b.id} value={b.numCama || b.id}>
                        {b.unit.name} - {b.numCama || b.id}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.estado === 'ASIGNADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {req.estado}
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-gray-500">No hay registros</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {renderTable('SOLICITUDES ÁREAS PROCEDIMIENTO RCA - UCMA', rcaData, 'RCA_UCMA')}
      {renderTable('SOLICITUDES UNIDADES CRÍTICAS', critData, 'CRITICA')}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4 text-[#004A98]">Nueva Solicitud</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Solicitud</label>
                <select name="tipoSolicitud" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="RCA_UCMA">Áreas Procedimiento RCA-UCMA</option>
                  <option value="CRITICA">Unidades Críticas</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidad Origen</label>
                  <select required name="unidadOrigen" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="">Seleccione...</option>
                    {units.map((u: any) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requerimiento</label>
                  <input required name="requerimiento" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej: UCO" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Paciente</label>
                <input required name="nombrePaciente" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnóstico Médico</label>
                <input required name="diagnostico" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cama Asignada (Opcional)</label>
                <select name="camaAsignada" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">-- Sin asignar --</option>
                  {beds.map((b: any) => (
                    <option key={b.id} value={b.numCama || b.id}>
                      {b.unit.name} - Cama {b.numCama || b.id}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-[#004A98] text-white px-4 py-2 rounded-md hover:bg-[#003875] disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
