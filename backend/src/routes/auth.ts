import { Router } from 'express'
import { register, login, me } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { z } from 'zod'

const router = Router()

router.post('/register', validate(z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})), register)

router.post('/login', validate(z.object({
  email: z.string().email(),
  password: z.string(),
})), login)

router.get('/me', authMiddleware, me)

export default router
