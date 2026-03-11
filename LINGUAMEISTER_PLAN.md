# LinguaMeister — Complete Implementation Plan

> Award-winning German Language Learning LMS | Full-Stack Web Application

---

## Brand Identity

| Token | Value |
|---|---|
| Primary Green | `#0F6B3E` |
| Secondary Green | `#4CAF50` |
| Accent Lime | `#C7F000` |
| Background | `#F6F9F3` |
| Text | `#1E1E1E` |
| White | `#FFFFFF` |

**Design Style:** Modern · Clean · Academic · Minimal — large spacing, card layouts, soft shadows, rounded components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, TailwindCSS |
| Backend | Node.js, NestJS, TypeORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Storage | AWS S3 + CloudFront CDN |
| Auth | JWT (access token in memory, refresh in httpOnly cookie) + Google OAuth |
| AI | OpenAI Whisper (speech), GPT-4 (grammar/essays) |
| Monorepo | Turborepo with npm workspaces |

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│                                                                     │
│   Browser  ──►  Next.js (App Router, SSR/ISR)  ──►  CDN Cache      │
│   Mobile Web    React Components + Zustand Store    CloudFront      │
└─────────────────────┬───────────────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────────────────┐
│                    API GATEWAY LAYER                                │
│                                                                     │
│   AWS ALB  →  WAF (rate limit, geo)  →  ECS Fargate Cluster        │
│                                          NestJS API (2-20 tasks)   │
└─────┬──────────────┬─────────────────────┬──────────────────────────┘
      │              │                     │
┌─────▼──┐    ┌──────▼──────┐    ┌─────────▼────────┐
│  RDS   │    │ ElastiCache │    │   AWS SQS Queues  │
│  PG 16 │    │ Redis 7     │    │   (AI workers)    │
│Multi-AZ│    │Cluster Mode │    │   Speech / Essay  │
└────────┘    └─────────────┘    └──────────┬────────┘
                                            │
                                 ┌──────────▼────────┐
                                 │  AI Worker Service │
                                 │  OpenAI Whisper    │
                                 │  OpenAI GPT-4      │
                                 └───────────────────┘
          ┌─────────────────────────────────────────────┐
          │           AWS S3 + CloudFront               │
          │  Audio / Video / Images / Recordings        │
          └─────────────────────────────────────────────┘
