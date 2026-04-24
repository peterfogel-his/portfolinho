import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

// Canvas-kurs cachad lokalt vid LTI-launch
export const canvasCourses = pgTable('canvas_courses', {
  id:             text('id').primaryKey(),          // Canvas course_id
  title:          text('title').notNull(),
  canvasBaseUrl:  text('canvas_base_url').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
})

// Lärandemål hämtade från Canvas Outcomes API
export const canvasOutcomes = pgTable('canvas_outcomes', {
  id:          text('id').primaryKey(),             // Canvas outcome_id
  courseId:    text('course_id').notNull().references(() => canvasCourses.id),
  title:       text('title').notNull(),
  description: text('description'),
  masteryPoints: integer('mastery_points'),
  ratings:     jsonb('ratings'),                    // [{ points, description }]
  syncedAt:    timestamp('synced_at').defaultNow().notNull(),
})

// Rubrikkriterieer hämtade från Canvas Rubrics API
export const canvasRubricCriteria = pgTable('canvas_rubric_criteria', {
  id:          text('id').primaryKey(),             // Canvas criterion_id
  courseId:    text('course_id').notNull().references(() => canvasCourses.id),
  rubricId:    text('rubric_id').notNull(),          // Canvas rubric_id
  rubricTitle: text('rubric_title').notNull(),
  title:       text('title').notNull(),
  description: text('description'),
  points:      integer('points'),
  ratings:     jsonb('ratings'),                    // [{ points, label, description }]
  syncedAt:    timestamp('synced_at').defaultNow().notNull(),
})
