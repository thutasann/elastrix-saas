import Navigation from '@/components/organisms/site/navigation'
import React from 'react'

interface ISiteLayout {
  children: React.ReactNode
}

function SiteLayout({ children }: ISiteLayout) {
  return (
    <main className='h-full'>
      <Navigation />
      {children}
    </main>
  )
}

export default SiteLayout
