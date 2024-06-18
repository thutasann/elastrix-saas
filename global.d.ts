declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_STRIPE_CLIENT_ID: string
    STRIPE_SECRET_KEY: string
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string

    NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT: number
    NEXT_PUBLIC_PLATFORM_ONETIME_FEE: number
    NEXT_PUBLIC_PLATFORM_AGENY_PERCENT: number
    NEXT_ELASTRIX_PRODUCT_ID: string
    STRIPE_WEBHOOK_SECRET: string
    STRIPE_WEBHOOK_SECRET_LIVE: string
  }
}