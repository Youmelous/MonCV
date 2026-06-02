import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'

const mockLogin = vi.fn()
const mockRegister = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin, register: mockRegister, user: null, loading: false }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual as any, useNavigate: () => vi.fn() }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.getByText('Se connecter')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
  })

  it('toggles to register form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Inscrivez-vous'))
    expect(screen.getByText('Créer un compte')).toBeInTheDocument()
    expect(screen.getByText('Créer mon compte')).toBeInTheDocument()
    expect(screen.getByLabelText('Nom')).toBeInTheDocument()
  })

  it('toggles back to login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Inscrivez-vous'))
    fireEvent.click(screen.getByText('Connectez-vous'))
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nom')).not.toBeInTheDocument()
  })

  it('calls login on submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password' } })
    fireEvent.click(screen.getByText('Se connecter'))
    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password')
  })

  it('calls register on submit', async () => {
    mockRegister.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Inscrivez-vous'))
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password' } })
    fireEvent.click(screen.getByText('Créer mon compte'))
    expect(mockRegister).toHaveBeenCalledWith('test@test.com', 'password', 'Test User')
  })
})
