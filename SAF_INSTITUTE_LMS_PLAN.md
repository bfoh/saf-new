# SAF Institute — Complete School Management & LMS Implementation Plan

> Comprehensive, one-stop language school management and learning system tailored for the **SAF Institute** in Ghana, focused on Goethe-Zertifikat (A1-C2) preparation.

---

## 1. Brand Identity & Localization

| Token | Value |
|---|---|
| **Brand Name** | SAF Institute |
| **Locations** | Accra & Kumasi (System must support Multi-Branch Management) |
| **Fonts** | Poppins (Headings) & Inter (Body) |
| **Logos & Assets** | Use official SAF Institute logo (`saflogo.png`) and brand guidelines for all UI components, Navbar, and Footer. Integrate seamlessly with the existing `safinstitute.netlify.app` landing page. |
| **Location Focus** | Ghana (support for local payment gateways like Paystack/Mobile Money, along with standard gateways). |
| **Design Style** | Modern, Clean, Academic, Professional — prioritizing usability for administrators, teachers, and students. |

---

## 2. Platform Core Modules (One-Stop Shop)

The system is a unified platform integrating operations, teaching, and learning:

### 2.1. School Administration (ERP Setup)
*   **Branch Management:** Support for multiple campus locations (e.g., Accra and Kumasi) with branch-specific scheduling and reporting.
*   **Student Management:** Complete profiles, enrollment history, tuition payment tracking, document uploads, and **Visa Consultation** tracking.
*   **Instructor Management:** Teacher profiles, class assignments, working hours, and performance tracking.
*   **Class & Cohort Management:** Assign students to specific intake cohorts (e.g., "A1 Weekend Class - Accra Campus"), assign teachers, schedule live sessions, and track attendance.

### 2.2. Goethe-Zertifikat Learning Management System (LMS)
*   **Syllabus Alignment:** Courses strictly modeled after the Goethe-Institut curriculum covering A1, A2, B1, B2, C1, and C2.
*   **Core Competencies (The 4 Modules):**
    1.  **Hören (Listening):** Audio player integration with transcripts and related exercises. Enhanced with **AI Teaching Agent** to generate dynamic listening scenarios and provide interactive Q&A based on the audio.
    2.  **Lesen (Reading):** Text comprehension tasks built around blog posts, emails, and articles.
    3.  **Schreiben (Writing):** Essay and email submission forms with word counts, manual teacher review, and AI grammar correction.
    4.  **Sprechen (Speaking):** Audio recording capabilities augmented by an **Interactive AI Teaching Agent**. Students can engage in real-time, two-way conversational role-plays (e.g., ordering at a restaurant, visa interviews) simulating the Goethe speaking exam.

### 2.3. Student Dashboard & Exam Engine
*   **Interactive Dashboard:** Students log in to view their timetables, upcoming assignments, and track their course progression.
*   **Exercises & Assignments:** Complete homework, vocabulary practice, and daily exercises.
*   **Mock Exams & Practice Tests:** 
    *   Timed, full-length simulation of the Goethe-Zertifikat exams.
    *   Automated grading for Lesen and Hören.
    *   Submission queues for Schreiben and Sprechen to be graded by SAF Institute instructors or pre-screened by AI.

### 2.4. Public Landing Page & AI Voice Agent Integration
*   **AI Voice Agent (Receptionist):** Embedded on the public `safinstitute.netlify.app` landing page.
    *   Answers prospective student FAQs (pricing, course schedules, visa requirements).
    *   Handles consultation appointment bookings (syncs with staff calendars).
    *   Facilitates initial student enrollment and relays lead/enrollment data directly to the backend ERP (Classes & Cohorts).

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript, TailwindCSS |
| **Backend** | Node.js, NestJS, TypeORM |
| **Database** | PostgreSQL 16 |
| **Storage** | AWS S3 + CloudFront CDN (for audio, syllabus files, and assets) |
| **AI (Voice & Processing)** | OpenAI Realtime API / ElevenLabs (for Conversational Voice Agents), Whisper (STT), GPT-4o (grammar/essay feedback, logic) |

---

## 4. System Architecture & Boundaries

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│                                                                     │
│   Student Portal (Dashboard, LMS, Mock Exams)                       │
│   Teacher Portal (Grading, Class Registers)                         │
│   Admin Portal (Billing, Enrollments, CMS)                          │
│   Public Website (AI Voice Agent Widget)                            │
└─────────────────────┬───────────────────────────────────────────────┘
                      │ HTTPS / WebSockets (for Voice)
┌─────────────────────▼───────────────────────────────────────────────┐
│                    API SERVICES (NestJS)                            │
│                                                                     │
│  AuthService         - JWT, role-based access (Admin/Teacher/Student)
│  SchoolAdminService  - Cohorts, enrollments, tuition tracking       │
│  CoursesService      - A1-C2 Curriculum, lessons, modules           │
│  ExamEngineService   - Timed mock exams, practice tests             │
│  AssignmentsService  - Homework dispatch and grading                │
│  AIAgentsService     - Manages Voice CRM Sync & Conversational Tutors│
└─────┬──────────────┬─────────────────────┬──────────────────────────┘
      │              │                     │
   PostgreSQL       AWS S3             Redis (Caching & Leaderboards)
