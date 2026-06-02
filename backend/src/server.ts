import express from 'express'
import path from 'path'
import cors from 'cors'
import authRoutes from './routes/auth'
import cvRoutes from './routes/cvs'
import templateRoutes from './routes/templates'
import suggestionRoutes from './routes/suggestions'
import { errorHandler } from './middleware/validation'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/cvs', cvRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/suggestions', suggestionRoutes)

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend MonCV démarré sur http://localhost:${PORT}`)
  })
}

export default app
