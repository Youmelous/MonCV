import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CVPreview from '../components/CVPreview'
import type { CV, Template } from '../types'

const baseCV: CV = {
  id: '1',
  userId: null,
  templateId: 'classic-blue',
  title: 'Mon CV',
  personalInfo: {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
    phone: '0123456789',
    address: 'Paris',
    title: 'Développeur',
    photo: '',
  },
  profile: 'Développeur passionné avec 5 ans d\'expérience.',
  experience: [
    { id: 'e1', company: 'Tech Corp', position: 'Développeur', startDate: '2020', endDate: '2023', current: false, description: 'Développement web', tasks: ['React', 'Node.js'] },
  ],
  education: [
    { id: 'ed1', school: 'Université de Paris', degree: 'Master', field: 'Informatique', startDate: '2018', endDate: '2020' },
  ],
  skills: [
    { id: 's1', category: 'Langages', items: ['JavaScript', 'TypeScript'] },
  ],
  languages: [
    { id: 'l1', language: 'Anglais', level: 'Courant' },
  ],
  interests: ['Lecture', 'Voyages'],
  colors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

const template: Template = {
  id: 'classic-blue',
  name: 'Classic Blue',
  description: '',
  preview: '',
  category: 'classique',
  layout: 'single-column',
  fonts: { heading: 'Merriweather', body: 'Roboto' },
  defaultColors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' },
}

describe('CVPreview', () => {
  it('renders personal info', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
    expect(screen.getAllByText('Développeur').length).toBe(2)
    expect(screen.getByText('jean@example.com')).toBeInTheDocument()
    expect(screen.getByText('0123456789')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('renders profile section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText(/Développeur passionné/)).toBeInTheDocument()
  })

  it('renders experience section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('renders education section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('Master')).toBeInTheDocument()
    expect(screen.getByText(/Université de Paris/)).toBeInTheDocument()
  })

  it('renders skills section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('JavaScript, TypeScript')).toBeInTheDocument()
  })

  it('renders languages section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('Anglais')).toBeInTheDocument()
    expect(screen.getByText('Courant')).toBeInTheDocument()
  })

  it('renders interests section', () => {
    render(<CVPreview cv={baseCV} template={template} />)
    expect(screen.getByText('Lecture')).toBeInTheDocument()
    expect(screen.getByText('Voyages')).toBeInTheDocument()
  })

  it('renders photo when present', () => {
    const cvWithPhoto = { ...baseCV, personalInfo: { ...baseCV.personalInfo, photo: 'data:image/png;base64,abc' } }
    const { container } = render(<CVPreview cv={cvWithPhoto} template={template} />)
    const img = container.querySelector('img[alt="photo"]')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
  })

  it('does not render photo when not present', () => {
    const { container } = render(<CVPreview cv={baseCV} template={template} />)
    expect(container.querySelector('img[alt="photo"]')).not.toBeInTheDocument()
  })

  it('renders two-column layout for two-column templates', () => {
    const twoColTemplate = { ...template, layout: 'two-column' }
    render(<CVPreview cv={baseCV} template={twoColTemplate} />)
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
  })

  it('displays empty state when no CV data', () => {
    const emptyCV = { ...baseCV, profile: '' }
    render(<CVPreview cv={emptyCV} template={template} />)
    expect(screen.queryByText(/Développeur passionné/)).not.toBeInTheDocument()
  })
})
