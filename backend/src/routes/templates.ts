import { Router } from 'express'
import { list } from '../controllers/templates'

const router = Router()

router.get('/', list)

export default router