```

### Service Boundaries

| Service | Responsibility |
|---|---|
| `AuthService` | JWT issuance, refresh rotation, OAuth, email verification |
| `UsersService` | Profile CRUD, role management |
| `CoursesService` | Course/Module/Lesson CRUD, enrollment, progress |
| `ExercisesService` | Exercise CRUD + Evaluator dispatch |
| `VocabularyService` | Word lists, SM-2 SRS scheduling, review sessions |
| `GamificationService` | XP awards, level calc, streaks, badges, leaderboard |
| `AIService` | Speech eval, grammar correction, adaptive recommendations |
| `AnalyticsService` | Event capture, aggregation, reporting queries |
| `FilesService` | S3 presigned URLs, CDN path resolution |
| `CacheService` | Redis get/set/invalidate wrapper |

---

## 2. Monorepo Folder Structure

```
linguameister/
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/       # @CurrentUser, @Roles, @Public
│   │   │   │   ├── filters/          # GlobalExceptionFilter
│   │   │   │   ├── guards/           # JwtAuthGuard, RolesGuard
│   │   │   │   ├── interceptors/     # TransformInterceptor, LoggingInterceptor
│   │   │   │   ├── pipes/            # ValidationPipe, ParseUUIDPipe
│   │   │   │   ├── services/         # CacheService, EmailService
│   │   │   │   └── utils/            # pagination, slug, fuzzy-match
│   │   │   ├── config/               # ConfigModule, validation schemas
│   │   │   ├── database/
│   │   │   │   ├── migrations/       # 001_initial_schema.sql, ...
│   │   │   │   ├── seeds/            # dev seed data
│   │   │   │   └── typeorm.config.ts
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       │   ├── auth.module.ts
│   │   │       │   ├── auth.controller.ts
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── strategies/   # jwt.strategy.ts, google.strategy.ts
│   │   │       │   └── dto/
│   │   │       ├── users/
│   │   │       ├── courses/
│   │   │       │   ├── modules/      # course modules (chapters)
│   │   │       │   └── lessons/
│   │   │       ├── exercises/
│   │   │       │   ├── evaluators/
│   │   │       │   │   ├── evaluator.factory.ts
│   │   │       │   │   ├── multiple-choice.evaluator.ts
│   │   │       │   │   ├── fill-blanks.evaluator.ts
│   │   │       │   │   ├── drag-drop.evaluator.ts
│   │   │       │   │   ├── sentence-order.evaluator.ts
│   │   │       │   │   ├── listening.evaluator.ts
│   │   │       │   │   ├── speaking.evaluator.ts
│   │   │       │   │   ├── translation.evaluator.ts
│   │   │       │   │   └── essay.evaluator.ts
│   │   │       │   └── exercises.service.ts
│   │   │       ├── vocabulary/
│   │   │       │   ├── srs/          # sm2.algorithm.ts
│   │   │       │   └── vocabulary.service.ts
│   │   │       ├── gamification/
│   │   │       │   ├── xp/
│   │   │       │   ├── badges/
│   │   │       │   ├── streaks/
│   │   │       │   └── leaderboard/
│   │   │       ├── ai/
│   │   │       │   ├── speech/
│   │   │       │   ├── grammar/
│   │   │       │   └── adaptive/
│   │   │       ├── analytics/
│   │   │       ├── files/
│   │   │       └── admin/
│   │   └── Dockerfile
│   │
│   └── web/                          # Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/         # landing, about, pricing
│       │   │   │   ├── page.tsx
│       │   │   │   └── layout.tsx
│       │   │   ├── (auth)/           # login, register, forgot-password
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── register/page.tsx
│       │   │   ├── (student)/        # student app shell
│       │   │   │   ├── dashboard/page.tsx
│       │   │   │   ├── courses/
│       │   │   │   │   ├── page.tsx          # catalog
│       │   │   │   │   └── [slug]/
│       │   │   │   │       ├── page.tsx      # course detail
│       │   │   │   │       └── learn/
│       │   │   │   │           └── [lessonId]/page.tsx
│       │   │   │   ├── vocabulary/page.tsx
│       │   │   │   ├── vocabulary/review/page.tsx
│       │   │   │   ├── progress/page.tsx
│       │   │   │   └── leaderboard/page.tsx
│       │   │   ├── (teacher)/        # teacher app shell
│       │   │   │   ├── dashboard/page.tsx
│       │   │   │   ├── courses/
│       │   │   │   └── writing-reviews/page.tsx
│       │   │   └── (admin)/          # admin app shell
│       │   │       ├── dashboard/page.tsx
│       │   │       └── users/page.tsx
│       │   ├── components/
│       │   │   ├── ui/               # base design system
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Modal.tsx
│       │   │   │   ├── Toast.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   ├── Progress.tsx
│       │   │   │   ├── Avatar.tsx
│       │   │   │   └── Spinner.tsx
│       │   │   ├── exercises/
│       │   │   │   ├── ExerciseShell.tsx
│       │   │   │   ├── MultipleChoice.tsx
│       │   │   │   ├── FillInBlanks.tsx
│       │   │   │   ├── DragAndDrop.tsx
│       │   │   │   ├── SentenceOrdering.tsx
│       │   │   │   ├── ListeningExercise.tsx
│       │   │   │   ├── SpeakingExercise.tsx
│       │   │   │   ├── TranslationExercise.tsx
│       │   │   │   └── EssayExercise.tsx
│       │   │   ├── gamification/
│       │   │   │   ├── XPBar.tsx
│       │   │   │   ├── StreakCounter.tsx
│       │   │   │   ├── BadgeGrid.tsx
│       │   │   │   └── LeaderboardTable.tsx
│       │   │   ├── vocabulary/
│       │   │   │   └── Flashcard.tsx
│       │   │   └── charts/           # recharts wrappers
│       │   ├── lib/
│       │   │   ├── api.ts            # Axios + JWT refresh interceptor
│       │   │   ├── query-client.ts   # React Query setup
│       │   │   └── cn.ts             # tailwind class merging utility
│       │   ├── hooks/                # useAuth, useCourse, useExercise, ...
│       │   ├── stores/               # Zustand: auth.store.ts
│       │   └── middleware.ts         # Next.js route protection
│       └── Dockerfile
│
├── packages/
│   └── shared-types/                 # shared TS interfaces/enums
│       └── src/
│           ├── auth.types.ts
│           ├── course.types.ts
│           ├── exercise.types.ts
│           ├── gamification.types.ts
│           └── index.ts
│
├── infrastructure/
│   ├── terraform/                    # all AWS resources as code
│   │   ├── main.tf
│   │   ├── ecs.tf
│   │   ├── rds.tf
│   │   ├── elasticache.tf
│   │   ├── s3.tf
│   │   └── cloudfront.tf
│   ├── scripts/
│   │   ├── setup-local.sh
│   │   └── init.sql
│   └── docker/
│       └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # lint, test, build on PR
│       └── deploy.yml                # push to ECR + ECS on merge to main
│
├── turbo.json
├── package.json
└── .env.example
```

---

## 3. Database Schema (DDL)

```sql
-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE cefr_level AS ENUM ('A1','A2','B1','B2','C1','C2');
CREATE TYPE exercise_type AS ENUM (
  'multiple_choice','fill_blanks','drag_drop',
  'sentence_order','listening','speaking','translation','essay'
);
CREATE TYPE content_block_type AS ENUM ('text','image','video','audio','quiz_ref');
CREATE TYPE badge_type AS ENUM (
  'streak','xp_milestone','course_complete','perfect_score',
  'vocabulary_master','speaking_champion','early_bird','community'
);

-- ───────────────────────────────────────────────
-- USERS
-- ───────────────────────────────────────────────
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255),           -- NULL for OAuth-only users
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'student',
  cefr_level      cefr_level NOT NULL DEFAULT 'A1',
  timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',
  locale          VARCHAR(10) NOT NULL DEFAULT 'en',
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE oauth_accounts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(255) NOT NULL UNIQUE,
  family_id   UUID NOT NULL,
  is_revoked  BOOLEAN NOT NULL DEFAULT false,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens(family_id);

-- ───────────────────────────────────────────────
-- COURSES
-- ───────────────────────────────────────────────
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id      UUID NOT NULL REFERENCES users(id),
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  thumbnail_url   TEXT,
  cefr_level      cefr_level NOT NULL,
  language_focus  VARCHAR(100)[],
  duration_hours  SMALLINT,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_level ON courses(cefr_level);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_slug ON courses(slug);

CREATE TABLE course_modules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  position    SMALLINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_modules_course ON course_modules(course_id, position);

