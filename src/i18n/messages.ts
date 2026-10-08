import english from './en.json'
import type { Locale } from './locale'

const dictionary: Record<string, string> = english
export function translate(text: string, locale: Locale): string {
  return locale === 'en' ? dictionary[text] ?? text : text
}
