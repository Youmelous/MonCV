import { Request, Response } from 'express'
import db from '../db/connection'

export async function list(_req: Request, res: Response) {
  const templates = db.collection.findAll('templates')
  res.json(templates)
}