CREATE TABLE lessons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id       UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL,
  content_blocks  JSONB NOT NULL DEFAULT '[]',
  xp_reward       SMALLINT NOT NULL DEFAULT 10,
  duration_mins   SMALLINT,
  position        SMALLINT NOT NULL,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_lessons_module ON lessons(module_id, position);

CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

CREATE TABLE lesson_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  time_spent_secs INT NOT NULL DEFAULT 0,
  last_position   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);

-- ───────────────────────────────────────────────
-- EXERCISES
-- ───────────────────────────────────────────────
CREATE TABLE exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id       UUID REFERENCES lessons(id) ON DELETE SET NULL,
  teacher_id      UUID NOT NULL REFERENCES users(id),
  type            exercise_type NOT NULL,
  title           VARCHAR(255),
  instructions    TEXT,
  content         JSONB NOT NULL,
  answer_key      JSONB NOT NULL,
  xp_reward       SMALLINT NOT NULL DEFAULT 10,
  difficulty      SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  cefr_level      cefr_level,
  tags            VARCHAR(50)[],
  position        SMALLINT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_level ON exercises(cefr_level);

CREATE TABLE exercise_attempts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  answer          JSONB NOT NULL,
  score           NUMERIC(5,2) NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  feedback        JSONB,
  time_spent_ms   INT NOT NULL DEFAULT 0,
  xp_awarded      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_attempts_user ON exercise_attempts(user_id);
CREATE INDEX idx_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX idx_attempts_created ON exercise_attempts(created_at DESC);

-- ───────────────────────────────────────────────
-- VOCABULARY
-- ───────────────────────────────────────────────
CREATE TABLE vocabulary_lists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE SET NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vocabulary_items (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id              UUID NOT NULL REFERENCES vocabulary_lists(id) ON DELETE CASCADE,
  german_word          VARCHAR(255) NOT NULL,
  article              VARCHAR(10),
  plural_form          VARCHAR(255),
  english_translation  VARCHAR(255) NOT NULL,
  example_sentence     TEXT,
  audio_url            TEXT,
  image_url            TEXT,
  tags                 VARCHAR(50)[],
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_vocab_items_list ON vocabulary_items(list_id);
CREATE INDEX idx_vocab_german_trgm ON vocabulary_items USING gin(german_word gin_trgm_ops);

CREATE TABLE vocabulary_srs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id          UUID NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  repetitions      SMALLINT NOT NULL DEFAULT 0,
  easiness_factor  NUMERIC(4,2) NOT NULL DEFAULT 2.5,
  interval_days    SMALLINT NOT NULL DEFAULT 1,
  next_review_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);
CREATE INDEX idx_srs_user_due ON vocabulary_srs(user_id, next_review_at);

-- ───────────────────────────────────────────────
-- GAMIFICATION
-- ───────────────────────────────────────────────
CREATE TABLE user_xp (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_xp    INT NOT NULL DEFAULT 0,
  weekly_xp   INT NOT NULL DEFAULT 0,
  level       SMALLINT NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE xp_transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount       SMALLINT NOT NULL,
  source       VARCHAR(50) NOT NULL,
  reference_id UUID,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id, created_at DESC);

CREATE TABLE user_streaks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak      SMALLINT NOT NULL DEFAULT 0,
  longest_streak      SMALLINT NOT NULL DEFAULT 0,
  last_activity_date  DATE,
  streak_freeze_used  BOOLEAN NOT NULL DEFAULT false,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url    TEXT NOT NULL,
  type        badge_type NOT NULL,
  xp_bonus    SMALLINT NOT NULL DEFAULT 0,
  criteria    JSONB NOT NULL
);

CREATE TABLE user_badges (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id  UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- ───────────────────────────────────────────────
-- ANALYTICS
-- ───────────────────────────────────────────────
CREATE TABLE analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name  VARCHAR(100) NOT NULL,
  properties  JSONB NOT NULL DEFAULT '{}',
  session_id  UUID,
  ip_hash     VARCHAR(64),
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_event ON analytics_events(event_name, created_at DESC);

CREATE TABLE writing_submissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id      UUID NOT NULL REFERENCES exercises(id),
  content          TEXT NOT NULL,
  word_count       SMALLINT NOT NULL,
  ai_feedback      JSONB,
  teacher_feedback TEXT,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending',
  reviewed_by      UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at      TIMESTAMPTZ
);
CREATE INDEX idx_writing_user ON writing_submissions(user_id);
CREATE INDEX idx_writing_status ON writing_submissions(status);
```

---

## 4. Backend: NestJS Architecture

### Module Structure

```
AppModule
├── ConfigModule         (global, env validation)
├── DatabaseModule       (TypeORM + PG connection pool)
├── RedisModule          (ioredis connection)
├── AuthModule           (JWT, OAuth, guards)
├── UsersModule
├── CoursesModule
│   ├── ModulesModule    (course chapters)
│   └── LessonsModule
├── ExercisesModule
│   └── EvaluatorsModule
├── VocabularyModule
│   └── SrsModule
├── GamificationModule
│   ├── XpModule
│   ├── StreaksModule
│   ├── BadgesModule
│   └── LeaderboardModule
├── AiModule
│   ├── SpeechModule
│   ├── GrammarModule
│   └── AdaptiveModule
├── AnalyticsModule
├── FilesModule
└── AdminModule
```

### REST API Endpoints

#### Auth — `POST /api/v1/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create account + send verification email |
| POST | `/auth/login` | Email/password → access + refresh tokens |
| POST | `/auth/refresh` | Rotate refresh token → new access token |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Apply password reset |
| POST | `/auth/verify-email` | Verify email with OTP token |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback handler |

