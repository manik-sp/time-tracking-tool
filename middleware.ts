import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Allow API routes to bypass middleware
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return res
  }

  // List of public routes
  const publicRoutes = ['/', '/login', '/signup']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}