import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { ProgressLoaderBar } from '@/components/molecules/loader/progress-bar'

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
        <ProgressLoaderBar />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
