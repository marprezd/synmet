import { render, screen } from '@testing-library/react'
import Page from './page'

describe('home Page', () => {
  it('renders the landing page with hero section', () => {
    const { container } = render(<Page />)

    // Verifica que el componente se renderiza sin errores
    expect(container).toBeInTheDocument()

    // Verifica que contiene elementos básicos
    expect(screen.getByText(/landing.heroTitle/i)).toBeInTheDocument()
  })
})
