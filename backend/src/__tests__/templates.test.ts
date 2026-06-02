import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server'
import { resetMockDb, seedMockDb } from './setup'

const sampleTemplates = {
  'classic-blue': { id: 'classic-blue', name: 'Classic Blue', category: 'classique', layout: 'single-column', fonts: { heading: 'Merriweather', body: 'Roboto' }, defaultColors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' } },
  'modern-teal': { id: 'modern-teal', name: 'Modern Teal', category: 'moderne', layout: 'two-column', fonts: { heading: 'Poppins', body: 'Open Sans' }, defaultColors: { primary: '#0d9488', secondary: '#14b8a6', accent: '#ccfbf1' } },
  'minimal-slate': { id: 'minimal-slate', name: 'Minimal Slate', category: 'minimaliste', layout: 'single-column', fonts: { heading: 'Inter', body: 'Inter' }, defaultColors: { primary: '#334155', secondary: '#64748b', accent: '#f1f5f9' } },
}

describe('GET /api/templates', () => {
  beforeEach(() => {
    resetMockDb()
    seedMockDb('templates', sampleTemplates)
  })

  it('returns all templates', async () => {
    const res = await request(app).get('/api/templates')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
  })

  it('returns templates with correct structure', async () => {
    const res = await request(app).get('/api/templates')
    const tmpl = res.body[0]
    expect(tmpl).toHaveProperty('id')
    expect(tmpl).toHaveProperty('name')
    expect(tmpl).toHaveProperty('category')
    expect(tmpl).toHaveProperty('layout')
    expect(tmpl).toHaveProperty('fonts')
    expect(tmpl).toHaveProperty('defaultColors')
    expect(tmpl.fonts).toHaveProperty('heading')
    expect(tmpl.fonts).toHaveProperty('body')
    expect(tmpl.defaultColors).toHaveProperty('primary')
    expect(tmpl.defaultColors).toHaveProperty('secondary')
    expect(tmpl.defaultColors).toHaveProperty('accent')
  })
})
