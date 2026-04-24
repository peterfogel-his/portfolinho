import { pgTable, text, timestamp, integer, boolean, real } from 'drizzle-orm/pg-core'
import { users } from './users'
import { moments, momentVersions } from './portfolios'

// Bedömning av ett moment — tre oberoende lager
export const assessments = pgTable('assessments', {
  id:              text('id').primaryKey(),
  momentId:        text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  momentVersionId: text('moment_version_id').references(() => momentVersions.id),
  assessorId:      text('assessor_id').notNull().references(() => users.id),
  layer:           text('layer', {
    enum: ['self', 'peer', 'teacher'],
  }).notNull(),
  isFinal:         boolean('is_final').notNull().default(false),   // true = lärarens slutmarkering
  submittedAt:     timestamp('submitted_at'),
  createdAt:       timestamp('created_at').defaultNow().notNull(),
  updatedAt:       timestamp('updated_at').defaultNow().notNull(),
})

// Poäng per kriterium inom en bedömning
export const assessmentCriterionScores = pgTable('assessment_criterion_scores', {
  id:             text('id').primaryKey(),
  assessmentId:   text('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  criterionId:    text('criterion_id').notNull(),   // Canvas rubric criterion_id
  score:          integer('score').notNull(),        // 0–max_points
  comment:        text('comment'),
})

// Evidensstyrka per lärandemål efter lärarens slutmarkering
// Aggregeras till portfolions evidensmatris
export const outcomeEvidence = pgTable('outcome_evidence', {
  id:              text('id').primaryKey(),
  momentId:        text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  canvasOutcomeId: text('canvas_outcome_id').notNull(),
  evidenceStrength: real('evidence_strength').notNull(), // 0.0–1.0
  setBy:           text('set_by', { enum: ['auto', 'teacher'] }).notNull().default('auto'),
  updatedAt:       timestamp('updated_at').defaultNow().notNull(),
})
