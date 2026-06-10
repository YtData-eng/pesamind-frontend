import type { Metadata, Viewport } from 'next'
import './mobile.css'


export const metadata: Metadata = {
  title: 'PesaMind — AI Financial Intelligence',
  description: 'M-Pesa insights powered by AI',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050F09',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
