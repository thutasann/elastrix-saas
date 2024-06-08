'ues client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { PricesList, TicketDetails } from '@/dto/types/agency'
import { Agency, Contact, Plan, User } from '@prisma/client'

/** modal provider props */
interface ModalProviderProps {
  children: React.ReactNode
}

/** modal data types */
export type ModalDataProps = {
  user?: User
  agency?: Agency
  ticket?: TicketDetails[0]
  contact?: Contact
  plans?: {
    defaultPriceId: Plan
    plans: PricesList['data']
  }
}

/** Modal context type */
type ModalContextType = {
  /** modal data */
  data: ModalDataProps
  /** checking modal is opened or not */
  isOpen: boolean
  /** open fn */
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void
  /** close fn */
  setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
})

/**
 * Modal Provider
 */
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<ModalDataProps>({})
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /**
   * set open fn
   * @param modal - modal component
   * @param fetchData - fetch data function
   */
  const setOpen = async (modal: React.ReactNode, fetchData?: () => Promise<any>): Promise<void> => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {})
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  /**
   * set close fn
   */
  const setClose = (): void => {
    setIsOpen(false)
    setData({})
  }

  if (!isMounted) return null

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

/** useModal hook */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used withing the modal provider')
  }
  return context
}

export default ModalProvider
