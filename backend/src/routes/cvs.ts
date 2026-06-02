import { Router } from 'express'
import { getUserCVs, create, getOne, update, remove, duplicate } from '../controllers/cvs'
import { optionalAuth } from '../middleware/auth'

const router = Router()

router.get('/', optionalAuth, getUserCVs)
router.post('/', optionalAuth, create)
router.get('/:id', optionalAuth, getOne)
router.put('/:id', optionalAuth, update)
router.delete('/:id', optionalAuth, remove)
router.post('/:id/duplicate', optionalAuth, duplicate)

export default router
