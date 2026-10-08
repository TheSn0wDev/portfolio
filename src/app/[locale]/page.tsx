import { PortfolioRoot } from '@/components/PortfolioRoot'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <PortfolioRoot key={locale} />
}
