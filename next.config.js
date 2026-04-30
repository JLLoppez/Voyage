/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers via Next.js (middleware also sets these per-request)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff'                       },
          { key: 'X-Frame-Options',          value: 'DENY'                          },
          { key: 'X-XSS-Protection',         value: '1; mode=block'                },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      { source: '/admin', destination: '/admin', permanent: false },
    ]
  },

  // Image domains (add your CDN here when you have one)
  images: {
    remotePatterns: [],
  },

  // Bundle analyser — run with ANALYZE=true npm run build
  ...(process.env.ANALYZE === 'true' && {
    // install @next/bundle-analyzer separately
  }),
}

module.exports = nextConfig
