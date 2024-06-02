import { Fragment } from 'react'
import Image from 'next/image'
import { pricingCards } from '@/lib/constants'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <Fragment>
      <section className='relative mt-[-70px] flex h-full w-full flex-col items-center justify-center md:pt-44'>
        <div className='absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]' />

        <p className='text-center'>Run your agency, in one place</p>

        <div className='relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent'>
          <h1 className='text-center text-7xl font-bold md:text-[230px]'>Elastrix</h1>
        </div>
        <div className='relative flex items-center justify-center md:mt-[-70px]'>
          <Image
            src={'/assets/preview.png'}
            alt='banner image'
            height={1200}
            width={1200}
            className='rounded-tl-2xl rounded-tr-2xl border-2 border-muted'
          />
          <div className='absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background'></div>
        </div>
      </section>
      <section className='mt-[-60px] flex flex-col items-center justify-center gap-4 md:!mt-20'>
        <h2 className='text-center text-4xl'> Choose what fits you right</h2>
        <p className='text-center text-muted-foreground'>
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className='my-6 flex flex-wrap justify-center gap-4'>
          {pricingCards.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.priceId}
              className={clsx('flex w-[300px] flex-col justify-between', {
                'border-2 border-primary': card.title === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': card.title !== 'Unlimited Saas',
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{pricingCards.find((c) => c.title === card.title)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className='text-4xl font-bold'>{card.price}</span>
                <span className='text-muted-foreground'>
                  <span>/ {card.duration}</span>
                </span>
              </CardContent>
              <CardFooter className='flex flex-col items-start gap-4'>
                <div>
                  {pricingCards
                    .find((c) => c.title === card.title)
                    ?.features.map((feature) => (
                      <div key={feature} className='flex gap-2'>
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx('w-full rounded-md bg-primary p-2 text-center', {
                    '!bg-muted-foreground': card.title !== 'Unlimited Saas',
                  })}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Fragment>
  )
}