#### Courses — `/api/v1/courses`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/courses` | Public | Paginated catalog with filters |
| GET | `/courses/:slug` | Public | Course detail |
| POST | `/courses` | Teacher | Create course |
| PATCH | `/courses/:id` | Teacher | Update course |
| POST | `/courses/:id/publish` | Teacher | Publish course |
| DELETE | `/courses/:id` | Teacher | Soft delete course |
| POST | `/courses/:id/enroll` | Student | Enroll in course |
| GET | `/courses/:id/progress` | Student | My progress in course |
| GET | `/courses/:id/students` | Teacher | List enrolled students |

#### Lessons — `/api/v1/lessons`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/lessons/:id` | Student | Get lesson content |
| POST | `/lessons` | Teacher | Create lesson |
| PATCH | `/lessons/:id` | Teacher | Update lesson |
| POST | `/lessons/:id/complete` | Student | Mark lesson complete |
| PATCH | `/lessons/:id/progress` | Student | Save video position/time |

#### Exercises — `/api/v1/exercises`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/exercises/:id` | Student | Get exercise (no answer key) |
| POST | `/exercises/:id/attempt` | Student | Submit answer → evaluated response |
| GET | `/exercises/:id/stats` | Teacher | Correctness/time stats |
| POST | `/exercises` | Teacher | Create exercise |
| PATCH | `/exercises/:id` | Teacher | Update exercise |

#### Vocabulary — `/api/v1/vocabulary`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/vocabulary/lists` | Student | My vocabulary lists |
| POST | `/vocabulary/lists` | Student | Create list |
| GET | `/vocabulary/lists/:id/items` | Student | Words in list |
| POST | `/vocabulary/lists/:id/items` | Student | Add word |
| GET | `/vocabulary/review/due` | Student | Due items for review |
| POST | `/vocabulary/review/:itemId` | Student | Submit review rating (0–5) |
| GET | `/vocabulary/stats` | Student | SRS stats overview |

#### Gamification — `/api/v1/gamification`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/gamification/me` | Student | My XP, level, streak, badges |
| GET | `/gamification/leaderboard` | Student | Weekly top 100 |
| GET | `/gamification/badges` | Student | All badges (earned/locked) |

#### AI — `/api/v1/ai`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/ai/speech/evaluate` | Student | Submit audio key → job ID |
| GET | `/ai/speech/jobs/:jobId` | Student | Poll evaluation result |
| POST | `/ai/grammar/check` | Student | Check German text |
| POST | `/ai/writing/submit` | Student | Submit essay for review |
| GET | `/ai/recommendations` | Student | Adaptive recommendations |

#### Analytics — `/api/v1/analytics`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/analytics/me` | Student | Personal stats overview |
| GET | `/analytics/me/calendar` | Student | Activity heatmap data |
| GET | `/analytics/me/skills` | Student | Skill radar data |
| GET | `/analytics/courses/:id` | Teacher | Course performance metrics |
| GET | `/analytics/platform` | Admin | Platform-wide KPIs |

#### Files — `/api/v1/files`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/files/upload-url` | Auth | Get presigned S3 upload URL |
| DELETE | `/files/:key` | Auth | Delete file from S3 |

---

## 5. Key TypeScript Interfaces (Shared Types)

```typescript
// packages/shared-types/src/exercise.types.ts

export type ExerciseType =
  | 'multiple_choice' | 'fill_blanks' | 'drag_drop'
  | 'sentence_order' | 'listening' | 'speaking'
  | 'translation' | 'essay';

export interface MultipleChoiceContent {
  question: string;
  options: Array<{ id: string; text: string }>;
  allowMultiple: boolean;
}
export interface FillBlanksContent {
  sentence: string;       // "Ich ___ Deutsch."
  wordBank?: string[];
}
export interface DragDropContent {
  items: Array<{ id: string; text: string }>;
  categories: Array<{ id: string; label: string }>;
}
export interface SentenceOrderContent {
  words: Array<{ id: string; text: string }>;
  shuffled: boolean;
}
export interface ListeningContent {
  audioUrl: string;
  audioTranscript?: string;
  question: string;
  options: Array<{ id: string; text: string }>;
}
export interface SpeakingContent {
  prompt: string;
  targetText?: string;
  audioUrl?: string;
}
export interface TranslationContent {
  sourceText: string;
  sourceLanguage: 'de' | 'en';
  targetLanguage: 'de' | 'en';
}
export interface EssayContent {
  prompt: string;
  minWords: number;
  maxWords: number;
  rubric?: string;
}

export interface EvaluationResult {
  score: number;        // 0–100
  isCorrect: boolean;
  xpAwarded: number;
  feedback: ExerciseFeedback;
}
export interface ExerciseFeedback {
  message: string;
  correctAnswer?: unknown;
  explanation?: string;
  errors?: Array<{ position?: number; got: string; expected: string }>;
}
```

