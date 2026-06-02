import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server'
import { resetMockDb } from './setup'

describe('POST /api/auth/register', () => {
  beforeEach(() => resetMockDb())

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toMatchObject({ email: 'test@example.com', name: 'Test User' })
    expect(res.body.user).toHaveProperty('id')
  })

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'password123', name: 'User' })
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'password123', name: 'User2' })
    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Cet email est déjà utilisé')
  })

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password123', name: 'User' })
    expect(res.status).toBe(400)
  })

  it('rejects short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '12345', name: 'User' })
    expect(res.status).toBe(400)
  })

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: '' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(() => resetMockDb())

  it('logs in with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'password123', name: 'Login User' })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe('login@example.com')
  })

  it('rejects wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'wrong@example.com', password: 'password123', name: 'User' })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })

  it('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  beforeEach(() => resetMockDb())

  it('returns user info with valid token', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'me@example.com', password: 'password123', name: 'Me User' })
    const token = reg.body.token
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('me@example.com')
    expect(res.body.name).toBe('Me User')
  })

  it('rejects missing token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken')
    expect(res.status).toBe(401)
  })
})
