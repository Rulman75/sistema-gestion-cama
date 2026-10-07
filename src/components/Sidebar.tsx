'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bed, Users, Building, Activity, LayoutDashboard, LogOut, ChevronDown, ChevronRight, Layers, Tag, Map, Grid, FileText, AlertCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

type User = { name: string, email: string, role: string }

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [isMantenedoresOpen, setIsMantenedoresOpen] = useState(pathname.startsWith('/admin'))

  if (pathname === '/login') return null

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Gestión Camas', href: '/gestion-camas', icon: Grid },
    { name: 'Reporte MINSAL', href: '/reporte-minsal', icon: FileText },
    { name: 'Solicitudes Críticas', href: '/solicitudes', icon: AlertCircle },
    // { name: 'Lista de Espera UE', href: '/admin/waitlist', icon: Clock }, // Oculto por ahora
  ]

  const mantenedores = [
    { name: 'Áreas', href: '/admin/areas', icon: Map },
    { name: 'Sectores', href: '/admin/sectors', icon: Layers },
    { name: 'Tipos de Cama', href: '/admin/tipocamas', icon: Tag },
    { name: 'Unidades', href: '/admin/units', icon: Building },
    { name: 'Camas', href: '/admin/beds', icon: Bed },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-[#004A98] text-white shadow-xl">
      <div className="flex flex-col items-center justify-center p-6 bg-white border-b border-gray-200">
        <Image src="/HRA.jpg" alt="Logo HRA" width={150} height={80} className="object-contain" />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-[#003875] text-white' : 'text-blue-100 hover:bg-[#003875] hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}

          <div className="pt-4">
            <button
              onClick={() => setIsMantenedoresOpen(!isMantenedoresOpen)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md text-blue-100 hover:bg-[#003875] hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                Mantenedores
              </div>
              {isMantenedoresOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {isMantenedoresOpen && (
              <div className="mt-1 space-y-1 pl-10 pr-3 border-l-2 border-[#003875] ml-4">
                {mantenedores.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? 'bg-[#003875] text-white' : 'text-blue-200 hover:bg-[#003875] hover:text-white'
                      }`}
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {user && (
        <div className="p-4 bg-[#003875]">
          <div className="flex items-center mb-4 px-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-blue-200 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/api/logout" method="POST">
            <button type="submit" className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-300 hover:text-red-100 rounded-md hover:bg-red-900/30 transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
