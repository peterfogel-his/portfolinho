import { pgTable, text, timestamp, integer, boolean, bigint } from 'drizzle-orm/pg-core'
import { users } from './users'
import { portfolios, moments, momentVersions } from './portfolios'

// Faktisk fil eller text — deduplicerad enhet (länkas av versioner)
export const artefaktBlobs = pgTable('artefakt_blobs', {
  id:          text('id').primaryKey(),
  ownerId:     text('owner_id').notNull().references(() => users.id),
  type:        text('type', {
    enum: ['media_video', 'media_audio', 'media_image', 'document', 'rtf', 'link'],
  }).notNull(),
  // För fil-typer
  fileName:    text('file_name'),
  filePath:    text('file_path'),           // lokal sökväg eller S3-nyckel
  fileMime:    text('file_mime'),
  fileSize:    bigint('file_size', { mode: 'number' }),
  // För RTF/text-typer
  content:     text('content'),
  // För länk-typer
  url:         text('url'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

// Artefakt i ett moment-snapshot — länkar blob till version
export const momentArtefakter = pgTable('moment_artefakter', {
  id:             text('id').primaryKey(),
  momentVersionId: text('moment_version_id').notNull().references(() => momentVersions.id, { onDelete: 'cascade' }),
  blobId:         text('blob_id').notNull().references(() => artefaktBlobs.id),
  // Föregående versions artefakt-ID om blob är oförändrad (referens, ingen duplicering)
  inheritedFromId: text('inherited_from_id'),
  title:          text('title').notNull(),
  position:       integer('position').notNull(),
  visibility:     text('visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('private'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
})

// Fasta artefaktplatser på moment-nivå (utanför versionskedjan)
export const momentFixedArtefakter = pgTable('moment_fixed_artefakter', {
  id:       text('id').primaryKey(),
  momentId: text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  role:     text('role', {
    enum: ['teacher_description', 'student_reflection', 'teacher_feedback', 'peer_comment'],
  }).notNull(),
  blobId:   text('blob_id').references(() => artefaktBlobs.id),
  authorId: text('author_id').notNull().references(() => users.id),
  // För peer-kommentarer: visas anonymiserat i publikt läge
  isAnonymousInPublic: boolean('is_anonymous_in_public').notNull().default(true),
  visibility: text('visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('course'),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
})

// Fasta artefaktplatser på portfolio-nivå (summativ nivå)
export const portfolioFixedArtefakter = pgTable('portfolio_fixed_artefakter', {
  id:          text('id').primaryKey(),
  portfolioId: text('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  role:        text('role', {
    enum: ['student_introduction', 'student_summative_reflection', 'teacher_summative_comment'],
  }).notNull(),
  blobId:      text('blob_id').references(() => artefaktBlobs.id),
  authorId:    text('author_id').notNull().references(() => users.id),
  visibility:  text('visibility', {
    enum: ['private', 'course', 'link', 'public'],
  }).notNull().default('private'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})
