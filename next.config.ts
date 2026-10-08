import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const nextConfig: NextConfig = {
  // The OG route reads its vendored fonts from disk at request time.
  outputFileTracingIncludes: { '/og': ['./src/app/og/fonts/*.ttf'] },
}

export default withBotId(nextConfig)
