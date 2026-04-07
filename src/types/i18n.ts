export type Locale = 'es' | 'en' | 'pt'
export const DEFAULT_LOCALE: Locale = 'en'

export interface TranslationKeys {
  common: {
    appName: string
    appDescription: string
    signIn: string
    signOut: string
    signUp: string
    dashboard: string
    documentation: string
    getStarted: string
    learnMore: string
    settings: string
    profile: string
    language: string
    theme: string
    about: string
    contact: string
    privacyPolicy: string
    termsOfService: string
  }
  auth: {
    loginTitle: string
    loginDescription: string
    registerTitle: string
    registerDescription: string
    email: string
    password: string
    confirmPassword: string
    rememberMe: string
    forgotPassword: string
    noAccount: string
    haveAccount: string
    continueWithGithub: string
    invalidCredentials: string
    emailInUse: string
  }
  dashboard: {
    title: string
    welcomeMessage: string
    todayStats: string
    totalCodingTime: string
    projects: string
    recentActivity: string
    averageDailyTime: string
    topLanguages: string
    currentStreak: string
    noData: string
  }
  landing: {
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    cta: string
    ctaSecondary: string
    featuresTitle: string
    featuresDescription: string
    feature1Title: string
    feature1Description: string
    feature2Title: string
    feature2Description: string
    feature3Title: string
    feature3Description: string
    pricingTitle: string
    pricingDescription: string
  }
}

export const localeConfig: Record<Locale, { name: string, flag: string }> = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  pt: { name: 'Português', flag: '🇵🇹' },
}
