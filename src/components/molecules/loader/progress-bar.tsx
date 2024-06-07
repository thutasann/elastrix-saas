'use client'

import React from 'react'
import { Next13ProgressBar } from 'next13-progressbar'

/**
 * Progressbar For when Navigating the Pages
 * @description This component is used for the entire app to navigate the project when navigating SSR pages
 */
export function ProgressLoaderBar() {
  return (
    <Next13ProgressBar
      height='1.5px'
      color='#007adf'
      startPosition={0.4}
      stopDelayMs={100}
      nonce='next-progressbar'
      options={{
        easing: 'ease-in-out',
        showSpinner: false,
      }}
      showOnShallow
    />
  )
}
