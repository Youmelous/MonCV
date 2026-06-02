import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

vi.mock('../data/suggestions.json', () => ({
  default: [
    { section: 'experience', job: 'Développeur', jobCategory: 'Informatique', text: 'Développé des applications web', lang: 'fr' },
    { section: 'experience', job: 'Developpeur', jobCategory: 'Informatique', text: 'Développé des APIs REST', lang: 'fr' },
    { section: 'experience', job: 'Developer', jobCategory: 'IT', text: 'Built web applications', lang: 'en' },
    { section: 'profile', job: 'Développeur', jobCategory: 'Informatique', text: 'Profil développeur passionné', lang: 'fr' },
    { section: 'education', job: '', jobCategory: '', text: 'Master en informatique', lang: 'fr' },
    { section: 'skills', job: '', jobCategory: '', text: 'JavaScript', lang: 'fr' },
    { section: 'skills', job: '', jobCategory: '', text: 'TypeScript', lang: 'en' },
    { section: 'languages', job: '', jobCategory: '', text: 'Anglais courant', lang: 'fr' },
    { section: 'interests', job: '', jobCategory: '', text: 'Lecture', lang: 'fr' },
    { section: 'softskills', job: '', jobCategory: '', text: 'Travail en équipe', lang: 'fr' },
  ],
}))

import app from '../server'

describe('GET /api/suggestions', () => {
  it('returns French suggestions by default', async () => {
    const res = await request(app).get('/api/suggestions')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    res.body.forEach((s: any) => {
      expect(s.lang || 'fr').toBe('fr')
    })
  })

  it('filters by section=experience', async () => {
    const res = await request(app).get('/api/suggestions?section=experience')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    res.body.forEach((s: any) => expect(s.section).toBe('experience'))
  })

  it('filters by lang=en', async () => {
    const res = await request(app).get('/api/suggestions?lang=en')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    res.body.forEach((s: any) => expect(s.lang).toBe('en'))
  })

  it('filters by job with accent-insensitive search (développeur)', async () => {
    const res = await request(app).get('/api/suggestions?job=developpeur&lang=fr')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('filters by job with accent (développeur with accents)', async () => {
    const res = await request(app).get('/api/suggestions?job=développeur&lang=fr')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('matches jobCategory as well', async () => {
    const res = await request(app).get('/api/suggestions?job=informatique&lang=fr')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('returns empty array when no match', async () => {
    const res = await request(app).get('/api/suggestions?job=zzzzzzzz&lang=fr')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(0)
  })

  it('combines section + job + lang filters', async () => {
    const res = await request(app).get('/api/suggestions?section=experience&job=developpeur&lang=fr')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    res.body.forEach((s: any) => {
      expect(s.section).toBe('experience')
      expect(s.lang || 'fr').toBe('fr')
    })
  })

  it('caps at 100 results', async () => {
    const res = await request(app).get('/api/suggestions')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeLessThanOrEqual(100)
  })
})
