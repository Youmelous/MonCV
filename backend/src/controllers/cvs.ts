import { Response } from 'express'
import { v4 as uuid } from 'uuid'
import { z, ZodError } from 'zod'
import db from '../db/connection'
import type { AuthRequest } from '../middleware/auth'

const templateIds = [
  'classic-blue', 'modern-teal', 'creative-coral', 'minimal-slate',
  'elegant-navy', 'fresh-green', 'bold-purple', 'clean-ivory',
  'professional-indigo', 'vibrant-amber', 'side-bar-sapphire', 'timeless-charcoal',
  'europass-inspired', 'ats-friendly', 'creative-artist', 'fonctionnel',
  'scientifique', 'informatique', 'commercial', 'medical',
  'innovant', 'traditionnel', 'express', 'master-degree',
  'stage', 'detail', 'graphique', 'photo-ready',
  'magasinier', 'femme',
]

const defaultPersonalInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', title: '', photo: '',
}

const defaultColors = { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' }

export async function create(req: AuthRequest, res: Response) {
  let templateId: string, title: string
  try {
    const parsed = z.object({
      templateId: z.enum(templateIds as [string, ...string[]]),
      title: z.string().default('Mon CV'),
    }).parse(req.body)
    templateId = parsed.templateId
    title = parsed.title
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({ error: 'Validation échouée', details: e.errors })
    }
    throw e
  }

  const template = db.collection.findById('templates', templateId)
  if (!template) return res.status(404).json({ error: 'Template introuvable' })

  const id = uuid()
  const now = new Date().toISOString()

  db.collection.insert('cvs', id, {
    userId: req.userId || null,
    templateId,
    title,
    personalInfo: defaultPersonalInfo,
    profile: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
    colors: template.defaultColors || defaultColors,
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(formatCVCreation(db.collection.findById('cvs', id)))
}

export async function getUserCVs(req: AuthRequest, res: Response) {
  const cvs = req.userId
    ? db.collection.findWhere('cvs', (c: any) => c.userId === req.userId)
    : db.collection.findWhere('cvs', (c: any) => !c.userId)
  res.json(cvs.map(formatCVCreation).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
}

export async function getOne(req: AuthRequest, res: Response) {
  const cv = db.collection.findById('cvs', req.params.id)
  if (!cv) return res.status(404).json({ error: 'CV introuvable' })
  if (cv.userId && cv.userId !== req.userId) {
    return res.status(403).json({ error: 'Accès interdit' })
  }
  res.json(formatCV(cv))
}

export async function update(req: AuthRequest, res: Response) {
  const cv = db.collection.findById('cvs', req.params.id)
  if (!cv) return res.status(404).json({ error: 'CV introuvable' })
  if (cv.userId && cv.userId !== req.userId) {
    return res.status(403).json({ error: 'Accès interdit' })
  }

  const allowed = ['title', 'personalInfo', 'profile', 'experience', 'education', 'skills', 'languages', 'interests', 'colors']
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() }

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  db.collection.update('cvs', req.params.id, updates)
  res.json(formatCVCreation(db.collection.findById('cvs', req.params.id)))
}

export async function remove(req: AuthRequest, res: Response) {
  const cv = db.collection.findById('cvs', req.params.id)
  if (!cv) return res.status(404).json({ error: 'CV introuvable' })
  if (cv.userId && cv.userId !== req.userId) {
    return res.status(403).json({ error: 'Accès interdit' })
  }
  db.collection.deleteById('cvs', req.params.id)
  res.status(204).send()
}

export async function duplicate(req: AuthRequest, res: Response) {
  const original = db.collection.findById('cvs', req.params.id)
  if (!original) return res.status(404).json({ error: 'CV introuvable' })
  if (original.userId && original.userId !== req.userId) {
    return res.status(403).json({ error: 'Accès interdit' })
  }

  const id = uuid()
  const now = new Date().toISOString()

  db.collection.insert('cvs', id, {
    ...original,
    id,
    title: `${original.title} (copie)`,
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(formatCVCreation(db.collection.findById('cvs', id)))
}

function formatCV(row: any) {
  return {
    id: row.id,
    userId: row.userId,
    templateId: row.templateId,
    title: row.title,
    personalInfo: row.personalInfo,
    profile: row.profile,
    experience: row.experience,
    education: row.education,
    skills: row.skills,
    languages: row.languages,
    interests: row.interests,
    colors: row.colors,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function formatCVCreation(row: any) {
  return {
    id: row.id,
    userId: row.userId,
    templateId: row.templateId,
    title: row.title,
    personalInfo: row.personalInfo,
    profile: row.profile,
    experience: row.experience,
    education: row.education,
    skills: row.skills,
    languages: row.languages,
    interests: row.interests,
    colors: row.colors,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
