import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import db from '../db/connection'
import { signToken } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum'),
  name: z.string().min(1, 'Nom requis'),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function register(req: Request, res: Response) {
  const { email, password, name } = registerSchema.parse(req.body)

  const existing = db.collection.findOneWhere('users', (u: any) => u.email === email)
  if (existing) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' })
  }

  const id = uuid()
  const hashed = await bcrypt.hash(password, 10)

  db.collection.insert('users', id, { email, password: hashed, name, createdAt: new Date().toISOString() })

  const token = signToken(id)
  res.status(201).json({ token, user: { id, email, name } })
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)

  const user = db.collection.findOneWhere('users', (u: any) => u.email === email)
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const token = signToken(user.id)
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
}

export async function me(req: AuthRequest, res: Response) {
  const user = db.collection.findById('users', req.userId!)
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
  res.json({ id: user.id, email: user.email, name: user.name })
}
