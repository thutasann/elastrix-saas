'use client'

import { NotificationWithUser } from '@/dto/types/agency'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet'
import { twMerge } from 'tailwind-merge'
import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Role } from '@prisma/client'
import { Card } from '../../ui/card'
import { Switch } from '../../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { ModeToggle } from '@/components/atoms/mode-toggle'

interface IInfoBar {
  notifications: NotificationWithUser | []
  role?: Role
  className?: string
  subAccountId?: string
}

function InfoBar({ notifications, role, className, subAccountId }: IInfoBar) {
  const [allNotifications, setAllNotifications] = useState(notifications)
  const [showAll, setShowAll] = useState(true)

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(notifications)
    } else {
      if (notifications?.length !== 0) {
        setAllNotifications(notifications?.filter((item) => item.subAccountId === subAccountId) ?? [])
      }
    }
    setShowAll((prev) => !prev)
  }

  return (
    <>
      <div
        className={twMerge(
          'fixed left-0 right-0 top-0 z-[20] flex items-center gap-4 border-b-[1px] p-4 backdrop-blur-md md:left-[300px]',
          className,
        )}
      >
        <div className='ml-auto flex items-center gap-2'>
          <UserButton afterSignOutUrl='/' />
          <Sheet>
            <SheetTrigger>
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white'>
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className='mr-4 mt-4 overflow-auto pr-4'>
              <SheetHeader className='text-left'>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  {(role === 'AGENCY_ADMIN' || role === 'AGENCY_OWNER') && (
                    <Card className='flex items-center justify-between p-4'>
                      Current Subaccount
                      <Switch onCheckedChange={handleClick} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>
              {allNotifications?.map((notification) => (
                <div key={notification.id} className='mb-2 flex flex-col gap-y-2 overflow-x-scroll text-ellipsis'>
                  <div className='flex gap-2'>
                    <Avatar>
                      <AvatarImage src={notification.User.avatarUrl} alt='Profile Picture' />
                      <AvatarFallback className='bg-primary'>
                        {notification.User.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <p>
                        <span className='font-bold'>{notification.notification.split('|')[0]}</span>
                        <span className='text-muted-foreground'>{notification.notification.split('|')[1]}</span>
                        <span className='font-bold'>{notification.notification.split('|')[2]}</span>
                      </p>
                      <small className='text-xs text-muted-foreground'>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {allNotifications?.length === 0 && (
                <div className='flex items-center justify-center text-muted-foreground' mb-4>
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

export default InfoBar
