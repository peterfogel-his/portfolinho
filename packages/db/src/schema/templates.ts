import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'
import { users } from './users'
import { canvasCourses } from './canvas'

// Lärarens portfolio-mall för en kurs
export const portfolioTemplates = pgTable('portfolio_templates', {
  id:          text('id').primaryKey(),
  courseId:    text('course_id').notNull().references(() => canvasCourses.id),
  createdBy:   text('created_by').notNull().references(() => users.id),
  title:       text('title').notNull(),
  description: text('description'),
  // Publiceringsgrindar: när studenten får börja publicera
  formativeGate: text('formative_gate', {
    enum: ['locked', 'open'],
  }).notNull().default('locked'),
  summativeGate: text('summative_gate', {
    enum: ['locked', 'on_submit', 'on_approval', 'open'],
  }).notNull().default('on_submit'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})

// Förväntade moment i en mall
export const templateMoments = pgTable('template_moments', {
  id:          text('id').primaryKey(),
  templateId:  text('template_id').notNull().references(() => portfolioTemplates.id, { onDelete: 'cascade' }),
  position:    integer('position').notNull(),
  title:       text('title').notNull(),
  description: text('description'),
  // Vilka artefaktroller är aktiva i detta moment
  allowStudentReflection: boolean('allow_student_reflection').notNull().default(true),
  allowPeerComment:       boolean('allow_peer_comment').notNull().default(false),
  allowStudentArtifacts:  boolean('allow_student_artifacts').notNull().default(true),
  // Vad studenten maximalt får publicera (läraren sätter tak)
  maxStudentVisibility: text('max_student_visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('public'),
  teacherFeedbackPublishable: boolean('teacher_feedback_publishable').notNull().default(false),
  peerCommentsPublishable:    boolean('peer_comments_publishable').notNull().default(false),
  // Koppling till Canvas lärandemål (lista av outcome-IDs)
  canvasOutcomeIds: jsonb('canvas_outcome_ids').$type<string[]>().default([]),
  canvasRubricId:   text('canvas_rubric_id'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})
