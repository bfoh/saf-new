-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP EXISTING TABLES AND TYPES TO ALLOW CLEAN RE-RUNS
DROP TABLE IF EXISTS writing_submissions      CASCADE;
DROP TABLE IF EXISTS analytics_events         CASCADE;
DROP TABLE IF EXISTS user_badges              CASCADE;
DROP TABLE IF EXISTS badges                   CASCADE;
DROP TABLE IF EXISTS user_streaks             CASCADE;
DROP TABLE IF EXISTS xp_transactions          CASCADE;
DROP TABLE IF EXISTS user_xp                  CASCADE;
DROP TABLE IF EXISTS vocabulary_srs           CASCADE;
DROP TABLE IF EXISTS vocabulary_items         CASCADE;
DROP TABLE IF EXISTS vocabulary_lists         CASCADE;
DROP TABLE IF EXISTS exercise_attempts        CASCADE;
DROP TABLE IF EXISTS exercises                CASCADE;
DROP TABLE IF EXISTS lesson_progress          CASCADE;
DROP TABLE IF EXISTS class_enrollments        CASCADE;
DROP TABLE IF EXISTS enrollments              CASCADE;
DROP TABLE IF EXISTS lessons                  CASCADE;
DROP TABLE IF EXISTS course_modules           CASCADE;
DROP TABLE IF EXISTS courses                  CASCADE;
DROP TABLE IF EXISTS student_progress         CASCADE;
DROP TABLE IF EXISTS lesson_completions       CASCADE;

-- Dropping SAF specific tables
DROP TABLE IF EXISTS exam_submissions         CASCADE;
DROP TABLE IF EXISTS exam_sections            CASCADE;
DROP TABLE IF EXISTS mock_exams               CASCADE;
DROP TABLE IF EXISTS class_enrollments        CASCADE;
DROP TABLE IF EXISTS assignments              CASCADE;
DROP TABLE IF EXISTS invoices                 CASCADE;
DROP TABLE IF EXISTS classes                  CASCADE;
DROP TABLE IF EXISTS branches                 CASCADE;
DROP TABLE IF EXISTS profiles                 CASCADE;

-- Dropping types
DROP TYPE IF EXISTS badge_type                CASCADE;
DROP TYPE IF EXISTS content_block_type        CASCADE;
DROP TYPE IF EXISTS exercise_type             CASCADE;
DROP TYPE IF EXISTS cefr_level                CASCADE;
DROP TYPE IF EXISTS user_role                 CASCADE;
DROP TYPE IF EXISTS goethe_module             CASCADE;

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'instructor', 'admin', 'superadmin');
CREATE TYPE cefr_level AS ENUM ('A1','A2','B1','B2','C1','C2');
CREATE TYPE goethe_module AS ENUM ('hören','lesen','schreiben','sprechen');

-- PROFILES (linked to Supabase Auth - id matches auth.users.id)
-- NOTE: Supabase Auth manages authentication; this table stores app-specific profile data.
-- The id column is NOT auto-generated — it is supplied by Supabase Auth (UUID from auth.users).
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  first_name  TEXT NOT NULL DEFAULT '',
  last_name   TEXT NOT NULL DEFAULT '',
  role        user_role NOT NULL DEFAULT 'student',
  cefr_level  cefr_level NOT NULL DEFAULT 'A1',
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  visa_status TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BRANCHES
CREATE TABLE branches (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  address         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CLASSES / COHORTS (School Management)
CREATE TABLE classes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL, -- e.g., "A1 Intensive - Accra"
  branch_id       UUID REFERENCES branches(id),
  teacher_id      UUID REFERENCES profiles(id),
  cefr_level      cefr_level NOT NULL,
  start_date      DATE,
  end_date        DATE,
  status          VARCHAR(50), -- 'enrolling', 'active', 'completed'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE class_enrollments (
  class_id        UUID REFERENCES classes(id),
  student_id      UUID REFERENCES profiles(id),
  tuition_paid    BOOLEAN DEFAULT false,
  PRIMARY KEY (class_id, student_id)
);

-- INVOICES
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cohort_name     VARCHAR(255) NOT NULL,
  amount          DECIMAL(10, 2) NOT NULL,
  date_issued     DATE NOT NULL DEFAULT CURRENT_DATE,
  status          VARCHAR(50) DEFAULT 'Pending' -- 'Paid', 'Pending', 'Overdue'
);

-- EXAMS (Mock & Practice)
CREATE TABLE mock_exams (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(255),
  cefr_level      cefr_level NOT NULL,
  duration_mins   INT,
  is_published    BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exam_sections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mock_exam_id    UUID REFERENCES mock_exams(id),
  module_type     goethe_module NOT NULL,
  content         JSONB NOT NULL,
  max_score       INT
);

CREATE TABLE exam_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID REFERENCES profiles(id),
  mock_exam_id    UUID REFERENCES mock_exams(id),
  score_lesen     INT,
  score_horen     INT,
  score_schreibung INT,
  score_sprechen  INT,
  teacher_feedback TEXT,
  status          VARCHAR(50), -- 'submitted', 'grading', 'graded'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CURRICULUM BUILDER (LMS)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  cefr_level cefr_level NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  order_index INT NOT NULL
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_data JSONB,
  order_index INT NOT NULL
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE
);

-- GAMIFICATION & DASHBOARD
CREATE TABLE student_progress (
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  xp_points INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- AUTO-CREATE PROFILE ON SUPABASE AUTH SIGNUP
-- This trigger fires whenever a new user is created in Supabase Auth.
-- It inserts a matching row in the public.profiles table automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Safely extract role from app_metadata; default to 'student' if missing or invalid
  BEGIN
    v_role := (NEW.raw_app_meta_data->>'role')::user_role;
  EXCEPTION WHEN invalid_text_representation OR others THEN
    v_role := 'student'::user_role;
  END;

  IF v_role IS NULL THEN
    v_role := 'student'::user_role;
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    v_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
