const fs = require('fs')
const path = require('path')

const entities = [
  { name: 'Area', url: 'areas', model: 'area', label: 'Áreas', field: 'name' },
  { name: 'Sector', url: 'sectors', model: 'sector', label: 'Sectores', field: 'name' },
  { name: 'TipoCama', url: 'tipocamas', model: 'tipoCama', label: 'Tipos de Cama', field: 'descripcion' }
]

entities.forEach(ent => {
  const dir = path.join(__dirname, 'src/app/admin', ent.url)
  fs.mkdirSync(dir, { recursive: true })

  // actions.ts
  const actionsCode = `'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function create${ent.name}(formData: FormData) {
  const ${ent.field} = formData.get('${ent.field}') as string
  if (!${ent.field}) return { error: 'El campo es obligatorio' }
  await prisma.${ent.model}.create({ data: { ${ent.field} } })
  revalidatePath('/admin/${ent.url}')
  return { success: true }
}

export async function update${ent.name}(id: number, formData: FormData) {
  const ${ent.field} = formData.get('${ent.field}') as string
  if (!${ent.field}) return { error: 'El campo es obligatorio' }
  await prisma.${ent.model}.update({ where: { id }, data: { ${ent.field} } })
  revalidatePath('/admin/${ent.url}')
  return { success: true }
}

export async function delete${ent.name}(id: number) {
  try {
    await prisma.${ent.model}.delete({ where: { id } })
    revalidatePath('/admin/${ent.url}')
    return { success: true }
  } catch (e) {
    return { error: 'No se puede eliminar porque está en uso.' }
  }
}
`
  fs.writeFileSync(path.join(dir, 'actions.ts'), actionsCode)

  // Form.tsx
  const formCode = `'use client'
import { useState } from 'react'
import { create${ent.name}, update${ent.name}, delete${ent.name} } from './actions'
import { Pencil, Trash2, X } from 'lucide-react'

export function ${ent.name}Form({ item }: { item?: any }) {
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
      result = await update${ent.name}(item.id, formData)
    } else {
      result = await create${ent.name}(formData)
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
          Nueva ${ent.label}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#004A98]">{item ? 'Editar' : 'Crear'} ${ent.label}</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre / Descripción</label>
                <input required name="${ent.field}" defaultValue={item?.${ent.field}} type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
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
      const res = await delete${ent.name}(id)
      if (res?.error) { alert(res.error); setLoading(false) }
    }
  }
  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-900 disabled:opacity-50">
      <Trash2 className="w-4 h-4 inline" /> Eliminar
    </button>
  )
}
`
  fs.writeFileSync(path.join(dir, 'Form.tsx'), formCode)

  // page.tsx
  const pageCode = `import { prisma } from '@/lib/prisma'
import { ${ent.name}Form, DeleteButton } from './Form'

export default async function Page() {
  const items = await prisma.${ent.model}.findMany({ orderBy: { ${ent.field}: 'asc' } })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#004A98]">Mantenedor de ${ent.label}</h1>
        <${ent.name}Form />
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#004A98] uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-[#004A98] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.${ent.field}}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <${ent.name}Form item={item} />
                  <DeleteButton id={item.id} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No hay registros</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
`
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageCode)
})
