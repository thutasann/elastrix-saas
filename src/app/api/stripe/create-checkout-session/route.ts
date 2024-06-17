import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { ICreateCheckoutSessionRequest } from '@/dto/types/stripe'

export async function POST(req: Request) {
  const { subAccountConnectAccId, prices }: ICreateCheckoutSessionRequest = await req.json()
  const origin = req.headers.get('origin')

  if (!subAccountConnectAccId || !prices.length) {
    return new NextResponse('Stripe account Id or price Id is missing', {
      status: 400,
    })
  }

  if (
    !process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT ||
    !process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE ||
    !process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT
  ) {
    console.log('VALUES DONT EXITS')
    return NextResponse.json({ error: 'Fees do not exist' })
  }

  const subscriptionPriceExists = prices.find((price) => price.recurring)

  try {
    /** stripe checkout session */
    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((price) => ({
          price: price.productId,
          quantity: 1,
        })),

        ...(subscriptionPriceExists && {
          subscription_data: {
            metadata: { connectAccountSubscriptions: 'true' },
            application_fee_percent: +process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
          },
        }),

        ...(!subscriptionPriceExists && {
          payment_intent_data: {
            metadata: { connectAccountPayments: 'true' },
            application_fee_amount: +process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE * 100,
          },
        }),

        mode: subscriptionPriceExists ? 'subscription' : 'payment',
        ui_mode: 'embedded',
        redirect_on_completion: 'never',
      },
      { stripeAccount: subAccountConnectAccId },
    )

    return NextResponse.json(
      {
        clientSecret: session.client_secret,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error: any) {
    console.log('🔴 Error', error)
    return NextResponse.json({ error: error.message })
  }
}

/**
 * the OPTIONS method is used to handle HTTP OPTIONS requests.
 * @description
 * - When a browser sends a request to a server on a different domain, it often sends an OPTIONS request first to check if the server will allow the actual request.
 * - This OPTIONS request is called a "preflight" request.
 * - The server must respond to this request with the appropriate headers to allow the actual request to be made.
 */
export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get('origin')
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Max-Age': '86400',
    },
  })
  return response
}