```typescript
// packages/shared-types/src/gamification.types.ts

export interface UserXP {
  totalXp: number;
  weeklyXp: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;
  progressPercent: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  type: string;
  xpBonus: number;
  earned: boolean;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  weeklyXp: number;
  level: number;
  isCurrentUser: boolean;
}

export const XP_LEVELS = [
  { level: 1,  name: 'Anfänger',        minXp: 0    },
  { level: 2,  name: 'Lernender',       minXp: 100  },
  { level: 3,  name: 'Fortgeschritten', minXp: 300  },
  { level: 4,  name: 'Geübter',         minXp: 600  },
  { level: 5,  name: 'Kennerin',        minXp: 1000 },
  { level: 6,  name: 'Erfahrener',      minXp: 1500 },
  { level: 7,  name: 'Experte',         minXp: 2200 },
  { level: 8,  name: 'Meister',         minXp: 3000 },
  { level: 9,  name: 'Großmeister',     minXp: 4000 },
  { level: 10, name: 'LinguaMeister',   minXp: 5500 },
] as const;
```

---

## 6. Frontend Architecture

### TailwindCSS Design Tokens

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          green:       '#0F6B3E',
          'green-mid': '#4CAF50',
          lime:        '#C7F000',
          bg:          '#F6F9F3',
          text:        '#1E1E1E',
        },
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(15,107,62,0.08)',
        'card-hover': '0 4px 24px rgba(15,107,62,0.15)',
      },
    },
  },
}
```

### State Management

| Concern | Tool | Examples |
|---|---|---|
| Auth, session | Zustand | `user`, `accessToken`, `isLoading` |
| Exercise session | Zustand | `currentExercise`, `attempts`, `sessionXP` |
| Server data / caching | React Query | All API calls, stale-while-revalidate |
| Public pages | Next.js ISR | Course catalog (revalidate: 300s) |
| Optimistic updates | React Query | Immediate XP display on submit |

---

## 7. Authentication Flows

### Registration

```
1. POST /auth/register → validate → create user (unverified)
2. Generate 6-digit OTP → store hashed in Redis (TTL 15min)
3. Send verification email
4. User submits OTP → POST /auth/verify-email
5. Mark email_verified=true → issue access + refresh tokens
```

### Login + Refresh Token Rotation

```
LOGIN
──────
1. POST /auth/login { email, password }
2. bcrypt.compare(password, hash)
3. Issue accessToken (JWT, 15min) + refreshToken (opaque UUID, 30d)
4. Store hashed refreshToken in DB with family_id
5. Set refresh_token as httpOnly SameSite=Strict cookie
6. Return { accessToken, user } in body

REFRESH TOKEN ROTATION
───────────────────────
1. Axios interceptor catches 401 → POST /auth/refresh
2. Server reads cookie → hash → lookup in DB
3. If token.is_revoked=true → SECURITY ALERT: revoke entire family
4. If valid → issue new accessToken + new refreshToken (same family_id)
5. Old token marked revoked → new cookie set → return new accessToken

GOOGLE OAUTH
─────────────
1. GET /auth/google → Passport redirect to Google consent
2. Google callback → /auth/google/callback
3. Find or create user from Google profile
4. Issue access + refresh tokens → redirect to /dashboard
```

---

## 8. AI Integration Architecture

### Async Speech Evaluation Pipeline

```
1.  Student records audio via MediaRecorder (webm/opus)
2.  Client requests presigned S3 URL → POST /files/upload-url
3.  Client uploads directly to S3 (no API server bandwidth)
4.  Client POSTs { audioKey, exerciseId } to /ai/speech/evaluate
5.  API creates job → publishes to SQS speech-evaluation queue
6.  Returns 202 Accepted { jobId }
7.  Client polls GET /ai/speech/jobs/:jobId every 3 seconds

Background Worker:
8.  Picks up job → downloads audio from S3
9.  Sends to OpenAI Whisper → gets transcript
10. Compares to target text (Levenshtein WER + phonetic scoring)
11. GPT-4 rates pronunciation 0–100, identifies errors
12. Stores result in Redis (TTL 1h)
13. Deletes temp audio from S3

Result:
{
  "status": "completed",
  "transcript": "Ich bin Ingenieur",
  "overallScore": 87,
  "breakdown": { "accuracy": 92, "fluency": 85, "pronunciation": 84 },
  "wordScores": [
    { "word": "Ingenieur", "score": 75, "feedback": "Final 'r' should be uvular" }
  ]
}
```

### Grammar Correction Service

```typescript
interface GrammarCorrectionResult {
  correctedText: string;
  corrections: Array<{
    original: string;
    corrected: string;
    startIndex: number;
    endIndex: number;
    errorType: 'case' | 'gender' | 'verb_conjugation' | 'word_order' | 'spelling';
    explanation: string;
    severity: 'critical' | 'minor' | 'style';
  }>;
  overallScore: number;
  summary: string;
}
// Cache strategy: hash(text) → corrections in Redis (TTL 24h)
// Avoids repeated GPT-4 calls for identical text
```

### Adaptive Learning Rules

```
Rule 1 — Struggling Concept
  IF avg score on tag 'dative_case' < 60% (last 5 attempts)
  THEN recommend exercises tagged 'dative_case' at current level

Rule 2 — Vocabulary Gap
  IF vocabulary_srs has items overdue > 3 days
  THEN nudge: "Review your vocabulary — X words are waiting!"

Rule 3 — Level Progression
  IF avg score > 85% across last 20 exercises at current level
  THEN suggest: "You may be ready for the next level!"

Rule 4 — Streak Maintenance
  IF no activity today AND local time < 20:00
  THEN push: "Don't break your X-day streak!"

Rule 5 — Completion Nudge
  IF course progress > 75% AND last activity > 7 days ago
  THEN show: "You're almost done with [Course]! Keep going."
