export type NavLink = {
  href: string
  label: string
  mobileIndex: string
}

export const navLinks: NavLink[] = [
  { href: '#experiences', label: 'Expériences', mobileIndex: '01' },
  { href: '#projets', label: 'Projets', mobileIndex: '02' },
  { href: '#stack', label: 'Compétences', mobileIndex: '03' },
  { href: '#formation', label: 'Formation', mobileIndex: '04' },
]
