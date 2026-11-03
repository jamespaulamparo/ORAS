# Antigravity: Start Here — Build the Student Schedule Planner

You are building a complete, working web application from scratch. Before coding, read `STUDENT_SCHEDULE_PLANNER_PROJECT_SPEC.md` in full. That document is the detailed source of truth for product scope, user workflows, scheduling rules, database design, visual design, architecture, testing, and acceptance criteria.

## Your task

Implement the Student Schedule Planner as specified. It is a student-controlled timetable planning tool for regular and irregular university students. Students receive their intended subjects and available sections from their class adviser or department; they enter that information manually or import a structured Excel/CSV spreadsheet. The application helps them organize offerings, detect time conflicts, generate compatible section combinations, manually edit schedules, save alternatives, and export a polished timetable.

## Required stack

- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS with a custom token-based design system.
- Routing: React Router.
- Server data: TanStack Query or one consistent equivalent.
- Forms: React Hook Form + Zod where appropriate.
- Backend: Python + Django + Django REST Framework.
- Database: PostgreSQL.
- Solver: Google OR-Tools CP-SAT.
- Spreadsheet support: openpyxl for `.xlsx`, standard Python `csv` support for `.csv`.
- Icons: Lucide.
- Export: print stylesheet/browser print flow for PDF and a maintained DOM-to-image library for PNG.

Use compatible supported stable versions and pin dependencies. Prefer a same-origin deployment arrangement for straightforward session/CSRF security.

## Non-negotiable scope boundaries

Build only the scheduling product in this release. Do not add curriculum advising, prerequisite/eligibility checking, grades/GWA, attendance, assignments, task management, campus directories, announcements, Dean/adviser approval, official enrollment, school database integration, OCR, photo/PDF import, QR scanning, native applications, or social features.

Do not add AI of any kind. No chatbot, LLM, generative recommendations, AI summaries, natural-language processing, AI branding, or AI API integration. Schedule generation must use explicit constraints and OR-Tools. Spreadsheet import must process structured rows and let the user review them.

Do not invent a brand name, slogan, tagline, marketing copy, or generic callout content. Use `Student Schedule Planner` as a neutral working title until the user supplies a real name.

## Visual direction

Use Ellipsus only as a reference for the qualities of its design: minimalist, soft, polished, cohesive, and typography-led. Do not copy its exact UI, assets, brand, or layout. Create an original interface with warm/soft neutral surfaces, refined typography, restrained borders, quiet spacing, subtle interactions, and coordinated themes. Include at least Paper, Mist, Sage, Lavender, Clay, Ocean, Graphite, and Midnight theme presets. Subject colors should be stable, muted, readable, and customizable.

Do not use generic admin-dashboard styling, gradients, loud shadows, glassmorphism, decorative stock photos, mascots, emoji icons, excessive cards, constant badges, fake charts, random feature callouts, or large marketing hero sections. Every visible control must work. Keep the schedule itself central.

Desktop should have a clear timetable workspace. Mobile must switch to a readable day/agenda view rather than squeezing an entire week into tiny columns. Support week/day/compact views and display modes for course, room, instructor, section, meeting type, and time.

## Core correctness requirements

- Separate Course, Offering/Section, and MeetingSession in the data model.
- One course may have multiple alternative offerings/sections.
- One offering may have multiple recurring meeting sessions.
- Each session has its own day, exact start time, exact end time, and optional room/meeting type.
- Support any valid minute duration; do not snap to one-hour increments.
- Default visual hours may be 8 AM–5 PM, but classes outside those hours must remain valid and expand the view.
- A and B overlap only when `a.start < b.end && b.start < a.end` on a shared weekday. Exact back-to-back classes are allowed.
- The student chooses which courses they intend to take. The generator chooses exactly one offering per required course.
- Hard constraints: all requested courses represented exactly once, no overlapping selected sessions, no excluded offerings, valid meeting data.
- Soft preferences only rank valid options: compact week, fewer gaps, later starts, balanced week, or no preference.
- Generate a small bounded number of distinct alternatives (default 3–5). Never return a conflicting schedule as valid.
- Explain conflicts with the actual course names, day, and overlapping time.
- Do not infer whether the student is academically eligible for a subject.

## Spreadsheet requirements

Accept `.xlsx` and `.csv` only. Provide a downloadable `.xlsx` template. Canonical columns:

`course_code, course_title, section, days, start_time, end_time, room, instructor, units, meeting_type`

One row represents one meeting pattern. Rows with the same course code and section form one offering with multiple sessions. Different section identifiers are alternatives. Build a real import wizard: file selection, sheet selection, column mapping, preview, row-level validation, correction/exclusion of bad rows, explicit confirmation, and post-import editing. Do not silently ignore invalid rows or guess groupings when a section/group key is absent.

## Build process

1. Inspect the current workspace. Do not overwrite valid work without understanding it. If empty, scaffold the project.
2. Read the full specification and create a milestone checklist.
3. Build Milestone 0 (foundation, authentication, database, design shell) and verify it runs.
4. Build Milestone 1 (manual offerings, multi-session timetable, conflict detection) with backend tests.
5. Build Milestone 2 (Excel/CSV import wizard) with parser and import tests.
6. Build Milestone 3 (OR-Tools generator and preference ranking) with solver tests.
7. Build Milestone 4 (saved schedules, themes, display modes, PDF/PNG export).
8. Build Milestone 5 (responsive polish, accessibility, security, end-to-end testing, optional PWA installability).

Work in vertical slices. After each milestone, run tests, resolve errors, and verify the UI in a browser. Do not generate the whole application in one unverified burst. Do not leave placeholder buttons or mock behavior. Keep the implementation modular and avoid unnecessary infrastructure or dependencies.

## Required final deliverables

- Complete frontend and backend source code.
- PostgreSQL schema through Django models and migrations.
- `.env.example` with no real secrets.
- Repeatable local development instructions; Docker Compose is preferred for PostgreSQL if practical.
- Downloadable sample Excel template.
- Clearly labelled demo data only, never disguised as real school offerings.
- Automated tests for interval conflicts, multi-session offerings, solver validity, solver infeasibility, import parsing/grouping, and cross-user access isolation.
- Browser-tested critical flows and responsive layouts.
- README with setup, run, test, migration, import-template, and deployment instructions.
- A short `docs/DECISIONS.md` for important implementation choices that were not explicitly prescribed.
- A final summary that distinguishes completed features from known limitations.

Start by inspecting the workspace and reading the specification. Then proceed with Milestone 0. Do not ask the user to restate decisions already made in the specification.
