import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PesaMind — AI Financial Intelligence',
  description: 'M-Pesa insights powered by AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
