'use client'

import type { Locale } from 'next-intl'
import { Menu, UserIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { IconFlagEs, IconFlagGb, IconFlagPt } from '@/components/icons'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@/i18n/navigation'

/**
 * Mapping of supported languages with their display names and icon
 */
const LANGUAGE_MAP = {
  en: { name: 'English', icon: IconFlagGb },
  es: { name: 'Español', icon: IconFlagEs },
  pt: { name: 'Português', icon: IconFlagPt },
} as const

/**
 * Navigation links displayed in the navbar
 */
const NAV_LINKS = [
  { href: 'features', label: 'landing.navigation.features' },
  { href: 'api', label: 'landing.navigation.api' },
  { href: 'documentation', label: 'landing.navigation.documentation' },
  { href: 'testimonials', label: 'landing.navigation.testimonials' },
  { href: 'support', label: 'landing.navigation.support' },
] as const

/**
 * Brand/Logo section of the navbar
 */
function NavbarBrand() {
  const t = useTranslations()

  return (
    <div className="flex-none sm:order-1 focus:opacity-80 focus:outline-hidden font-semibold dark:text-white text-xl">
      <div className="flex items-center gap-2">
        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg w-8 h-8" />
        <span className="hidden md:block font-bold text-lg">{t('common.appName')}</span>
      </div>
    </div>
  )
}

/**
 * Language selector dropdown component
 * Allows users to switch between available languages
 */
function LanguageSelector() {
  const locale = useParams().locale as Locale
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()

  // Function to navigate to the selected language version of the current page
  const handleLanguageChange = (newLocale: string) => {
    // Replace the current locale in the pathname with the new one
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={(
        <Button variant="outline" size="icon" className="text-xs">
          {locale.toUpperCase()}
        </Button>
      )}
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('common.changeLanguage')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(LANGUAGE_MAP).map(([code, { name, icon: Icon }]) => (
            <DropdownMenuCheckboxItem
              key={code}
              checked={code === locale}
              onClick={() => handleLanguageChange(code)}
            >
              <Icon />
              {name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * User menu dropdown component
 * Contains user authentication options
 */
function UserMenu() {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={(
        <Button variant="outline" size="icon">
          <UserIcon className="size-4" />
        </Button>
      )}
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('common.userMenu.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={(
            <Link href="/auth/signin">
              {t('common.signIn')}
            </Link>
          )}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Desktop navigation links component
 * Displayed only on small screens and above
 */
function DesktopNavLinks() {
  const t = useTranslations()
  const navLinkClass = 'focus:outline-hidden cursor-pointer uppercase text-xs font-medium text-neutral-600 hover:text-sky-400 focus:text-neutral-400 dark:hover:text-sky-300 dark:focus:text-sky-300 dark:text-neutral-400 transition-colors'
  const activeNavLinkClass = 'text-primary dark:text-primary font-semibold underline underline-offset-4 decoration-2'

  return (
    <div className="hidden sm:block sm:order-2 basis-full sm:grow-0 sm:basis-auto">
      <div className="flex sm:flex-row flex-col sm:items-center gap-5 sm:ps-5">
        {NAV_LINKS.map(link => (
          <ScrollLink
            key={link.href}
            activeClass={activeNavLinkClass}
            className={navLinkClass}
            to={link.href}
            smooth={true}
            spy={true}
            offset={-50}
            duration={500}
          >
            {t(link.label)}
          </ScrollLink>
        ))}
      </div>
    </div>
  )
}

/**
 * Mobile navigation menu component
 * Handles responsive navigation for mobile devices with state management
 */
function MobileNavMenu() {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when clicking outside or on a link
  const handleNavClick = () => {
    setIsOpen(false)
  }

  const navLinkClass = 'block w-full text-left px-4 py-2 font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400 transition-colors rounded'
  const activeNavLinkClass = 'text-primary dark:text-primary font-semibold bg-neutral-50 dark:bg-neutral-900'

  return (
    <>
      {/* Mobile menu toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden"
        variant="outline"
        size="icon"
        aria-label="Toggle navigation menu"
      >
        {isOpen
          ? (
              <X className="size-4" />
            )
          : (
              <Menu className="size-4" />
            )}
      </Button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="sm:hidden top-full right-0 left-0 absolute bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 border-b">
          <div className="space-y-1 mx-auto px-4 py-3 max-w-7xl">
            {NAV_LINKS.map(link => (
              <ScrollLink
                key={link.href}
                activeClass={activeNavLinkClass}
                className={navLinkClass}
                to={link.href}
                smooth={true}
                spy={true}
                offset={-50}
                duration={500}
                onClick={handleNavClick}
              >
                {t(link.label)}
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Right side controls section (theme toggle, language selector, user menu)
 */
function NavbarControls() {
  return (
    <div className="flex items-center gap-x-2 sm:order-3">
      <ModeToggle />
      <LanguageSelector />
      <UserMenu />
      <MobileNavMenu />
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * LandingPageNavbar Component
 *
 * A responsive navigation bar with support for:
 * - Multi-language switching
 * - Dark/light mode toggle
 * - Mobile responsive menu
 * - User authentication links
 */
export default function LandingPageNavbar() {
  return (
    <header className="top-0 z-50 fixed inset-s-0 flex flex-wrap sm:flex-nowrap sm:justify-start bg-white/80 dark:bg-black/80 backdrop-blur py-3 border-neutral-200 dark:border-neutral-800 border-b w-full text-sm">
      <nav className="flex flex-wrap justify-between items-center mx-auto px-4 w-full max-w-7xl basis-full">
        <NavbarBrand />
        <DesktopNavLinks />
        <NavbarControls />
      </nav>
    </header>
  )
}
