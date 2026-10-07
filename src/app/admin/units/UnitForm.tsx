'use client'

import { useState } from 'react'
import { createUnit, deleteUnit } from './actions'

export function UnitForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createUnit(formData)

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
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Nueva Unidad
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Crear Unidad</h2>
            
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Unidad</label>
                <input required name="name" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej: UCI" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select required name="type" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="CRITICAL">Unidad Crítica</option>
                  <option value="BASIC">Unidad Básica</option>
                  <option value="OTHER">Otra</option>
                </select>
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
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 ml-4 disabled:opacity-50"
    >
      Eliminar
    </button>
  )
}
