/* eslint-disable no-undef */
import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => key => key,
}))

// Mock react-scroll
jest.mock('react-scroll', () => ({
  Element: ({ children }) => children,
}))

// Mock cloudflare image
jest.mock('@/components/cloud-image', () => {
  return function MockCloudImage() {
    return <div>Mock CloudImage</div>
  }
})

// Mock landing page components
jest.mock('@/components/landing-page-footer', () => {
  return function MockLandingPageFooter() {
    return <div>Mock Footer</div>
  }
})

jest.mock('@/components/landing-page-navbar', () => {
  return function MockLandingPageNavbar() {
    return <div>Mock Navbar</div>
  }
})

// Mock navigation
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }) => <a href={href}>{children}</a>,
}))
