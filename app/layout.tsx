import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { UIConfigProvider } from '@/lib/ui-config-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Palette Pally - MUI Color Palette Designer',
  description: 'Create and customize Material-UI color palettes with flexible design architecture',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <UIConfigProvider>
          {children}
        </UIConfigProvider>
        <Analytics />
      </body>
    </html>
  )
}
