import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { RootProvider } from '@/providers/root-provider'

export const metadata: Metadata = {
  title: 'Elastrix',
  description: 'Elastrix is the website builder and project management SAAS.',
  icons: {
    icon: '/assets/elastrix.png',
  },
}

/**
 * Entry Layout for the Entire app
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={GeistSans.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
