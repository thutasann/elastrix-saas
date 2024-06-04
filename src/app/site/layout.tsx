import Navigation from '@/components/organisms/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { dark } from '@clerk/themes'
import React from 'react'

interface ISiteLayout {
  children: React.ReactNode
}

async function SiteLayout({ children }: ISiteLayout) {
  const authUser = await currentUser()
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <main className='h-full'>
        <Navigation user={authUser} />
        {children}
      </main>
    </ClerkProvider>
  )
}

export default SiteLayout
