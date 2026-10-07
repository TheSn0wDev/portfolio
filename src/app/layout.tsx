import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Archivo, Caveat, Instrument_Sans } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Clément Ozor | Software Engineer Backend & GenAI',
  description: 'Portfolio de Clément Ozor, Software Engineer backend chez Thales et développeur de projets GenAI, avec pour objectif une mission de GenAI Engineer. Disponible début 2027 pour une mission longue.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${instrumentSans.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
