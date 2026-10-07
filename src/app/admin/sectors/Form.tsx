'use client'
import { useState } from 'react'
import { createSector, updateSector, deleteSector } from './actions'
import { Pencil, Trash2, X } from 'lucide-react'

export function SectorForm({ item }: { item?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    
    let result
    if (item) {
      result = await updateSector(item.id, formData)
    } else {
      result = await createSector(formData)
    }

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      {item ? (
        <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-900 mx-2">
          <Pencil className="w-4 h-4 inline" /> Editar
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-[#004A98] text-white px-4 py-2 rounded-md hover:bg-[#003875]">
          Nueva Sectores
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#004A98]">{item ? 'Editar' : 'Crear'} Sectores</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre / Descripción</label>
                <input required name="name" defaultValue={item?.name} type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
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
    </>
  )
}

export function DeleteButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false)
  async function handleDelete() {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      setLoading(true)
      const res = await deleteSector(id)
      if (res?.error) { alert(res.error); setLoading(false) }
    }
  }
  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-900 disabled:opacity-50">
      <Trash2 className="w-4 h-4 inline" /> Eliminar
    </button>
  )
}
