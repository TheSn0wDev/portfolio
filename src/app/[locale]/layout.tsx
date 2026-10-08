import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Archivo, Caveat, Instrument_Sans } from 'next/font/google'
import '../globals.css'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locale'
import { LocaleProvider } from '@/i18n/LocaleProvider'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export function generateStaticParams() { return [{ locale: 'fr' }, { locale: 'en' }] }
export const dynamicParams = false
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Clément Ozor | Software Engineer Backend & GenAI',
    description: locale === 'en'
      ? 'Clément Ozor’s portfolio: backend Software Engineer at Thales and GenAI project developer. Seeking a long-term GenAI engineering engagement from early 2027.'
      : 'Portfolio de Clément Ozor, Software Engineer backend chez Thales et développeur de projets GenAI. Disponible début 2027 pour une mission longue en GenAI Engineering.',
    alternates: { canonical: `/${locale}`, languages: { fr: '/fr', en: '/en', 'x-default': '/' } },
  }
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale} className={`${archivo.variable} ${instrumentSans.variable} ${caveat.variable}`}>
      <body><LocaleProvider locale={locale}>{children}</LocaleProvider></body>
    </html>
  )
}
