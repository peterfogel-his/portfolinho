CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"canvas_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "canvas_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"canvas_base_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvas_outcomes" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"mastery_points" integer,
	"ratings" jsonb,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvas_rubric_criteria" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"rubric_id" text NOT NULL,
	"rubric_title" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"points" integer,
	"ratings" jsonb,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"formative_gate" text DEFAULT 'locked' NOT NULL,
	"summative_gate" text DEFAULT 'on_submit' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_moments" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"allow_student_reflection" boolean DEFAULT true NOT NULL,
	"allow_peer_comment" boolean DEFAULT false NOT NULL,
	"allow_student_artifacts" boolean DEFAULT true NOT NULL,
	"max_student_visibility" text DEFAULT 'public' NOT NULL,
	"teacher_feedback_publishable" boolean DEFAULT false NOT NULL,
	"peer_comments_publishable" boolean DEFAULT false NOT NULL,
	"canvas_outcome_ids" jsonb DEFAULT '[]'::jsonb,
	"canvas_rubric_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moment_outcome_links" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_id" text NOT NULL,
	"canvas_outcome_id" text NOT NULL,
	"evidence_strength" real DEFAULT 0 NOT NULL,
	"linked_by" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moment_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_id" text NOT NULL,
	"version_number" integer NOT NULL,
	"student_note" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moments" (
	"id" text PRIMARY KEY NOT NULL,
	"portfolio_id" text NOT NULL,
	"template_moment_id" text,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"course_id" text NOT NULL,
	"template_id" text,
	"title" text NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artefakt_blobs" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"type" text NOT NULL,
	"file_name" text,
	"file_path" text,
	"file_mime" text,
	"file_size" bigint,
	"content" text,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moment_artefakter" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_version_id" text NOT NULL,
	"blob_id" text NOT NULL,
	"inherited_from_id" text,
	"title" text NOT NULL,
	"position" integer NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moment_fixed_artefakter" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_id" text NOT NULL,
	"role" text NOT NULL,
	"blob_id" text,
	"author_id" text NOT NULL,
	"is_anonymous_in_public" boolean DEFAULT true NOT NULL,
	"visibility" text DEFAULT 'course' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_fixed_artefakter" (
	"id" text PRIMARY KEY NOT NULL,
	"portfolio_id" text NOT NULL,
	"role" text NOT NULL,
	"blob_id" text,
	"author_id" text NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_criterion_scores" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"criterion_id" text NOT NULL,
	"score" integer NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_id" text NOT NULL,
	"moment_version_id" text,
	"assessor_id" text NOT NULL,
	"layer" text NOT NULL,
	"is_final" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outcome_evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"moment_id" text NOT NULL,
	"canvas_outcome_id" text NOT NULL,
	"evidence_strength" real NOT NULL,
	"set_by" text DEFAULT 'auto' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_outcomes" ADD CONSTRAINT "canvas_outcomes_course_id_canvas_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."canvas_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_rubric_criteria" ADD CONSTRAINT "canvas_rubric_criteria_course_id_canvas_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."canvas_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_templates" ADD CONSTRAINT "portfolio_templates_course_id_canvas_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."canvas_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_templates" ADD CONSTRAINT "portfolio_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_moments" ADD CONSTRAINT "template_moments_template_id_portfolio_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."portfolio_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_outcome_links" ADD CONSTRAINT "moment_outcome_links_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_versions" ADD CONSTRAINT "moment_versions_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_template_moment_id_template_moments_id_fk" FOREIGN KEY ("template_moment_id") REFERENCES "public"."template_moments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_course_id_canvas_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."canvas_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_template_id_portfolio_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."portfolio_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artefakt_blobs" ADD CONSTRAINT "artefakt_blobs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_artefakter" ADD CONSTRAINT "moment_artefakter_moment_version_id_moment_versions_id_fk" FOREIGN KEY ("moment_version_id") REFERENCES "public"."moment_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_artefakter" ADD CONSTRAINT "moment_artefakter_blob_id_artefakt_blobs_id_fk" FOREIGN KEY ("blob_id") REFERENCES "public"."artefakt_blobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_fixed_artefakter" ADD CONSTRAINT "moment_fixed_artefakter_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_fixed_artefakter" ADD CONSTRAINT "moment_fixed_artefakter_blob_id_artefakt_blobs_id_fk" FOREIGN KEY ("blob_id") REFERENCES "public"."artefakt_blobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moment_fixed_artefakter" ADD CONSTRAINT "moment_fixed_artefakter_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_fixed_artefakter" ADD CONSTRAINT "portfolio_fixed_artefakter_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_fixed_artefakter" ADD CONSTRAINT "portfolio_fixed_artefakter_blob_id_artefakt_blobs_id_fk" FOREIGN KEY ("blob_id") REFERENCES "public"."artefakt_blobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_fixed_artefakter" ADD CONSTRAINT "portfolio_fixed_artefakter_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_criterion_scores" ADD CONSTRAINT "assessment_criterion_scores_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_moment_version_id_moment_versions_id_fk" FOREIGN KEY ("moment_version_id") REFERENCES "public"."moment_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_assessor_id_users_id_fk" FOREIGN KEY ("assessor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_evidence" ADD CONSTRAINT "outcome_evidence_moment_id_moments_id_fk" FOREIGN KEY ("moment_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;