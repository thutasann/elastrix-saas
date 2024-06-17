export interface ICreateCheckoutSessionRequest {
  subAccountConnectAccId: string
  prices: {
    recurring: boolean
    productId: string
  }[]
  subAccountId: string
}

export interface IAddress {
  city: string
  country: string
  line1: string
  postal_code: string
  state: string
}

export interface IShippingInfo {
  address: IAddress
  name: string
}

export interface IStripeCustomerType {
  email: string
  name: string
  shipping: IShippingInfo
  address: IAddress
}

export interface ICreateSubscription {
  customerId: string
  priceId: string
}
