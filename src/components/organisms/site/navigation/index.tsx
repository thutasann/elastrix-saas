import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from '@/components/atoms/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'

type Props = {
  user?: null | User
}

const Navigation = ({ user }: Props) => {
  return (
    <div className='fixed left-0 right-0 top-0 z-50 flex items-center justify-between p-4 backdrop-blur-md'>
      <Link href='/' className='flex items-center gap-2' scroll>
        <Image src={'/assets/elastrix.png'} width={40} height={40} alt='plur logo' />
        <span className='text-xl font-bold'> Elastrix.</span>
      </Link>
      <nav className='absolute left-[50%] top-[50%] hidden translate-x-[-50%] translate-y-[-50%] transform md:block'>
        <ul className='flex items-center justify-center gap-8'>
          <Link href={'#pricing'} className='cursor-pointer'>
            Pricing
          </Link>
          <Link href={'#'} className='cursor-default text-slate-500' scroll>
            About
          </Link>
          <Link href={'#'} className='cursor-default text-slate-500'>
            Documentation
          </Link>
          <Link href={'#'} className='cursor-default text-slate-500'>
            Features
          </Link>
        </ul>
      </nav>
      <aside className='flex items-center gap-2'>
        {!user ? (
          <Link href={'/agency'} className='rounded-md bg-primary p-2 px-4 text-white hover:bg-primary/80'>
            Login
          </Link>
        ) : (
          <Link
            href={'/agency'}
            className='rounded-md bg-dark-tremor-brand-muted p-2 px-4 text-white hover:bg-primary/80'
          >
            Agency
          </Link>
        )}
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}

export default Navigation
