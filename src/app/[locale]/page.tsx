'use client'

import { IconChevronDown, IconDeviceDesktopAnalytics, IconHeartbeat, IconShieldLock } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { Element } from 'react-scroll'
import CloudImage from '@/components/cloud-image'
import LandingPageFooter from '@/components/landing-page-footer'
import LandingPageNavbar from '@/components/landing-page-navbar'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Link } from '@/i18n/navigation'

export default function Home() {
  const t = useTranslations()

  return (
    <div className="bg-linear-to-br from-neutral-50 dark:from-black to-neutral-100 dark:to-neutral-950 w-full min-h-screen">
      {/* Navigation */}
      <LandingPageNavbar />

      {/* Hero Section */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 max-w-6xl">
        <div className="gap-4 grid grid-cols-12">
          <div className="place-self-center order-last md:order-first col-span-full md:col-span-6 sm:text-left text-center">
            <h1 className="font-bold text-neutral-900 dark:text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="my-6 font-normal text-neutral-600 dark:text-neutral-300 text-sm lg:text-base">
              {t('landing.heroDescription')}
            </p>
            <div className="flex sm:flex-row flex-col justify-start items-center gap-4">
              <Button
                variant="default"
                size="lg"
                render={(
                  <Link href="/dashboard">
                    {t('landing.cta')}
                  </Link>
                )}
                nativeButton={false}
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-6">
            <CloudImage
              alt="API Key Management Illustration"
              width={2000}
              height={2000}
              sizes="100vw"
              src="synmet/hero_agi5pl.png"
              style={{
                width: '100%',
                height: 'auto',
              }}
              loading="eager"
              quality="auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Element name="features">
        <section className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6 bg-lime-50 dark:bg-lime-950 px-4 py-10 lg:py-20">
            <div className="mx-auto max-w-sm">
              <div className="justify-start">
                <h2 className="font-bold text-lime-800 dark:text-lime-500 text-3xl lg:text-4xl">
                  {t('landing.featuresTitle')}
                </h2>
                <p className="mt-3 text-lime-700 dark:text-lime-600">
                  {t('landing.featuresDescription')}
                </p>
                <div className="bg-lime-100 dark:bg-lime-900 my-5 rounded-xl">
                  <Collapsible className="data-open:bg-lime-100 dark:data-open:bg-lime-900 p-1.5 data-open:border-2 data-open:border-lime-200 dark:data-open:border-lime-100 data-open:border-dashed rounded-xl">
                    <CollapsibleTrigger render={(
                      <Button variant="ghost" className="aria-expanded:bg-lime-50 hover:bg-lime-100 dark:aria-expanded:bg-lime-950 dark:hover:bg-lime-900 w-full text-lime-700 aria-expanded:text-lime-700 hover:text-lime-900 dark:aria-expanded:text-white dark:hover:text-lime-300 dark:text-white">
                        {t('landing.featuresCollapsibleTrigger')}
                        <IconChevronDown className="ml-auto size-4 group-data-panel-open/button:rotate-180" />
                      </Button>
                    )}
                    />
                    <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-2 text-lime-900 dark:text-white text-sm">
                      {t('landing.featuresCollapsibleDescription')}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    render={(
                      <Link href="/dashboard">
                        {t('landing.cta')}
                      </Link>
                    )}
                    nativeButton={false}
                  />
                  <Button
                    variant="secondary"
                    size="lg"
                    render={(
                      <Link href="/">
                        Pricing
                      </Link>
                    )}
                    nativeButton={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 bg-white dark:bg-neutral-900 px-4 py-10 lg:py-20">
            <div className="mx-auto max-w-md">
              <div className="space-y-6 lg:space-y-10">
                {[
                  {
                    icon: IconHeartbeat,
                    title: 'feature1Title',
                    description: 'feature1Description',
                  },
                  {
                    icon: IconDeviceDesktopAnalytics,
                    title: 'feature2Title',
                    description: 'feature2Description',
                  },
                  {
                    icon: IconShieldLock,
                    title: 'feature3Title',
                    description: 'feature3Description',
                  },
                ].map((feature, i) => (
                  <div className="flex gap-x-5 sm:gap-x-8" key={i}>
                    {/* Icon */}
                    <span className="inline-flex justify-center items-center bg-white dark:bg-neutral-800 shadow-2xs mx-auto border border-neutral-200 dark:border-neutral-700 rounded-full size-11 text-neutral-800 dark:text-white shrink-0">
                      {typeof feature.icon === 'string' ? feature.icon : <feature.icon className="size-5 text-lime-500" />}
                    </span>
                    <div className="grow">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-50 text-base sm:text-lg">
                        {t(`landing.${feature.title}`)}
                      </h3>
                      <p className="mt-1 text-neutral-600 dark:text-neutral-300 text-sm">
                        {t(`landing.${feature.description}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* Footer */}
      <LandingPageFooter />
    </div>
  )
}
