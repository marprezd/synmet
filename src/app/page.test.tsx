// Mock next/navigation
import { redirect } from 'next/navigation'

import RootPage from './page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('root Page', () => {
  it('redirects from / to /en', () => {
    RootPage()
    expect(redirect).toHaveBeenCalledWith('/en')
  })
})
