import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

interface IMainLayout {
  children: React.ReactNode
}

function MainLayout({ children }: IMainLayout) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  )
}

export default MainLayout