```

---

## 9. Gamification System

### XP Award Schedule

| Action | XP |
|---|---|
| Complete exercise (first attempt) | 10 XP |
| Perfect score bonus | +5 XP |
| Complete lesson | 20 XP |
| Complete course module | 50 XP |
| Complete full course | 200 XP |
| Daily vocabulary review (≥5 words) | 15 XP |
| Speaking exercise completed | 20 XP |
| Essay submitted | 25 XP |
| 7-day streak bonus | 50 XP |
| 30-day streak bonus | 200 XP |
| Badge earned | badge.xpBonus |

### Badge Definitions

| Badge | Trigger |
|---|---|
| **Erster Tag** | Complete first lesson |
| **Woche des Lernens** | 7-day streak |
| **Monat des Lernens** | 30-day streak |
| **Vokabel-Meister** | Review 100 vocabulary words |
| **Perfektionist** | 10 perfect scores in a row |
| **Entdecker** | Enroll in 3 different courses |
| **Sprecher** | Complete 20 speaking exercises |
| **Schreiber** | Submit 5 essays |
| **Tausend-XP** | Reach 1,000 total XP |
| **LinguaMeister** | Reach level 10 |

### Leaderboard (Redis Sorted Sets)

```typescript
// O(log n) insert, O(log n + k) range query

const weeklyKey = `leaderboard:weekly:${getWeekKey()}`;
const globalKey = `leaderboard:global`;

// Update on XP award
await redis.zincrby(weeklyKey, xpAmount, userId);
await redis.zincrby(globalKey, xpAmount, userId);
await redis.expire(weeklyKey, 60 * 60 * 24 * 14); // 2-week TTL

// Get top 100
const entries = await redis.zrevrange(weeklyKey, 0, 99, 'WITHSCORES');

// Get user rank
const rank = await redis.zrevrank(weeklyKey, userId); // 0-indexed, +1 for display
```

---

## 10. Exercise Engine

### Evaluator Factory Pattern

```typescript
@Injectable()
export class EvaluatorFactory {
  private evaluators: Map<ExerciseType, IEvaluator>;

  constructor(/* inject all 8 evaluators */) {
    this.evaluators = new Map([
      ['multiple_choice', mcEvaluator],
      ['fill_blanks',     fbEvaluator],
      ['drag_drop',       dragDropEvaluator],
      ['sentence_order',  sentenceOrderEvaluator],
      ['listening',       listeningEvaluator],
      ['speaking',        speakingEvaluator],
      ['translation',     translationEvaluator],
      ['essay',           essayEvaluator],
    ]);
  }

  evaluate(exercise: Exercise, answer: unknown): EvaluationResult {
    const evaluator = this.evaluators.get(exercise.type);
    if (!evaluator) throw new Error(`No evaluator for type: ${exercise.type}`);
    return evaluator.evaluate(exercise, answer);
  }
}
```

### German-Aware Fuzzy Matching (Fill-in-Blanks)

```typescript
// Normalize German special characters before comparison
function normalizeGerman(text: string): string {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .trim();
}

function isAcceptableAnswer(userAnswer: string, correctAnswer: string): boolean {
  const a = normalizeGerman(userAnswer);
  const b = normalizeGerman(correctAnswer);
  if (a === b) return true;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return distance / maxLen <= 0.15; // 15% typo tolerance
}
```

---

## 11. Caching Strategy

### Redis Key Conventions & TTLs

| Key Pattern | TTL | Description |
|---|---|---|
| `user:session:{userId}` | 15m | User meta for auth checks |
| `course:content:{courseId}` | 1h | Full course tree |
| `course:catalog:{page}:{hash}` | 5m | Paginated catalog |
| `lesson:{lessonId}` | 1h | Lesson content blocks |
| `exercise:{exerciseId}` | 1h | Exercise (no answer key) |
| `user:xp:{userId}` | 5m | XP + level data |
| `user:badges:{userId}` | 1h | Earned badges list |
| `user:streak:{userId}` | 5m | Streak data |
| `leaderboard:weekly:{week}` | 30s | Weekly sorted set |
| `leaderboard:global` | 5m | Global sorted set |
| `vocab:due:{userId}` | 5m | Count of due SRS items |
| `grammar:correction:{hash}` | 24h | Cached grammar corrections |
| `job:speech:{jobId}` | 1h | Speech evaluation result |
| `rate:login:{ip}` | 15m | Login attempt counter |

### Cache Invalidation Events

| Event | Invalidate Keys |
|---|---|
| Course updated | `course:{id}`, `course:catalog:*` |
| Lesson updated | `lesson:{id}`, `course:{courseId}:*` |
| XP awarded | `user:xp:{userId}`, `leaderboard:weekly` |
| Badge earned | `user:badges:{userId}` |
| User profile updated | `user:session:{userId}` |

---

## 12. S3 Storage Layout

```
linguameister-prod/
├── avatars/{userId}/{uuid}.{ext}
├── course-thumbnails/{userId}/{uuid}.jpg
├── course-videos/{courseId}/{uuid}.mp4
├── lesson-audio/{lessonId}/{uuid}.mp3
├── exercise-audio/{exerciseId}/{uuid}.mp3
├── exercise-images/{exerciseId}/{uuid}.{ext}
├── speech-recordings/{userId}/{date}/{uuid}.webm
├── speech-temp/{userId}/{uuid}.webm    ← auto-deleted after 24h (S3 lifecycle)
└── essays/{userId}/{uuid}.txt

