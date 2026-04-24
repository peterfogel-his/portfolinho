import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema/index'

export { schema }
export * from './schema/index'

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL ??
        'postgresql://portfolinho:portfolinho@localhost:5432/portfolinho',
    })
    _db = drizzle(pool, { schema })
  }
  return _db
}

export type Db = ReturnType<typeof getDb>
