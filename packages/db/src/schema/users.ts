import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:            text('id').primaryKey(),
  email:         text('email').notNull().unique(),
  name:          text('name').notNull(),
  role:          text('role', { enum: ['student', 'teacher', 'admin'] }).notNull().default('student'),
  canvasUserId:  text('canvas_user_id'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token:     text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
