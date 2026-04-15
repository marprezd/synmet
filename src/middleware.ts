// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { auth } from '@/lib/auth'
import { routing } from './i18n/routing'

export const runtime = 'nodejs'

export default async function middleware(request: NextRequest) {
  // Handle i18n routing first
  const i18nResponse = createMiddleware(routing)(request)
  if (i18nResponse.status !== 200) {
    return i18nResponse
  }

  // Auth check for protected routes
  const { pathname } = request.nextUrl
  const protectedRoutes = ['dashboard', 'settings', 'projects']
  const isProtected = protectedRoutes.some(route => pathname.includes(`/${route}`)) && !pathname.includes('/auth')
  if (isProtected) {
    const session = await auth()
    if (!session) {
      // Get locale from pathname or default
      const locale = pathname.split('/')[1] || routing.defaultLocale
      const signinUrl = `/${locale}/auth/signin`
      return NextResponse.redirect(new URL(signinUrl, request.url))
    }
  }

  return NextResponse.next()
}

// Configuration for the middleware
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(es|en|pt)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
