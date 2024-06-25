/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useEditor } from '@/providers/editor/editor-provider'
import { EditorElement } from '@/providers/editor/editor-types'
import { useRouter } from 'next/navigation'
import { getSubaccountDetails } from '@/lib/server-actions/queries/subaccount-queries'
import { getFunnel } from '@/lib/server-actions/queries/funnel-queries'
import { useToast } from '@/components/ui/use-toast'
import { EditorBtns } from '@/dto/types/globals'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/stripe-client'
import { CustomLoader } from '@/components/molecules/loader'
import { Trash } from 'lucide-react'

interface ICheckout {
  element: EditorElement
}

function Checkout({ element }: ICheckout) {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor()
  const router = useRouter()
  const { toast } = useToast()
  const [clientSecret, setClientSecret] = useState('')
  const [livePrices, setLivePrices] = useState([])
  const [subAccountConnectAccId, setSubAccountConnectAccId] = useState('')
  const options = useMemo(() => ({ clientSecret }), [clientSecret])
  const styles = element.styles

  // fetch subaccount details
  useEffect(() => {
    if (!subaccountId) return
    const fetchData = async () => {
      const subAccountDetails = await getSubaccountDetails(subaccountId)
      if (subAccountDetails) {
        if (!subAccountDetails.connectAccountId) return
        setSubAccountConnectAccId(subAccountDetails.connectAccountId)
      }
    }
    fetchData()
  }, [subaccountId])

  // fetch funnel detail
  useEffect(() => {
    if (funnelId) {
      const fetchData = async () => {
        const funnelData = await getFunnel(funnelId)
        setLivePrices(JSON.parse(funnelData?.liveProducts || '[]'))
      }
      fetchData()
    }
  }, [funnelId])

  // get client secret
  useEffect(() => {
    if (livePrices.length && subaccountId && subAccountConnectAccId) {
      const getClientSecret = async () => {
        try {
          const body = JSON.stringify({
            subAccountConnectAccId,
            prices: livePrices,
            subaccountId,
          })
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })
          const responseJson = await response.json()
          console.log('responseJson', responseJson)
          if (!responseJson) throw new Error('something went wrong')
          if (responseJson.error) {
            throw new Error(responseJson.error)
          }
          if (responseJson.clientSecret) {
            setClientSecret(responseJson.clientSecret)
          }
        } catch (error) {
          toast({
            open: true,
            className: 'z-[100000]',
            variant: 'destructive',
            title: 'Oppse!',
            //@ts-ignore
            description: error.message,
          })
        }
      }
      getClientSecret()
    }
  }, [livePrices, subaccountId, subAccountConnectAccId])

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type == null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, 'contactForm')}
      onClick={handleOnClickBody}
      className={cn('relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all', {
        '!border-blue-500': state.editor.selectedElement.id === element.id,

        '!border-solid': state.editor.selectedElement.id === element.id,
        'border-[1px] border-dashed border-slate-300': !state.editor.liveMode,
      })}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className='absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg'>
          {state.editor.selectedElement.name}
        </Badge>
      )}

      <div className='w-full border-none transition-all'>
        <div className='flex w-full flex-col gap-4'>
          {options.clientSecret && subAccountConnectAccId && (
            <div className='text-white'>
              <EmbeddedCheckoutProvider stripe={getStripe(subAccountConnectAccId)} options={options}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {livePrices.length === 0 && (
            <div className='flex h-40 w-full items-center justify-center font-semibold'>No Live Products Found.</div>
          )}

          {!options.clientSecret && livePrices.length > 0 && (
            <div className='flex h-40 w-full items-center justify-center'>
              <CustomLoader />
            </div>
          )}
        </div>
      </div>

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className='absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white'>
          <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default Checkout