CloudFront Behaviors:
  /avatars/*           → Cache 7 days
  /course-thumbnails/* → Cache 30 days
  /course-videos/*     → Signed URLs, cache 1h
  /lesson-audio/*      → Cache 7 days
  /exercise-*          → Cache 30 days
  /speech-recordings/* → Signed URLs, no cache
```

---

## 13. Deployment Architecture

```
              Route 53 (DNS)
                    │
              CloudFront CDN
         ┌──────────┴──────────┐
   Web App (Next.js)     Static Assets (S3)
   via ECS Fargate       Audio/Video/Images
         │
   AWS ALB + WAF
         │
  ECS Fargate Cluster
  NestJS API (2–20 tasks, auto-scale CPU > 70%)
         │
┌────────┼────────────┐
RDS PG    Redis        SQS Queues
Multi-AZ  Cluster      speech-eval
+ Read    3 shards     grammar-check
Replica   2 nodes ea.      │
                    AI Workers (ECS 1–5 tasks)
                    OpenAI Whisper + GPT-4
```

### Docker Compose (Local Dev)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linguameister
      POSTGRES_USER: linguameister
      POSTGRES_PASSWORD: dev_password
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass dev_password
    ports: ["6379:6379"]
    volumes: [redis_data:/data]

  api:
    build: { context: ./apps/api, target: development }
    environment:
      DATABASE_URL: postgres://linguameister:dev_password@postgres:5432/linguameister
      REDIS_URL: redis://:dev_password@redis:6379
      JWT_ACCESS_SECRET: local_access_secret_min_32_chars
    ports: ["3001:3001"]
    depends_on: [postgres, redis]

  web:
    build: { context: ./apps/web, target: development }
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
    ports: ["3000:3000"]

  mailhog:
    image: mailhog/mailhog
    ports: ["1025:1025", "8025:8025"]

volumes:
  postgres_data:
  redis_data:
```

### Auto-Scaling Policy

| Service | Min | Max | Scale-Out Trigger |
|---|---|---|---|
| API (ECS) | 2 tasks | 20 tasks | CPU > 70% for 2 min → +2 tasks |
| Web (ECS) | 2 tasks | 10 tasks | CPU > 80% for 2 min → +2 tasks |
| AI Workers | 1 task | 5 tasks | SQS queue depth > 100 msgs |
| RDS Primary | db.r6g.2xlarge | — | Manual upgrade |
| ElastiCache | 3 shards × 2 nodes | — | Manual shard add |

---

## 14. Environment Variables Reference

```bash
# Application
NODE_ENV=development
API_PORT=3001
WEB_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Database
DATABASE_URL=postgres://linguameister:dev_password@localhost:5432/linguameister
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://:dev_password@localhost:6379

# JWT
JWT_ACCESS_SECRET=your_access_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_characters_long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback

# AWS
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=linguameister-dev
AWS_CLOUDFRONT_URL=https://dev-cdn.linguameister.com

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@linguameister.com

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Monitoring
SENTRY_DSN=https://your_sentry_dsn
LOG_LEVEL=debug
```

---

## 15. API Conventions

```
Base URL: /api/v1

Success Response:
  {
    "success": true,
    "data": <payload>,
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }

Error Response:
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [{ "field": "email", "message": "Invalid email format" }],
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }

Pagination:
  GET /courses?page=1&pageSize=20&sortBy=createdAt&sortOrder=DESC
  Response:
    { "items": [...], "total": 150, "page": 1, "pageSize": 20, "totalPages": 8 }

HTTP Status Codes:
  200 - OK          | 201 - Created     | 202 - Accepted (async job)
  204 - No Content  | 400 - Bad Request | 401 - Unauthorized
  403 - Forbidden   | 404 - Not Found   | 409 - Conflict
  429 - Rate Limited | 500 - Server Error

Naming Conventions:
  Endpoints:   kebab-case  (/writing-submissions)
  JSON keys:   camelCase
  Query params: camelCase
```

---

## 16. Phase-by-Phase Build Plan

### Phase 1 — Foundation (Weeks 1–3)
**Goal:** Working scaffold with auth, database, and dev environment

- [ ] Monorepo (Turborepo, workspaces, TS, ESLint, Prettier)
- [ ] Docker Compose: Postgres + Redis + MailHog
- [ ] All DB migrations (complete DDL from Section 3)
- [ ] NestJS: Auth module (register, login, refresh rotation, Google OAuth)
- [ ] JWT guards, roles, global exception filter, response interceptor
- [ ] Next.js: Auth pages, Axios + refresh interceptor, base UI components
- [ ] Brand design tokens in Tailwind

**Milestone:** End-to-end login with Google OAuth works

---

### Phase 2 — Course & Lesson System (Weeks 4–6)
**Goal:** Teachers create courses; students browse, enroll, and watch lessons

- [ ] Courses CRUD, publish flow, enrollment
- [ ] S3 presigned URL file uploads (thumbnails, audio)
- [ ] Lesson player (video, audio, markdown content blocks)
- [ ] Lesson progress tracking (video seek position save/resume)
- [ ] Teacher: course editor, module editor, lesson builder
- [ ] Redis caching for course content + invalidation

**Milestone:** Teacher creates full course; student watches lesson, progress saves

---

### Phase 3 — Exercise Engine + Vocabulary (Weeks 7–10)
**Goal:** All 8 exercise types functional; spaced repetition vocabulary system

- [ ] All 8 exercise evaluators (including German fuzzy matching)
- [ ] All 8 exercise UI components + ExerciseShell
- [ ] SM-2 SRS algorithm implementation
- [ ] Vocabulary CRUD + review session UI
- [ ] Flashcard component with flip animation

**Milestone:** All 8 exercise types submit + evaluate; vocabulary review session works

---

### Phase 4 — Gamification + AI (Weeks 11–14)
**Goal:** XP, streaks, badges, leaderboard, speech evaluation, grammar correction

- [ ] XP transactions + level calculation + animated XP bar
- [ ] Daily streak detection + reset logic
- [ ] Badge award system (all 10 badges)
- [ ] Redis leaderboard (sorted sets, weekly rotation)
- [ ] SQS + OpenAI Whisper speech evaluation pipeline
- [ ] Grammar correction service (GPT-4 + Redis cache)
- [ ] Essay submission + async AI scoring
- [ ] Adaptive recommendation engine (rule-based)

**Milestone:** Streak fires daily; badge auto-awards; speech returns pronunciation score in <30s

---

### Phase 5 — Teacher/Admin/Analytics (Weeks 15–17)
**Goal:** Teacher tools, admin controls, full analytics suite

- [ ] Teacher dashboard: per-course metrics, student progress table
- [ ] Writing review queue with inline feedback editor
- [ ] Admin: user management, platform KPIs, course moderation
- [ ] Analytics: activity heatmap, skill radar chart, XP time-series

**Milestone:** Teacher sees which exercises students fail most; admin can suspend users

---

### Phase 6 — Performance, Security, Production Readiness (Weeks 18–20)
**Goal:** 100k+ concurrent users, security-hardened, deployable to AWS

- [ ] k6 load test: 100k concurrent users, target p95 < 200ms
- [ ] N+1 query audit + index optimization
- [ ] Bundle analysis + code splitting (lazy load exercise components)
- [ ] OWASP ZAP security scan + remediation
- [ ] Helmet.js security headers, DOMPurify for user content
- [ ] Terraform: all AWS infrastructure as code
- [ ] Multi-AZ RDS + ElastiCache cluster mode
- [ ] Blue/green ECS deployment strategy
- [ ] Sentry + Datadog APM + CloudWatch alarms
- [ ] WCAG 2.1 AA accessibility audit
- [ ] GDPR compliance (data deletion, export, cookie consent)

**Milestone:** Load test passes p95 < 200ms; zero critical security findings; deploy to prod

---

## 17. Developer Quickstart

```bash
# Prerequisites: Node.js 20+, Docker Desktop

# 1. Clone and install
git clone https://github.com/linguameister/platform.git
cd linguameister && npm install

# 2. Configure environment
cp .env.example .env
# Fill in: OPENAI_API_KEY, AWS_*, GOOGLE_CLIENT_*

# 3. Start infrastructure
docker-compose up -d

# 4. Run migrations + seed data
npm run db:migrate --workspace=apps/api
npm run db:seed --workspace=apps/api

# 5. Start all dev servers
npm run dev

# 6. Open
# App:        http://localhost:3000
# API:        http://localhost:3001/api/v1
# API Docs:   http://localhost:3001/api/docs  (Swagger)
# MailHog:    http://localhost:8025

# Seeded credentials:
# Admin:    admin@linguameister.com   / Admin1234!
# Teacher:  teacher@linguameister.com / Teacher1234!
# Student:  student@linguameister.com / Student1234!
```

---

## 18. Critical Files (Start Here)

| File | Why Critical |
|---|---|
| `infrastructure/scripts/init.sql` | Complete DDL — must exist before any service code |
| `apps/api/src/modules/exercises/evaluators/evaluator.factory.ts` | Core exercise dispatch — all 8 types route here |
| `apps/api/src/modules/auth/auth.service.ts` | JWT rotation + reuse detection — security-critical |
| `apps/web/src/lib/api.ts` | Axios + refresh interceptor — bug here breaks all API calls |
| `packages/shared-types/src/index.ts` | Data contracts shared between frontend and backend |
| `apps/api/src/modules/gamification/xp/xp.service.ts` | Central XP award — called after every lesson/exercise |
| `apps/api/src/modules/vocabulary/srs/sm2.algorithm.ts` | SM-2 SRS — powers the entire vocabulary system |

---

## 19. Architecture Decision Log

| Decision | Rationale |
|---|---|
| **Monorepo (Turborepo)** | Shared types between FE/BE eliminate contract drift; incremental builds via cache |
| **Next.js App Router** | Server components shrink client bundle; layouts enable persistent nav |
| **NestJS + TypeORM** | DI pattern makes testing clean; migration system is mature |
| **PostgreSQL over MongoDB** | Relational integrity for enrollment/progress; JSONB for flexible exercise content |
| **Redis Sorted Sets for Leaderboard** | O(log n) insert/query — top-100 with zero DB queries |
| **SM-2 for Vocabulary SRS** | Battle-tested algorithm (Anki, 80M+ users); simple in-house implementation |
| **Evaluator Factory Pattern** | Open/closed principle — new exercise type = new file only, zero changes to existing code |
| **Presigned S3 URLs** | Large files upload browser→S3 directly; API server never handles binary data |
| **Async Speech via SQS** | Whisper + GPT-4 takes 5–15s; 202 Accepted + polling gives better UX than blocking |
| **JWT in body + Refresh in httpOnly Cookie** | Access token in memory prevents XSS theft; httpOnly cookie prevents JS access to refresh token |

---

*Generated for LinguaMeister — German Language Learning LMS*
*Performance target: 100,000+ concurrent learners · CEFR A1–C2*
