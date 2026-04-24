import { pgTable, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core'
import { users } from './users'
import { canvasCourses } from './canvas'
import { portfolioTemplates, templateMoments } from './templates'

// En students portfolio-instans
export const portfolios = pgTable('portfolios', {
  id:          text('id').primaryKey(),
  studentId:   text('student_id').notNull().references(() => users.id),
  courseId:    text('course_id').notNull().references(() => canvasCourses.id),
  templateId:  text('template_id').references(() => portfolioTemplates.id),
  title:       text('title').notNull(),
  visibility:  text('visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('private'),
  publishedAt: timestamp('published_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})

// Moment inom en portfolio
export const moments = pgTable('moments', {
  id:               text('id').primaryKey(),
  portfolioId:      text('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  templateMomentId: text('template_moment_id').references(() => templateMoments.id),
  position:         integer('position').notNull(),
  title:            text('title').notNull(),
  description:      text('description'),
  visibility:       text('visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('private'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
})

// Snapshot-version av ett moment (kunskapsuttryck vid ett tillfälle)
export const momentVersions = pgTable('moment_versions', {
  id:           text('id').primaryKey(),
  momentId:     text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),  // 1, 2, 3...
  studentNote:  text('student_note'),                  // "Vad jag ändrade och varför"
  isActive:     boolean('is_active').notNull().default(false),
  submittedAt:  timestamp('submitted_at'),             // null = utkast
  createdAt:    timestamp('created_at').defaultNow().notNull(),
})

// Koppling moment → Canvas lärandemål med evidensstyrka
export const momentOutcomeLinks = pgTable('moment_outcome_links', {
  id:              text('id').primaryKey(),
  momentId:        text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  canvasOutcomeId: text('canvas_outcome_id').notNull(),
  evidenceStrength: real('evidence_strength').notNull().default(0), // 0.0–1.0
  linkedBy:        text('linked_by', { enum: ['teacher', 'student'] }).notNull(),
  updatedAt:       timestamp('updated_at').defaultNow().notNull(),
})
