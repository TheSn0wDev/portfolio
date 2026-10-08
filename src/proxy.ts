import { NextRequest, NextResponse } from 'next/server'
import { preferredLocale } from './i18n/locale'

export function proxy(request: NextRequest) {
  const locale = preferredLocale(request.cookies.get('portfolio-locale')?.value, request.headers.get('accept-language') ?? '')
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}`
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Cookie, Accept-Language')
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
export const config = { matcher: '/' }
