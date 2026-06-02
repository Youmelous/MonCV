import { Router } from 'express'
import suggestions from '../data/suggestions.json'

const router = Router()

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

router.get('/', (req, res) => {
  const { job, section, lang } = req.query as { job?: string; section?: string; lang?: string }
  let results = suggestions

  if (section) {
    results = results.filter((s: any) => s.section === section)
  }
  if (lang) {
    results = results.filter((s: any) => (s.lang || 'fr') === lang)
  } else {
    results = results.filter((s: any) => (s.lang || 'fr') === 'fr')
  }
  if (job) {
    const q = normalize(job)
    results = results.filter(
      (s: any) =>
        normalize(s.job || '').includes(q) ||
        normalize(s.jobCategory || '').includes(q)
    )
  }

  res.json(results.slice(0, 100))
})

export default router
