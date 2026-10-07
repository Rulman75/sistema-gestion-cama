'use client'

import { useState } from 'react'
import { createBed, deleteBed, updateBedStatus, updateBed } from './actions'
import { Pencil, Trash2, X } from 'lucide-react'

type Unit = { id: number, name: string, areaId: number | null }
type Area = { id: number, name: string }
type Sector = { id: number, name: string }
type TipoCama = { id: number, descripcion: string }

export function BedForm({ units, areas, sectors, tipoCamas, item }: { units: Unit[], areas: Area[], sectors: Sector[], tipoCamas: TipoCama[], item?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // To filter units based on area
  const [selectedAreaId, setSelectedAreaId] = useState<number | ''>(item?.unit?.areaId || '')

  const filteredUnits = selectedAreaId 
    ? units.filter(u => u.areaId === selectedAreaId) 
    : units

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    let result
    if (item) {
      result = await updateBed(item.id, formData)
    } else {
      result = await createBed(formData)
    }

    if (result && 'error' in result && result.error) {
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
          Agregar Cama
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#004A98]">{item ? 'Editar Cama' : 'Agregar Nueva Cama'}</h2>
            
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Área (Opcional - para filtrar Unidades)</label>
                <select 
                  value={selectedAreaId} 
                  onChange={(e) => setSelectedAreaId(e.target.value ? Number(e.target.value) : '')} 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Todas las áreas...</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad</label>
                <select required name="unitId" defaultValue={item?.unitId} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">Seleccione una unidad...</option>
                  {filteredUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <select name="sectorId" defaultValue={item?.sectorId || ''} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">Ninguno...</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Cama</label>
                <select name="tipoCamaId" defaultValue={item?.tipoCamaId || ''} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="">Ninguno...</option>
                  {tipoCamas.map(t => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción / Número de Cama</label>
                <input name="numCama" defaultValue={item?.numCama || ''} type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Ej: Cama 101, Aislamiento..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select required name="status" defaultValue={item?.status || 'AVAILABLE'} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="OCCUPIED">Ocupada</option>
                  <option value="MAINTENANCE">En Mantenimiento</option>
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
    </>
  )
}

export function BedActions({ id, currentStatus }: { id: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await updateBedStatus(id, e.target.value)
    setLoading(false)
  }

  async function handleDelete() {
    if (confirm('¿Estás seguro de que quieres eliminar esta cama?')) {
      setLoading(true)
      await deleteBed(id)
    }
  }

  return (
    <div className="flex items-center space-x-4 justify-end">
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className="text-sm border-gray-300 rounded-md py-1"
      >
        <option value="AVAILABLE">Disponible</option>
        <option value="OCCUPIED">Ocupada</option>
        <option value="MAINTENANCE">Mantenimiento</option>
      </select>
      
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 inline" />
      </button>
    </div>
  )
}
