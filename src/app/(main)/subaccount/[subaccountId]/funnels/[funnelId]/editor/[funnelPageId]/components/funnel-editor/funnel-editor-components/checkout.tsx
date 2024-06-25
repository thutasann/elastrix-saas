import { useEditor } from '@/providers/editor/editor-provider'
import { EditorElement } from '@/providers/editor/editor-types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface ICheckout {
  element: EditorElement
}

function Checkout({ element }: ICheckout) {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')

  return <div>Checkout</div>
}

export default Checkout
