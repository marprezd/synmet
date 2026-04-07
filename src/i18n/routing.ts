import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es', 'pt'],

  // Used when no locale matches
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/dashboard': {
      en: '/dashboard',
      es: '/panel',
      pt: '/painel',
    },
    '/settings': {
      en: '/settings',
      es: '/configuracion',
      pt: '/configuracoes',
    },
    '/settings/api-keys': {
      en: '/settings/api-keys',
      es: '/configuracion/api-keys',
      pt: '/configuracoes/api-keys',
    },
    '/projects': {
      en: '/projects',
      es: '/proyectos',
      pt: '/projetos',
    },
    '/settings/profile': {
      en: '/settings/profile',
      es: '/configuracion/perfil',
      pt: '/configuracoes/perfil',
    },
    '/settings/account': {
      en: '/settings/account',
      es: '/configuracion/cuenta',
      pt: '/configuracoes/conta',
    },
    '/auth/signin': {
      en: '/auth/signin',
      es: '/auth/iniciar-sesion',
      pt: '/auth/entrar',
    },
    '/privacy': {
      en: '/privacy',
      es: '/privacidad',
      pt: '/privacidade',
    },
    '/terms': {
      en: '/terms',
      es: '/terminos',
      pt: '/termos',
    },
    '/cookie': {
      en: '/cookie',
      es: '/cookies',
      pt: '/cookies',
    },
    '/disclaimer': {
      en: '/disclaimer',
      es: '/descargo',
      pt: '/isencao',
    },
    '[...rest]': '[...rest]',
  },
})
