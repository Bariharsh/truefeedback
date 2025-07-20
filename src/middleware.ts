import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


const publicPaths = ['/sign-in', '/sign-up', '/verify']

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl


  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }


  const isProtectedRoute = !publicPaths.includes(pathname) && pathname.startsWith('/dashboard')
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/verify/:path*', '/dashboard/:path*'],
}