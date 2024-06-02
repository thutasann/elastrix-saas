import Navigation from '@/components/organisms/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

interface ISiteLayout {
  children: React.ReactNode
}

function SiteLayout({ children }: ISiteLayout) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <main className='h-full'>
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  )
}

export default SiteLayout
