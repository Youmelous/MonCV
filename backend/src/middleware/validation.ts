import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: 'Validation échouée', details: e.errors })
      }
      next(e)
    }
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
}
