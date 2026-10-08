export type Locale = 'fr' | 'en'
export const isLocale = (value: unknown): value is Locale => value === 'fr' || value === 'en'

export function preferredLocale(cookie: string | undefined, acceptLanguage: string): Locale {
  if (isLocale(cookie)) return cookie
  const languages = acceptLanguage.split(',').map((part, index) => {
    const [tag, ...parameters] = part.trim().split(';')
    const quality = parameters.find(p => p.trim().startsWith('q='))?.trim().slice(2)
    return { language: tag.toLowerCase().split('-')[0], quality: quality === undefined ? 1 : Number(quality), index }
  }).filter(item => item.quality > 0 && Number.isFinite(item.quality))
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
  // Only the visitor's preferred language determines the initial version.
  return languages[0]?.language === 'en' ? 'en' : 'fr'
}
