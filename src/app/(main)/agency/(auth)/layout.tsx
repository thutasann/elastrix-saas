import React from 'react'

interface IAuthLayout {
  children: React.ReactNode
}

function AuthLayout({ children }: IAuthLayout) {
  return (
    <div id='auth-layout' className='flex h-full items-center justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout
