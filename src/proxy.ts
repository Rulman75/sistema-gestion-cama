import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key')

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jwtVerify(session, JWT_SECRET)
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Dashboard logic: redirect unauthenticated to login, but maybe dashboard is private too.
  // Actually, let's make everything except /login private.
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jwtVerify(session, JWT_SECRET)
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
