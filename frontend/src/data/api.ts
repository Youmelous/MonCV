import axios from 'axios'
import type { CV, Template, Suggestion, User } from '../types'

const baseURL = import.meta.env.BASE_URL === '/' ? '/api' : `${import.meta.env.BASE_URL}api`
const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function register(email: string, password: string, name: string) {
  const { data } = await api.post('/auth/register', { email, password, name })
  localStorage.setItem('token', data.token)
  return data.user as User
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  return data.user as User
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data as User
}

export function logout() {
  localStorage.removeItem('token')
}

export async function getTemplates() {
  const { data } = await api.get('/templates')
  return data as Template[]
}

export async function createCV(templateId: string, title?: string) {
  const { data } = await api.post('/cvs', { templateId, title })
  return data as CV
}

export async function getUserCVs() {
  const { data } = await api.get('/cvs')
  return data as CV[]
}

export async function getCV(id: string) {
  const { data } = await api.get(`/cvs/${id}`)
  return data as CV
}

export async function updateCV(id: string, updates: Partial<CV>) {
  const { data } = await api.put(`/cvs/${id}`, updates)
  return data as CV
}

export async function deleteCV(id: string) {
  await api.delete(`/cvs/${id}`)
}

export async function duplicateCV(id: string) {
  const { data } = await api.post(`/cvs/${id}/duplicate`)
  return data as CV
}

export async function getSuggestions(job?: string, section?: string, lang?: string) {
  const params = new URLSearchParams()
  if (job) params.set('job', job)
  if (section) params.set('section', section)
  if (lang) params.set('lang', lang)
  const { data } = await api.get(`/suggestions?${params}`)
  return data as Suggestion[]
}
