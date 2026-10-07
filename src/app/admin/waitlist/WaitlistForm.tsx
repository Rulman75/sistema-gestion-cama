'use client'

import { useState } from 'react'
import { createWaitlistEntry, updateWaitlistStatus } from './actions'

type Unit = { id: number, name: string }

export function WaitlistForm({ units }: { units: Unit[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createWaitlistEntry(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
      >
        Ingresar Paciente en Espera
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Ingresar a Lista de Espera</h2>
            
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad Solicitada</label>
                <select required name="unitId" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">Seleccione una unidad...</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notas / Detalles (opcional)</label>
                <input name="notes" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej: PEND REEV, SARM, etc" />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function WaitlistActions({ id, currentStatus }: { id: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await updateWaitlistStatus(id, e.target.value)
    setLoading(false)
  }

  return (
    <div className="flex items-center space-x-4 justify-end">
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className="text-sm border-gray-300 rounded-md"
      >
        <option value="WAITING">En Espera</option>
        <option value="ASSIGNED">Cama Asignada</option>
        <option value="CANCELLED">Cancelado</option>
      </select>
    </div>
  )
}
