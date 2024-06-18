'use client'

import React from 'react'
import { useModal } from '@/providers/modal-provider'
import { ColumnDef, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/molecules/modals/cutsom-modal'

interface IFunnelsTable<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterValue: string
  actionButtonText?: React.ReactNode
  modalChildren?: React.ReactNode
}

function FunnelsTable<TData, TValue>({
  columns,
  data,
  filterValue,
  modalChildren,
  actionButtonText,
}: IFunnelsTable<TData, TValue>) {
  const { isOpen, setOpen, setClose } = useModal()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 py-4'>
          <Search />
          <Input
            placeholder='Search funnel name...'
            value={(table.getColumn(filterValue)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(filterValue)?.setFilterValue(event.target.value)}
            className='h-12'
          />
        </div>
        <Button
          className='flex- gap-2'
          onClick={() => {
            if (modalChildren)
              setOpen(
                <CustomModal
                  title='Create A Funnel'
                  subheading='Funnels are a like websites, but better! Try creating one!'
                >
                  {modalChildren}
                </CustomModal>,
              )
          }}
        >
          {actionButtonText}
        </Button>
      </div>
    </>
  )
}

export default FunnelsTable
