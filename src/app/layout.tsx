import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HRA - Gestión de Camas",
  description: "Sistema de gestión de camas Hospital Regional de Antofagasta",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = null;
  
  if (session && session.userId) {
    user = await prisma.user.findUnique({
      where: { id: Number(session.userId) },
      select: { name: true, email: true, role: true }
    });
  }

  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full flex`}>
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