```

### 4.1. Monorepo Folder Structure
To cleanly integrate the public landing page with the newly built backend and LMS, we will use a Turborepo monorepo:

```
saf-linguameister/
├── apps/
│   ├── api/                          # NestJS Backend (ERP, LMS Engine, AI Agents)
│   ├── lms-web/                      # Next.js Frontend (Student/Teacher/Admin Portals)
│   └── website/                      # React+Vite Frontend (Provided Landing Page)
├── packages/
│   ├── shared-types/                 # Shared TypeScript interfaces (e.g. cefr_level)
│   └── ui-kit/                       # Shared Tailwind components (Buttons, Inputs)
├── package.json
└── turbo.json
```

---

## 5. Database Schema Additions (DDL Overview)

In addition to standard user and course tables, the platform requires specialized tables for the SAF Institute paradigm:

```sql
-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'superadmin');
CREATE TYPE cefr_level AS ENUM ('A1','A2','B1','B2','C1','C2');
CREATE TYPE goethe_module AS ENUM ('hören','lesen','schreiben','sprechen');

-- CLASSES / COHORTS (School Management)
CREATE TABLE classes (
  id              UUID PRIMARY KEY,
  name            VARCHAR(255) NOT NULL, -- e.g., "A1 Intensive - Accra"
  branch_id       UUID, -- To support Accra / Kumasi separation
  teacher_id      UUID REFERENCES users(id),
  cefr_level      cefr_level NOT NULL,
  start_date      DATE,
  end_date        DATE,
  status          VARCHAR(50) -- 'enrolling', 'active', 'completed'
);

CREATE TABLE class_enrollments (
  class_id        UUID REFERENCES classes(id),
  student_id      UUID REFERENCES users(id),
  tuition_paid    BOOLEAN DEFAULT false,
  PRIMARY KEY (class_id, student_id)
);

-- EXAMS (Mock & Practice)
CREATE TABLE mock_exams (
  id              UUID PRIMARY KEY,
  title           VARCHAR(255),
  cefr_level      cefr_level NOT NULL,
  duration_mins   INT,
  is_published    BOOLEAN DEFAULT false
);

CREATE TABLE exam_sections (
  id              UUID PRIMARY KEY,
  mock_exam_id    UUID REFERENCES mock_exams(id),
  module_type     goethe_module NOT NULL, -- Hören, Lesen, etc.
  content         JSONB NOT NULL,
  max_score       INT
);

CREATE TABLE exam_submissions (
  id              UUID PRIMARY KEY,
  student_id      UUID REFERENCES users(id),
  mock_exam_id    UUID REFERENCES mock_exams(id),
  score_lesen     INT,
  score_horen     INT,
  score_schreibung INT,
  score_sprechen  INT,
  teacher_feedback TEXT,
  status          VARCHAR(50) -- 'submitted', 'grading', 'graded'
);
```

---

## 6. Execution Map & Development Phases

### Phase 1: Foundation & Brand Identity
*   Setup Turborepo monorepo workspace.
*   **Website Integration:** Move the existing `website` (React+Vite) folder into `apps/website` and ensure it runs within the monorepo.
*   Setup `apps/api` (NestJS) and `apps/lms-web` (Next.js).
*   Integrate SAF Institute Logos (`saflogo.png`), Poppins/Inter typography, and Brand Colors across all apps.
*   Implement Authentication and Role-Based Access Control (Admin, Teacher, Student).
*   Setup database schema for Users, Branches (Accra/Kumasi), and School profiles.
*   **Routing Integration:** Establish subdomain mapping (e.g., `portal.safinstitute.com`) to connect the Next.js LMS portal securely alongside the Vite public website.

### Phase 2: School Administration & ERP
*   Build the Admin Dashboard.
*   Implement Cohort/Class creation, scheduling, and teacher assignments.
*   Implement Student Enrollment workflows and internal tuition tracking.
*   **Integrate AI Voice Agent (Public Site):** Deploy the conversational voice agent widget to handle inquiries, book consultations, and auto-populate leads/enrollments into the new ERP.

### Phase 3: Goethe-Zertifikat Curriculum Builder (LMS)
*   Build the Course Engine to support A1-C2 structures.
*   Support rich content blocks: text, video, and audio (for *Hören* exercises).
*   Implement assignment dispatching (teachers assigning homework to specific cohorts).
*   **Integrate AI Teaching Agent:** Build the conversational tutor module for *Sprechen* (role-plays) and dynamic *Hören* query resolution.

### Phase 4: The Exam Engine & Mock Tests
*   Develop the timed Exam Interface for students mimicking the Goethe format.
*   Implement automated grading for *Lesen* (multiple choice/matching) and *Hören*.
*   Build the Teacher Review interface for grading *Schreiben* (essays/emails) and *Sprechen* (audio uploads).

### Phase 5: Student Dashboard & Gamification
*   Build the interactive student portal (progress charts, upcoming live classes, assignment deadlines).
*   (Optional) Integrate XP and gamification to encourage daily practice.

### Phase 6: Final Polish, Analytics & Deployment
*   Implement administrative reporting (student pass rates, attendance stats, class capacity).
*   Load testing and final security audits.
*   Deployment to AWS, securing domains, and configuring automated backups.
