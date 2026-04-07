'use client'

import type { Locale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IconFlagEs, IconFlagGb, IconFlagPt } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Mapping of supported languages with their display names and icon
 */
const LANGUAGE_MAP = {
  en: { name: 'English', icon: IconFlagGb },
  es: { name: 'Español', icon: IconFlagEs },
  pt: { name: 'Português', icon: IconFlagPt },
} as const

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

export default LanguageSelector
