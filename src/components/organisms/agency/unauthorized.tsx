import Link from 'next/link'
import React from 'react'

export const Unauthorized = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='text-2xl font-extrabold md:text-5xl'>Unauthorized acccess!</h1>
      <p className='text-md my-2'>Please contact support or your agency owner to get access</p>
      <Link href='/' className='mt-4 rounded-md bg-primary p-2 px-3'>
        Back to home
      </Link>
    </div>
  )
}
