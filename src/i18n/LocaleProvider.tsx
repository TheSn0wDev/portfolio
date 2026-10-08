'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { translate } from './messages'
export { translate } from './messages'
import type { Locale } from './locale'

const LocaleContext = createContext<Locale>('fr')
function translateContent<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return translate(value, locale) as T
  if (Array.isArray(value)) return value.map(item => translateContent(item, locale)) as T
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateContent(item, locale)])) as T
  return value
}
export function LocaleProvider({ locale, children }: { locale: Locale; children?: ReactNode }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.cookie = `portfolio-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  }, [locale])
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}
export function useLocale() { return useContext(LocaleContext) }
export function useTranslation() {
  const locale = useLocale()
  return (text: string) => translate(text, locale)
}
export function useContent<T>(content: T): T {
  const locale = useLocale()
  return useMemo(() => translateContent(content, locale), [content, locale])
}
