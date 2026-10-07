import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from './LoginForm'
import Image from 'next/image'

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect('/')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#004A98] bg-opacity-5">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl border border-gray-100">
        <div className="text-center flex flex-col items-center">
          <Image src="/HRA.jpg" alt="Logo HRA" width={220} height={100} className="object-contain mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-[#004A98]">Gestión de Camas</h2>
          <p className="mt-2 text-sm text-gray-500">Ingrese sus credenciales para acceder al sistema</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
