import { useTranslations } from 'next-intl'
import { Link as ScrollLink } from 'react-scroll'
import { Link } from '@/i18n/navigation'

/**
 * Links displayed in the footer
 */
const FOOTER_LINKS = [
  {
    title: 'landing.footer.section.mainLinks',
    items: [
      {
        label: 'landing.navigation.features',
        href: 'features',
      },
      {
        label: 'landing.navigation.api',
        href: 'api',
      },
      {
        label: 'landing.navigation.documentation',
        href: 'documentation',
      },
      {
        label: 'landing.navigation.testimonials',
        href: 'testimonials',
      },
      {
        label: 'landing.navigation.support',
        href: 'support',
      },
    ],
  },
  {
    title: 'landing.footer.section.socialMedia',
    items: [
      {
        label: 'Bluesky',
        href: 'https://bsky.app',
      },
      {
        label: 'GitHub',
        href: 'https://github.com',
      },
      {
        label: 'Discord',
        href: 'https://discord.com',
      },
    ],
  },
  {
    title: 'landing.footer.section.securityAndPrivacy',
    items: [
      {
        label: 'landing.navigation.privacyPolicy',
        href: '/privacy',
      },
      {
        label: 'landing.navigation.termsOfService',
        href: '/terms',
      },
      {
        label: 'landing.navigation.cookiePolicy',
        href: '/cookie',
      },
      {
        label: 'landing.navigation.disclaimer',
        href: '/disclaimer',
      },
    ],
  },
] as const

/**
 * Footer brand section with logo and description
 */
function FooterBrand() {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10" />
        <div className="font-medium text-heading">
          <div className="font-bold text-neutral-900 dark:text-neutral-50">{t('common.appName')}</div>
          <div className="font-normal text-body text-neutral-600 dark:text-neutral-400 text-xs">{t('common.tagline')}</div>
        </div>
      </div>
      <p className="mt-6 max-w-102.5 text-neutral-700 dark:text-neutral-300 text-sm">
        {' '}
        {t('common.footerDescription')}
      </p>
    </div>
  )
}

/**
 * Main links section using the same strategy as navbar
 */
function FooterLinks() {
  const t = useTranslations()
  return (
    <div className="flex flex-wrap justify-between gap-5 w-full md:w-[45%]">
      {FOOTER_LINKS.map((section, index) => (
        <div key={index}>
          <h3 className="mb-2 md:mb-5 font-semibold text-neutral-800 dark:text-neutral-100 text-xs uppercase">
            {t(section.title)}
          </h3>
          <ul className="space-y-1 text-sm">
            {section.title === 'landing.footer.section.mainLinks' && section.items.map((item, index) => (
              <li key={index}>
                <ScrollLink
                  to={item.href}
                  smooth={true}
                  offset={-50}
                  duration={500}
                  className="text-neutral-700 hover:text-sky-700 dark:hover:text-sky-300 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                  {t(item.label)}
                </ScrollLink>
              </li>
            ))}
            {section.title === 'landing.footer.section.socialMedia' && section.items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-neutral-500 hover:text-sky-700 dark:hover:text-sky-300 dark:text-neutral-300 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {section.title === 'landing.footer.section.securityAndPrivacy' && section.items.map((item, index) => (
              <li key={index}>
                <Link href={item.href as any} className="text-neutral-500 hover:text-sky-700 dark:hover:text-sky-300 dark:text-neutral-300 transition-colors">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function LandingPageFooter() {
  const t = useTranslations()

  return (
    <footer className="dark:bg-neutral-800 pt-20 pb-6 w-full text-neutral-800 dark:text-neutral-50">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex md:flex-row flex-col justify-between items-start gap-10 pb-10 border-neutral-500/30 border-b text-neutral-500">
          <FooterBrand />
          <FooterLinks />
        </div>
        <div>
          <p className="py-4 text-neutral-600 dark:text-neutral-400 text-xs text-center">
            &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            {t('common.appName')}
            .
            {' '}
            {t('common.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
