import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(__dirname, '..', '..', 'data')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export class JsonDB {
  private filePath: string
  private data: Record<string, any> = {}

  constructor(filename: string) {
    this.filePath = path.join(DATA_DIR, filename)
    this.load()
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8')
        this.data = JSON.parse(raw)
      } else {
        this.data = {}
        this.save()
      }
    } catch {
      this.data = {}
      this.save()
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8')
  }

  get collection() {
    return new Collection(this.data, this)
  }
}

class Collection {
  private data: Record<string, any>
  private db: JsonDB

  constructor(data: Record<string, any>, db: JsonDB) {
    this.data = data
    this.db = db
  }

  findAll(table: string): any[] {
    if (!this.data[table]) return []
    return Object.values(this.data[table])
  }

  findById(table: string, id: string): any | null {
    if (!this.data[table]) return null
    return this.data[table][id] || null
  }

  findWhere(table: string, predicate: (item: any) => boolean): any[] {
    if (!this.data[table]) return []
    return Object.values(this.data[table]).filter(predicate)
  }

  findOneWhere(table: string, predicate: (item: any) => boolean): any | null {
    if (!this.data[table]) return null
    const items = Object.values(this.data[table]).filter(predicate)
    return items.length > 0 ? items[0] : null
  }

  insert(table: string, id: string, item: any): any {
    if (!this.data[table]) this.data[table] = {}
    this.data[table][id] = { ...item, id }
    this.db.save()
    return this.data[table][id]
  }

  update(table: string, id: string, updates: Record<string, any>): any | null {
    if (!this.data[table] || !this.data[table][id]) return null
    this.data[table][id] = { ...this.data[table][id], ...updates }
    this.db.save()
    return this.data[table][id]
  }

  deleteById(table: string, id: string): boolean {
    if (!this.data[table] || !this.data[table][id]) return false
    delete this.data[table][id]
    this.db.save()
    return true
  }
}

const db = new JsonDB('moncv.json')
export default db
