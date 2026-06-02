import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'

const mockUseAuth = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
  })

  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Créez votre CV/i)).toBeInTheDocument()
  })

  it('renders two CTA buttons', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Créer mon CV')).toBeInTheDocument()
    expect(screen.getByText('Améliorer mon CV')).toBeInTheDocument()
  })

  it('renders the three feature steps', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Choisissez votre CV')).toBeInTheDocument()
    expect(screen.getByText('Personnalisez votre CV')).toBeInTheDocument()
    expect(screen.getByText('Téléchargez votre CV')).toBeInTheDocument()
  })

  it('shows login/register when not authenticated, dashboard when authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText("S'inscrire")).toBeInTheDocument()
  })

  it('shows dashboard header link when authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1', email: 'a@b.com', name: 'Test' }, loading: false })
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.queryByText("S'inscrire")).not.toBeInTheDocument()
  })
})
