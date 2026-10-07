'use client'

import { useState } from 'react'
import { createUnit, deleteUnit, updateUnit } from './actions'
import { Edit2, Plus, Trash2 } from 'lucide-react'

export function UnitForm({ unit, areas, sectors }: { unit?: { id: number, name: string, type: string, areaId: number | null, sectorId: number | null }, areas: any[], sectors: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEdit = !!unit

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = isEdit 
      ? await updateUnit(unit.id, formData)
      : await createUnit(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
      if (!isEdit) {
        ;(e.target as HTMLFormElement).reset()
      }
    }
  }

  return (
    <>
      {isEdit ? (
        <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-900 mx-2">
          Editar
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Nueva Unidad
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Editar Unidad' : 'Crear Unidad'}</h2>
            
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Unidad</label>
                <input required name="name" type="text" defaultValue={unit?.name} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej: UCI" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Unidad</label>
                <select required name="type" defaultValue={unit?.type || "OTHER"} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="CRITICAL">Unidad Crítica</option>
                  <option value="BASIC">Unidad Básica</option>
                  <option value="OTHER">Otra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Área (Piso)</label>
                <select name="areaId" defaultValue={unit?.areaId || ""} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">-- Sin Área asignada --</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <select name="sectorId" defaultValue={unit?.sectorId || ""} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">-- Sin Sector asignado --</option>
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
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

export function DeleteUnitButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (confirm('¿Estás seguro de que quieres eliminar esta unidad?')) {
      setLoading(true)
      const res = await deleteUnit(id)
      if (res?.error) {
        alert(res.error)
        setLoading(false)
      }
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-900 disabled:opacity-50 mx-2">
      Eliminar
    </button>
  )
}
