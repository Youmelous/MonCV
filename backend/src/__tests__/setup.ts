import { vi } from 'vitest'

const mockData: Record<string, Record<string, any>> = {}

export function resetMockDb() {
  Object.keys(mockData).forEach(k => delete mockData[k])
}

export function seedMockDb(table: string, records: Record<string, any>) {
  mockData[table] = { ...(mockData[table] || {}), ...records }
}

const mockCollection = {
  findAll: (table: string) => Object.values(mockData[table] || {}),
  findById: (table: string, id: string) => mockData[table]?.[id] || null,
  findWhere: (table: string, predicate: (item: any) => boolean) =>
    Object.values(mockData[table] || {}).filter(predicate),
  findOneWhere: (table: string, predicate: (item: any) => boolean) =>
    Object.values(mockData[table] || {}).find(predicate) || null,
  insert: (table: string, id: string, item: any) => {
    if (!mockData[table]) mockData[table] = {}
    mockData[table][id] = { ...item, id }
    return mockData[table][id]
  },
  update: (table: string, id: string, updates: any) => {
    if (!mockData[table]?.[id]) return null
    mockData[table][id] = { ...mockData[table][id], ...updates }
    return mockData[table][id]
  },
  deleteById: (table: string, id: string) => {
    if (!mockData[table]?.[id]) return false
    delete mockData[table][id]
    return true
  },
}

vi.mock('../db/connection', () => ({
  __esModule: true,
  default: { collection: mockCollection },
}))
