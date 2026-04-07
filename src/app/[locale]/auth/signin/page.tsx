'use client'

import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const t = useTranslations()
  const locale = useLocale()

  const handleGitHubSignIn = async () => {
    await signIn('github', {
      callbackUrl: `/${locale}/dashboard`,
    })
  }

  return (
    <div className="flex justify-center items-center bg-linear-to-br from-zinc-50 dark:from-black to-zinc-100 dark:to-zinc-950 px-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg w-10 h-10" />
            <span className="ml-2 font-bold text-lg">{t('common.appName')}</span>
          </div>

          <h1 className="mb-2 font-bold text-2xl text-center">
            {t('auth.loginTitle')}
          </h1>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400 text-center">
            {t('auth.loginDescription')}
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleGitHubSignIn}
              variant="outline"
              className="w-full"
            >
              {t('auth.continueWithGithub')}
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-zinc-200 dark:border-zinc-800 border-t w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder={t('auth.email')}
              disabled
              className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg w-full text-zinc-500 cursor-not-allowed"
            />
            <input
              type="password"
              placeholder={t('auth.password')}
              disabled
              className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg w-full text-zinc-500 cursor-not-allowed"
            />
            <p className="text-zinc-500 text-xs text-center">
              Email/password coming soon. Use GitHub for now.
            </p>
          </div>

          <div className="mt-6 text-sm text-center">
            <span className="text-zinc-600 dark:text-zinc-400">
              {t('auth.noAccount')}
              {' '}
              <Link href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                {t('common.signUp')}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
