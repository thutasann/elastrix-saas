'use client'

import React from 'react'
import { ThemeProvider } from '../providers/theme-provider'
import { ProgressLoaderBar } from '../components/molecules/loader/progress-bar'
import { Toaster } from '@/components/ui/toaster'
import ModalProvider from './modal-provider'

interface IRootProvider {
  children: React.ReactNode
}

/**
 * Root Provider for whole app
 */
export function RootProvider({ children }: IRootProvider) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <ProgressLoaderBar />
      <ModalProvider>
        {children}
        <Toaster />
      </ModalProvider>
    </ThemeProvider>
  )
}
